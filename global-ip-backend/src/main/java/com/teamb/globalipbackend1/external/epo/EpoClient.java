package com.teamb.globalipbackend1.external.epo;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.teamb.globalipbackend1.dto.patent.GlobalPatentDetailDto;
import com.teamb.globalipbackend1.dto.search.PatentSearchFilter;
import com.teamb.globalipbackend1.external.epo.config.EpoProperties;
import com.teamb.globalipbackend1.external.epo.dto.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import com.fasterxml.jackson.databind.DeserializationFeature;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.function.Function;

@Component
@Slf4j
@RequiredArgsConstructor
public class EpoClient {

    private final EpoProperties properties;
    private final EpoPublicationParser parser;

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final XmlMapper xmlMapper = (XmlMapper) new XmlMapper()
            .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

    private String accessToken;
    private Instant expiry = Instant.EPOCH;

    private synchronized String token() {
        if (accessToken != null && Instant.now().isBefore(expiry)) return accessToken;

        try {
            String auth = Base64.getEncoder().encodeToString(
                    (properties.consumerKey() + ":" + properties.consumerSecret()).getBytes()
            );

            HttpRequest req = HttpRequest.newBuilder()
                    .uri(URI.create("https://ops.epo.org/3.2/auth/accesstoken"))
                    .POST(HttpRequest.BodyPublishers.ofString("grant_type=client_credentials"))
                    .header("Authorization", "Basic " + auth)
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .build();

            HttpResponse<String> res = httpClient.send(req, HttpResponse.BodyHandlers.ofString());
            JsonNode json = new ObjectMapper().readTree(res.body());

            accessToken = json.get("access_token").asText();
            expiry = Instant.now().plusSeconds(json.get("expires_in").asLong() - 60);

            return accessToken;
        } catch (Exception e) {
            throw new RuntimeException("OPS token failure", e);
        }
    }

    public GlobalPatentDetailDto fetchGlobalDetail(String publicationNumber) {

        EpoDocumentId id = parser.parse(publicationNumber);

        List<EpoExchangeDocument> docs = fetchBiblio(id);
        if (docs.isEmpty()) return null;

        // Prefer B1 if present
        EpoExchangeDocument doc =
                docs.stream()
                        .sorted((a, b) -> {
                            if ("B1".equals(a.getKind())) return -1;
                            if ("B1".equals(b.getKind())) return 1;
                            return 0;
                        })
                        .findFirst()
                        .orElse(docs.getFirst());

        EpoBibliographicData b = doc.getBibliographicData();

        GlobalPatentDetailDto dto = new GlobalPatentDetailDto();
        dto.setPublicationNumber(publicationNumber);
        dto.setJurisdiction(id.getCountry());
        dto.setWipoKind(doc.getKind()); // Use actual kind from document

        dto.setTitle(first(b.getInventionTitles(), EpoTitle::getValue));

        // Try to get abstract from biblio first
        String abstractText = extractAbstract(b);

        // If no abstract in biblio, try dedicated abstract endpoint
        if (abstractText == null || abstractText.isBlank()) {
            List<EpoAbstract> abstracts = fetchAbstract(id);
            abstractText = abstracts.stream()
                    .filter(a -> "en".equalsIgnoreCase(a.getLang()))
                    .map(EpoAbstract::getValue)
                    .findFirst()
                    .orElse(null);
        }
        dto.setAbstractText(abstractText);

        dto.setAssignees(extractApplicants(b));
        dto.setInventors(extractInventors(b));
        dto.setIpcClasses(extractIpc(b));
        dto.setCpcClasses(extractCpc(b));

        // Extract dates
        dto.setFilingDate(extractFilingDate(b));
        dto.setGrantDate(extractPublicationDate(b));

        return dto;
    }

    private HttpResponse<String> send(String url) throws Exception {
        return httpClient.send(
                HttpRequest.newBuilder()
                        .uri(URI.create(url))
                        .header("Authorization", "Bearer " + token())
                        .header("Accept", "application/xml")
                        .timeout(Duration.ofSeconds(30))
                        .build(),
                HttpResponse.BodyHandlers.ofString()
        );
    }

