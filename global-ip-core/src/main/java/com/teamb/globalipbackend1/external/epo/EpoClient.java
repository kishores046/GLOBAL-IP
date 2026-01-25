package com.teamb.globalipbackend1.external.epo;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.teamb.globalipbackend1.admin.audit.TrackApiUsage;
import com.teamb.globalipbackend1.dto.patent.GlobalPatentDetailDto;
import com.teamb.globalipbackend1.dto.search.PatentSearchFilter;
import com.teamb.globalipbackend1.external.epo.config.EpoProperties;
import com.teamb.globalipbackend1.external.epo.dto.*;
import com.teamb.globalipbackend1.service.patent.lifecycle.PatentExpiryCalculator;
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
import java.util.Objects;
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

    @TrackApiUsage(service = "EPO", action = "PATENT_DETAIL")
    public GlobalPatentDetailDto fetchGlobalDetail(String publicationNumber) {
        log.info("Fetching global detail for: {}", publicationNumber);

        EpoDocumentId id = parser.parse(publicationNumber);
        log.debug("Parsed document ID - Country: {}, DocNumber: {}, Kind: {}",
                id.getCountry(), id.getDocNumber(), id.getKind());

        List<EpoExchangeDocument> docs = fetchBiblio(id);
        if (docs.isEmpty()) {
            log.warn("No biblio documents found for: {}", publicationNumber);
            return null;
        }

        log.debug("Found {} biblio documents", docs.size());

        // Prefer B1 if present, otherwise use first document
        EpoExchangeDocument doc = docs.stream()
                .sorted((a, b) -> {
                    if ("B1".equals(a.getKind())) return -1;
                    if ("B1".equals(b.getKind())) return 1;
                    return 0;
                })
                .findFirst()
                .orElse(docs.getFirst());

        log.debug("Selected document with kind: {}", doc.getKind());

        EpoBibliographicData b = doc.getBibliographicData();

        GlobalPatentDetailDto dto = new GlobalPatentDetailDto();
        dto.setPublicationNumber(publicationNumber);
        dto.setJurisdiction(id.getCountry());

        // Set WIPO kind - use parsed kind or document kind
        String wipoKind = doc.getKind();
        if (wipoKind == null || wipoKind.isBlank()) {
            wipoKind = id.getKind();
        }
        dto.setWipoKind(wipoKind);
        log.debug("Set WIPO kind: {}", wipoKind);

        // Extract title
        String title = first(b.getInventionTitles(), EpoTitle::getValue);
        dto.setTitle(title);
        log.debug("Title: {}", title);

        // Try to get abstract from biblio first
        String abstractText = extractAbstract(b);
        log.debug("Abstract from biblio: {}", abstractText != null ? "found" : "null");

        // If no abstract in biblio, try dedicated abstract endpoint
        if (abstractText == null || abstractText.isBlank()) {
            log.debug("Attempting to fetch abstract from dedicated endpoint");
            List<EpoAbstract> abstracts = fetchAbstract(id);
            if (!abstracts.isEmpty()) {
                log.debug("Found {} abstracts from dedicated endpoint", abstracts.size());
                abstractText = abstracts.stream()
                        .filter(a -> "en".equalsIgnoreCase(a.getLang()))
                        .map(EpoAbstract::getFullText)
                        .filter(text -> text != null && !text.isBlank())
                        .findFirst()
                        .orElseGet(() -> {
                            // If no English abstract, get first available
                            return abstracts.stream()
                                    .map(EpoAbstract::getFullText)
                                    .filter(text -> text != null && !text.isBlank())
                                    .findFirst()
                                    .orElse(null);
                        });
            }
        }

        // Final check - if still null, log warning
        if (abstractText == null || abstractText.isBlank()) {
            log.warn("No abstract found for {} after trying all methods", publicationNumber);
            dto.setAbstractText(null);
        } else {
            dto.setAbstractText(abstractText);
            log.debug("Abstract set successfully, length: {}", abstractText.length());
        }

        // Extract parties with deduplication
        List<String> assignees = extractApplicants(b);
        dto.setAssignees(assignees);
        log.debug("Assignees: {}", assignees);

        List<String> inventors = extractInventors(b);
        dto.setInventors(inventors);
        log.debug("Inventors: {}", inventors);

        // Extract classifications
        List<String> ipcClasses = extractIpc(b);
        dto.setIpcClasses(ipcClasses);
        log.debug("IPC classes: {}", ipcClasses.size());

        List<String> cpcClasses = extractCpc(b);
        dto.setCpcClasses(cpcClasses);
        log.debug("CPC classes: {}", cpcClasses.size());

        // Extract dates
        LocalDate filingDate = extractFilingDate(b);
        dto.setFilingDate(filingDate);
        log.debug("Filing date: {}", filingDate);

        LocalDate grantDate = extractPublicationDate(b);
        dto.setGrantDate(grantDate);
        log.debug("Grant/Publication date: {}", grantDate);

        LocalDate expirationDate = PatentExpiryCalculator.computeExpiry(filingDate);
        dto.setExpiryDate(expirationDate);
        log.debug("Computed expiration date (EPC standard): {}", expirationDate);

        log.info("Successfully fetched global detail for: {}", publicationNumber);
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
        if (b == null || b.getAbstracts() == null || b.getAbstracts().isEmpty()) {
            log.debug("No abstracts in bibliographic data");
            return null;
        }

        log.debug("Found {} abstracts in biblio data", b.getAbstracts().size());

        // Try to find English abstract first
        String englishAbstract = b.getAbstracts().stream()
                .filter(a -> a != null && "en".equalsIgnoreCase(a.getLang()))
                .map(EpoAbstract::getFullText)
                .filter(text -> text != null && !text.isBlank())
                .findFirst()
                .orElse(null);

        if (englishAbstract != null) {
            log.debug("Found English abstract, length: {}", englishAbstract.length());
            return englishAbstract;
        }

        // Fallback to first available abstract
        String firstAbstract = b.getAbstracts().stream()
                .filter(Objects::nonNull)
                .map(EpoAbstract::getFullText)
                .filter(text -> text != null && !text.isBlank())
                .findFirst()
                .orElse(null);

        if (firstAbstract != null) {
            log.debug("Using first available abstract (non-English), length: {}", firstAbstract.length());
        } else {
            log.debug("No valid abstract text found in biblio data");
        }

        return firstAbstract;
    }

    private List<String> extractApplicants(EpoBibliographicData b) {
        if (b == null || b.getParties() == null || b.getParties().getApplicants() == null) {
            return List.of();
        }

        return b.getParties().getApplicants().getList()
                .stream()
                .filter(a -> a != null && a.getName() != null)
                .map(a -> a.getName().getValue())
                .filter(name -> name != null && !name.isBlank())
                .map(String::trim)
                .distinct()
                .toList();
    }

    private List<String> extractInventors(EpoBibliographicData b) {
        if (b == null || b.getParties() == null || b.getParties().getInventors() == null) {
            return List.of();
        }

        // Normalize inventor names to avoid duplicates like "SMITH STEVEN" and "SMITH, Steven"
        return b.getParties().getInventors().getList()
                .stream()
                .filter(i -> i != null && i.getName() != null)
                .map(i -> i.getName().getValue())
                .filter(name -> name != null && !name.isBlank())
                .map(name -> {
                    // Remove trailing comma and whitespace
                    String cleaned = name.replaceAll(",\\s*$", "").trim();
                    // Normalize format: convert "LAST, First" to "LAST First" for deduplication
                    return cleaned.replaceAll(",\\s+", " ");
                })
                .distinct()
                .toList();
    }

    private List<String> extractIpc(EpoBibliographicData b) {
        if (b == null) return List.of();

        List<EpoIpcClassification> ipcList = b.getIpcList();
        if (ipcList == null || ipcList.isEmpty()) return List.of();

        return ipcList.stream()
                .filter(ipc -> ipc != null)
                .map(EpoIpcClassification::getFullClassificationCode)
                .filter(code -> code != null && !code.isBlank())
                .distinct()
                .toList();
    }

    private List<String> extractCpc(EpoBibliographicData b) {
        if (b == null) return List.of();

        List<EpoCpcClassification> cpcList = b.getCpcList();
        if (cpcList == null || cpcList.isEmpty()) return List.of();

        return cpcList.stream()
                .filter(Objects::nonNull)
                .map(EpoCpcClassification::getFullClassificationCode)
                .filter(code -> code != null && !code.isBlank())
                .distinct()
                .toList();
    }

    private LocalDate extractFilingDate(EpoBibliographicData b) {
        if (b == null || b.getApplicationReference() == null ||
                b.getApplicationReference().getDocumentId() == null) {
            log.debug("No application reference found for filing date");
            return null;
        }

        String dateStr = b.getApplicationReference().getDocumentId().getDate();
        LocalDate date = parseDate(dateStr);

        if (date == null) {
            log.debug("Could not parse filing date from: {}", dateStr);
        }

        return date;
    }

    private LocalDate extractPublicationDate(EpoBibliographicData b) {
        if (b == null || b.getPublicationReference() == null ||
                b.getPublicationReference().getDocumentId() == null) {
            log.debug("No publication reference found for grant date");
            return null;
        }

        String dateStr = b.getPublicationReference().getDocumentId().getDate();
        LocalDate date = parseDate(dateStr);

        if (date == null) {
            log.debug("Could not parse publication date from: {}", dateStr);
        }

        return date;
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
        if (list == null || list.isEmpty()) return null;

        T firstItem = list.getFirst();
        if (firstItem == null) return null;

        return fn.apply(firstItem);
    }

    @TrackApiUsage(service = "EPO", action = "SEARCH_TITLE")
    public List<EpoDocumentId> searchByTitle(String titleKeyword) {

        if (titleKeyword == null || titleKeyword.isBlank()) {
            return List.of();
        }

        try {
            String keyword = titleKeyword.trim().toLowerCase();

            String cql = keyword.contains(" ")
                    ? "ti=\"" + keyword + "\""
                    : "ti=" + keyword;

            return executeSearch(cql);

        } catch (Exception e) {
            log.error("EPO title search failed", e);
            return List.of();
        }
    }

    @TrackApiUsage(service = "EPO", action = "SEARCH_TITLE")
    public List<EpoDocumentId> searchByTitleWithJurisdiction(String titleKeyword, String jurisdiction) {

        if (titleKeyword == null || titleKeyword.isBlank()) {
            return List.of();
        }

        try {
            String keyword = titleKeyword.trim().toLowerCase();

            String titlePart = keyword.contains(" ")
                    ? "ti=\"" + keyword + "\""
                    : "ti=" + keyword;

            String cql;
            if (jurisdiction != null && !jurisdiction.isBlank() && !"ALL".equalsIgnoreCase(jurisdiction)) {
                String jurisdictionCode = jurisdiction.trim().toUpperCase();
                // Use 'pn' (publication number) with country prefix - this is the correct EPO OPS approach
                cql = titlePart + " and pn=" + jurisdictionCode;
                log.info("EPO Search with jurisdiction filter (pn wildcard): {}", cql);
            } else {
                cql = titlePart;
                log.info("EPO Search without jurisdiction filter: {}", cql);
            }

            return executeSearch(cql);

        } catch (Exception e) {
            log.error("EPO title search with jurisdiction failed", e);
            return List.of();
        }
    }

    private List<EpoDocumentId> executeSearch(String cql) throws Exception {
        String encoded = URLEncoder.encode(cql, StandardCharsets.UTF_8);

        String base = properties.baseUrl();
        if (base.endsWith("/rest-services")) {
            base = base.substring(0, base.length() - 14);
        }

        String url = base + "/rest-services/published-data/search?q=" + encoded;
        log.info("EPO Search URL: {}", url);
        log.info("EPO Search CQL: {}", cql);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Authorization", "Bearer " + token())
                .header("Accept", "application/xml")
                .header("X-OPS-Range", "1-25")
                .header("User-Agent", "global-ip/1.0 (academic project)")
                .timeout(Duration.ofSeconds(15))
                .GET()
                .build();

        HttpResponse<String> response =
                httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            log.warn("EPO search failed [{}]: {}",
                    response.statusCode(),
                    response.body() != null ? response.body().substring(0, Math.min(500, response.body().length())) : "null");
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

        List<EpoDocumentId> results = searchResponse.getBiblioSearch()
                .getSearchResult()
                .getPublications()
                .stream()
                .map(EpoPublicationReferenceSearch::getDocumentId)
                .filter(id -> id != null && id.getKind() != null)
                .toList();

        log.info("EPO search returned {} results", results.size());
        return results;
    }

    public List<EpoAbstract> fetchAbstract(EpoDocumentId id) {
        try {
            String url = buildUrl(id, "abstract");
            log.debug("Fetching abstract from: {}", url);

            HttpResponse<String> res = send(url);

            if (res.statusCode() != 200) {
                log.debug("Abstract endpoint returned {}: {}",
                        res.statusCode(), res.body() != null ? res.body().substring(0, Math.min(200, res.body().length())) : "null");
                return List.of();
            }

            if (res.body() == null || res.body().isBlank()) {
                log.debug("Abstract endpoint returned empty body");
                return List.of();
            }

            EpoBiblioResponse response =
                    xmlMapper.readValue(res.body(), EpoBiblioResponse.class);

            if (response == null ||
                    response.getExchangeDocuments() == null ||
                    response.getExchangeDocuments().getDocuments() == null ||
                    response.getExchangeDocuments().getDocuments().isEmpty()) {
                log.debug("No exchange documents in abstract response");
                return List.of();
            }

            EpoExchangeDocument doc =
                    response.getExchangeDocuments().getDocuments().getFirst();

            if (doc.getBibliographicData() == null ||
                    doc.getBibliographicData().getAbstracts() == null) {
                log.debug("No abstracts in exchange document");
                return List.of();
            }

            List<EpoAbstract> abstracts = doc.getBibliographicData().getAbstracts();
            log.debug("Successfully fetched {} abstracts", abstracts.size());

            // Log the full text for debugging
            abstracts.forEach(a -> {
                String fullText = a.getFullText();
                if (fullText != null) {
                    log.debug("Abstract lang={}, length={}", a.getLang(), fullText.length());
                }
            });

            return abstracts;

        } catch (Exception e) {
            log.debug("Abstract fetch failed for {}{}{}",
                    id.getCountry(), id.getDocNumber(), id.getKind(), e);
            return List.of();
        }
    }

    @TrackApiUsage(service = "EPO", action = "BIBLIO_FETCH")
    public List<EpoExchangeDocument> fetchBiblio(EpoDocumentId id) {
        try {
            String url = buildUrl(id, "biblio");
            log.debug("Fetching biblio from: {}", url);

            HttpResponse<String> res = send(url);

            if (res.statusCode() != 200) {
                log.debug("Biblio endpoint returned {}", res.statusCode());
                return List.of();
            }

            if (res.body() == null || res.body().isBlank()) {
                log.debug("Biblio endpoint returned empty body");
                return List.of();
            }

            EpoBiblioResponse response =
                    xmlMapper.readValue(res.body(), EpoBiblioResponse.class);

            if (response == null ||
                    response.getExchangeDocuments() == null ||
                    response.getExchangeDocuments().getDocuments() == null) {
                log.debug("No exchange documents in biblio response");
                return List.of();
            }

            List<EpoExchangeDocument> documents = response.getExchangeDocuments().getDocuments();
            log.debug("Successfully fetched {} biblio documents", documents.size());
            return documents;

        } catch (Exception e) {
            log.warn("Biblio fetch failed for {}{}{}",
                    id.getCountry(), id.getDocNumber(), id.getKind(), e);
            return List.of();
        }
    }

    public String buildCqlQuery(PatentSearchFilter f) {
        List<String> parts = new ArrayList<>();

        // Keyword search
        if (f.getKeyword() != null && !f.getKeyword().isBlank()) {
            String keyword = f.getKeyword().trim().toLowerCase();

            if (keyword.contains(" ")) {
                parts.add("ti=\"" + keyword + "\"");
            } else {
                parts.add("ti=" + keyword + " or ab=" + keyword);
            }
        }

        // Jurisdiction filter using pn (publication number) with wildcard
        if (f.getJurisdiction() != null &&
                !f.getJurisdiction().isBlank() &&
                !"ALL".equalsIgnoreCase(f.getJurisdiction())) {
            String jurisdiction = f.getJurisdiction().trim().toUpperCase();
            // Use pn with wildcard for jurisdiction filtering
            parts.add("pn=" + jurisdiction + "*");
            log.info("Adding jurisdiction filter to CQL: pn={}*", jurisdiction);
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

        // Date range
        if (f.getFilingDateFrom() != null || f.getFilingDateTo() != null) {
            String fromDate = f.getFilingDateFrom() != null
                    ? f.getFilingDateFrom().format(DateTimeFormatter.BASIC_ISO_DATE)
                    : "19000101";

            String toDate = f.getFilingDateTo() != null
                    ? f.getFilingDateTo().format(DateTimeFormatter.BASIC_ISO_DATE)
                    : LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE);

            parts.add("pd within \"" + fromDate + " " + toDate + "\"");
        }

        if (parts.isEmpty()) {
            return "pd>20180101";
        }

        String query = String.join(" and ", parts);
        log.info("Built CQL query: {}", query);
        return query;
    }

    @TrackApiUsage(service = "EPO", action = "ADVANCED_SEARCH")
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

            if (response.statusCode() == 404) {
                log.warn("404 - No results found for query: {}", cql);
                return List.of();
            }

            if (response.statusCode() != 200) {
                log.error("EPO search failed with status {}: {}",
                        response.statusCode(),
                        response.body() != null ? response.body().substring(0, Math.min(500, response.body().length())) : "null");
                return List.of();
            }

            // Parse response
            EpoSearchResponse searchResponse =
                    xmlMapper.readValue(response.body(), EpoSearchResponse.class);

            if (searchResponse == null ||
                    searchResponse.getBiblioSearch() == null ||
                    searchResponse.getBiblioSearch().getSearchResult() == null ||
                    searchResponse.getBiblioSearch().getSearchResult().getPublications() == null) {
                log.warn("No publications in search response");
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
            return List.of();
        }
    }

    @TrackApiUsage(service = "EPO", action = "COMPETITOR_FETCH")
    public List<EpoCompetitorFilingDto> fetchCompetitorFilings(
            List<String> assignees,
            LocalDate fromDate
    ) {
        List<EpoCompetitorFilingDto> results = new ArrayList<>();

        if (assignees == null || assignees.isEmpty()) {
            return results;
        }

        for (String assignee : assignees) {
            try {
                String cql = "pa=\"" + assignee + "\" and pd>=" +
                        fromDate.format(DateTimeFormatter.BASIC_ISO_DATE);

                String encoded = URLEncoder.encode(cql, StandardCharsets.UTF_8);

                String base = properties.baseUrl();
                if (base.endsWith("/rest-services")) {
                    base = base.substring(0, base.length() - 14);
                }

                String url = base + "/rest-services/published-data/search?q=" + encoded;

                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create(url))
                        .header("Authorization", "Bearer " + token())
                        .header("Accept", "application/xml")
                        .header("X-OPS-Range", "1-25")
                        .header("User-Agent", "global-ip/1.0")
                        .timeout(Duration.ofSeconds(30))
                        .GET()
                        .build();

                HttpResponse<String> response =
                        httpClient.send(request, HttpResponse.BodyHandlers.ofString());

                if (response.statusCode() != 200) {
                    log.warn("EPO competitor search failed for {} [{}]",
                            assignee, response.statusCode());
                    continue;
                }

                EpoSearchResponse searchResponse =
                        xmlMapper.readValue(response.body(), EpoSearchResponse.class);

                if (searchResponse == null ||
                        searchResponse.getBiblioSearch() == null ||
                        searchResponse.getBiblioSearch().getSearchResult() == null ||
                        searchResponse.getBiblioSearch().getSearchResult().getPublications() == null) {
                    continue;
                }

                for (EpoPublicationReferenceSearch pub :
                        searchResponse.getBiblioSearch()
                                .getSearchResult()
                                .getPublications()) {

                    EpoDocumentId id = pub.getDocumentId();
                    if (id == null) continue;

                    String publicationNumber =
                            id.getCountry() + id.getDocNumber() + id.getKind();

                    GlobalPatentDetailDto detail =
                            fetchGlobalDetail(publicationNumber);

                    results.add(
                            EpoCompetitorFilingDto.builder()
                                    .publicationNumber(publicationNumber)
                                    .kind(id.getKind())
                                    .applicant(assignee)
                                    .title(detail != null ? detail.getTitle() : null)
                                    .publicationDate(detail != null ? detail.getGrantDate() : null)
                                    .build()
                    );
                }

            } catch (Exception e) {
                log.error("Failed competitor fetch for assignee={}", assignee, e);
            }
        }

        log.info("Fetched {} EPO competitor filings", results.size());
        return results;
    }
}