    private String buildUrl(EpoDocumentId id, String resource) {
        String fmt = "EP".equals(id.getCountry()) ? "epodoc" : "docdb";
        String ident = fmt.equals("epodoc")
                ? id.getCountry() + id.getDocNumber() + id.getKind()
                : id.getCountry() + "." + id.getDocNumber() + "." + id.getKind();

        return properties.baseUrl() + "/rest-services/published-data/publication/"
                + fmt + "/" + ident + "/" + resource;
    }

    private String extractAbstract(EpoBibliographicData b) {
        if (b.getAbstracts() == null || b.getAbstracts().isEmpty()) return null;
        return b.getAbstracts().stream()
                .filter(a -> "en".equalsIgnoreCase(a.getLang()))
                .map(EpoAbstract::getValue)
                .filter(v -> v != null && !v.isBlank())
                .findFirst()
                .orElse(b.getAbstracts().getFirst().getValue()); // Fallback to first abstract
    }

    private List<String> extractApplicants(EpoBibliographicData b) {
        if (b.getParties() == null || b.getParties().getApplicants() == null) return List.of();
        return b.getParties().getApplicants().getList()
                .stream()
                .map(a -> a.getName().getValue())
                .filter(name -> name != null && !name.isBlank())
                .distinct()
                .toList();
    }

    private List<String> extractInventors(EpoBibliographicData b) {
        if (b.getParties() == null || b.getParties().getInventors() == null) return List.of();
        return b.getParties().getInventors().getList()
                .stream()
                .map(i -> i.getName().getValue())
                .filter(name -> name != null && !name.isBlank())
                .map(name -> name.replaceAll(",\\s*$", "").trim()) // Remove trailing comma
                .distinct()
                .toList();
    }

    private List<String> extractIpc(EpoBibliographicData b) {
        List<EpoIpcClassification> ipcList = b.getIpcList();
        if (ipcList == null || ipcList.isEmpty()) return List.of();

        return ipcList.stream()
                .map(EpoIpcClassification::getFullClassificationCode)
                .filter(code -> code != null && !code.isBlank())
                .distinct()
                .toList();
    }

    private List<String> extractCpc(EpoBibliographicData b) {
        List<EpoCpcClassification> cpcList = b.getCpcList();
        if (cpcList == null || cpcList.isEmpty()) return List.of();

        return cpcList.stream()
                .map(EpoCpcClassification::getFullClassificationCode)
                .filter(code -> code != null && !code.isBlank())
                .distinct()
                .toList();
    }

    private LocalDate extractFilingDate(EpoBibliographicData b) {
        if (b.getApplicationReference() == null ||
                b.getApplicationReference().getDocumentId() == null) {
            return null;
        }

        String dateStr = b.getApplicationReference().getDocumentId().getDate();
        return parseDate(dateStr);
    }

    private LocalDate extractPublicationDate(EpoBibliographicData b) {
        if (b.getPublicationReference() == null ||
                b.getPublicationReference().getDocumentId() == null) {
            return null;
        }

        String dateStr = b.getPublicationReference().getDocumentId().getDate();
        return parseDate(dateStr);
    }

    private LocalDate parseDate(String dateStr) {
        if (dateStr == null || dateStr.isBlank()) return null;

        try {
            // EPO dates are in format YYYYMMDD
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
            return LocalDate.parse(dateStr, formatter);
        } catch (Exception e) {
            log.warn("Failed to parse date: {}", dateStr, e);
            return null;
        }
    }

    private <T> String first(List<T> list, Function<T, String> fn) {
        return list == null || list.isEmpty() ? null : fn.apply(list.getFirst());
    }

    public List<EpoDocumentId> searchByTitle(String titleKeyword) {
        try {
            String query = "ti=" + URLEncoder.encode(titleKeyword, StandardCharsets.UTF_8);

            String base = properties.baseUrl();
            if (base.endsWith("/rest-services")) {
                base = base.substring(0, base.length() - 14);
            }

            String url = base + "/rest-services/published-data/searchByKeyword?q=" + query;

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Authorization", "Bearer " + token())
                    .header("Accept", "application/xml")
                    .header("X-OPS-Range", "1-25")
                    .header("User-Agent", "global-ip/1.0 (academic project)")
                    .timeout(Duration.ofSeconds(30))
                    .GET()
                    .build();

            HttpResponse<String> response =
                    httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                log.warn("EPO searchByKeyword failed [{}]: {}", response.statusCode(), response.body());
                return List.of();
            }

            EpoSearchResponse searchResponse =
                    xmlMapper.readValue(response.body(), EpoSearchResponse.class);

            if (searchResponse == null ||
                    searchResponse.getBiblioSearch() == null ||
                    searchResponse.getBiblioSearch().getSearchResult() == null ||
                    searchResponse.getBiblioSearch().getSearchResult().getPublications() == null) {
                return List.of();
            }

            return searchResponse.getBiblioSearch()
                    .getSearchResult()
                    .getPublications()
                    .stream()
                    .map(EpoPublicationReferenceSearch::getDocumentId)
                    .filter(id -> id.getKind() != null)
                    .toList();

        } catch (Exception e) {
            log.error("EPO title searchByKeyword failed for [{}]", titleKeyword, e);
            return List.of();
        }
    }

    public List<EpoAbstract> fetchAbstract(EpoDocumentId id) {
        try {
            String url = buildUrl(id, "abstract");
            HttpResponse<String> res = send(url);

            if (res.statusCode() != 200 || res.body() == null || res.body().isBlank()) {
                log.debug("No abstract available for {}{}{}",
                        id.getCountry(), id.getDocNumber(), id.getKind());
                return List.of();
            }

            EpoBiblioResponse response =
                    xmlMapper.readValue(res.body(), EpoBiblioResponse.class);

            if (response == null ||
                    response.getExchangeDocuments() == null ||
                    response.getExchangeDocuments().getDocuments() == null ||
                    response.getExchangeDocuments().getDocuments().isEmpty()) {
                return List.of();
            }

            EpoExchangeDocument doc =
                    response.getExchangeDocuments().getDocuments().getFirst();

            if (doc.getBibliographicData() == null ||
                    doc.getBibliographicData().getAbstracts() == null) {
                return List.of();
            }

            return doc.getBibliographicData().getAbstracts();

        } catch (Exception e) {
            log.debug("Abstract fetch failed for {}{}{}",
                    id.getCountry(), id.getDocNumber(), id.getKind(), e);
            return List.of();
        }
    }

    public List<EpoExchangeDocument> fetchBiblio(EpoDocumentId id) {
        try {
            String url = buildUrl(id, "biblio");
            HttpResponse<String> res = send(url);

            if (res.statusCode() != 200 || res.body() == null || res.body().isBlank()) {
                log.debug("No biblio available for {}{}{}",
                        id.getCountry(), id.getDocNumber(), id.getKind());
                return List.of();
            }

            EpoBiblioResponse response =
                    xmlMapper.readValue(res.body(), EpoBiblioResponse.class);

            if (response == null ||
                    response.getExchangeDocuments() == null ||
                    response.getExchangeDocuments().getDocuments() == null) {
                return List.of();
            }

            return response.getExchangeDocuments().getDocuments();

        } catch (Exception e) {
            log.warn("Biblio fetch failed for {}{}{}",
                    id.getCountry(), id.getDocNumber(), id.getKind(), e);
            return List.of();
        }
    }

    public String buildCqlQuery(PatentSearchFilter f) {
        List<String> parts = new ArrayList<>();

        // Keyword search - IMPORTANT: Use proper syntax
        if (f.getKeyword() != null && !f.getKeyword().isBlank()) {
            String keyword = f.getKeyword().trim().toLowerCase();

            // For multi-word keywords, use quotes
            if (keyword.contains(" ")) {
                parts.add("ti=\"" + keyword + "\"");
            } else {
                // Single word - use with wildcards for better results
                parts.add("ti=" + keyword + " or ab=" + keyword);
            }
        }

        // Assignee
        if (f.getAssignee() != null && !f.getAssignee().isBlank()) {
            String assignee = f.getAssignee().trim();
            parts.add("pa=" + assignee);
        }

        // Inventor
        if (f.getInventor() != null && !f.getInventor().isBlank()) {
            String inventor = f.getInventor().trim();
            parts.add("in=" + inventor);
        }

        // Date range - EPO is VERY picky about this
        if (f.getFilingDateFrom() != null || f.getFilingDateTo() != null) {
            String fromDate = f.getFilingDateFrom() != null
                    ? f.getFilingDateFrom().format(DateTimeFormatter.BASIC_ISO_DATE)
                    : "19000101";

            String toDate = f.getFilingDateTo() != null
                    ? f.getFilingDateTo().format(DateTimeFormatter.BASIC_ISO_DATE)
                    : LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE);

            // CRITICAL: Space between dates, not comma
            parts.add("pd within \"" + fromDate + " " + toDate + "\"");
        }

        if (parts.isEmpty()) {

            return "pd>20180101";
        }

        String query = String.join(" and ", parts);
        log.info("Built CQL query: {}", query);
        return query;
    }

    public List<EpoDocumentId> advancedSearch(PatentSearchFilter filter) {
        try {
            // Build CQL query
            String cql = buildCqlQuery(filter);
            log.info("=== EPO ADVANCED SEARCH DEBUG ===");
            log.info("Filter: {}", filter);
            log.info("Raw CQL: {}", cql);

            String encoded = URLEncoder.encode(cql, StandardCharsets.UTF_8);
            log.info("Encoded CQL: {}", encoded);

            String base = properties.baseUrl();
            if (base.endsWith("/rest-services")) {
                base = base.substring(0, base.length() - 14);
            }

            String url = base + "/rest-services/published-data/search?q=" + encoded;
            log.info("Full URL: {}", url);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Authorization", "Bearer " + token())
                    .header("Accept", "application/xml")
                    .header("X-OPS-Range", "1-25")
                    .header("User-Agent", "global-ip/1.0 (academic project)")
                    .timeout(Duration.ofSeconds(30))
                    .GET()
                    .build();

            HttpResponse<String> response =
                    httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            log.info("Response Status: {}", response.statusCode());
            log.info("Response Headers: {}", response.headers().map());
            log.info("Response Body (first 1000 chars): {}",
                    response.body().substring(0, Math.min(1000, response.body().length())));

            if (response.statusCode() == 404) {
                log.warn("404 - No results found for query: {}", cql);
                return List.of();
            }

            if (response.statusCode() != 200) {
                log.error("EPO search failed with status {}: {}",
                        response.statusCode(), response.body());
                return List.of();
            }

            // Parse response
            EpoSearchResponse searchResponse =
                    xmlMapper.readValue(response.body(), EpoSearchResponse.class);

            if (searchResponse == null) {
                log.warn("Parsed response is null");
                return List.of();
            }

            if (searchResponse.getBiblioSearch() == null) {
                log.warn("biblioSearch is null");
                return List.of();
            }

            if (searchResponse.getBiblioSearch().getSearchResult() == null) {
                log.warn("searchResult is null");
                return List.of();
            }

            if (searchResponse.getBiblioSearch().getSearchResult().getPublications() == null) {
                log.warn("publications is null");
                return List.of();
            }

            List<EpoDocumentId> results = searchResponse.getBiblioSearch()
                    .getSearchResult()
                    .getPublications()
                    .stream()
                    .map(EpoPublicationReferenceSearch::getDocumentId)
                    .filter(id -> id != null && id.getKind() != null)
                    .toList();

            log.info("Successfully parsed {} document IDs", results.size());
            log.info("=== END EPO DEBUG ===");
            return results;

        } catch (Exception e) {
            log.error("EPO advanced search failed", e);
            e.printStackTrace();
            return List.of();
        }
    }
}