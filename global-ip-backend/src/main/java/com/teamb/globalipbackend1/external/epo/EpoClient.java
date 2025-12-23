package com.teamb.globalipbackend1.external.epo;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.teamb.globalipbackend1.external.epo.config.EpoProperties;
import com.teamb.globalipbackend1.external.epo.dto.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import com.fasterxml.jackson.databind.DeserializationFeature;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.List;

@Slf4j
@Component
public class EpoClient {

    private final EpoProperties properties;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    private final XmlMapper xmlMapper;

    public EpoClient(EpoProperties properties) {
        this.properties = properties;
        this.xmlMapper = new XmlMapper();
        this.xmlMapper.configure(
                DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES,
                false
        );

    }



    private final ObjectMapper jsonMapper = new ObjectMapper();

    private String accessToken;
    private Instant tokenExpiry = Instant.EPOCH;

    /* ---------------- PUBLIC API ---------------- */

    public List<EpoDocumentId> searchByTitle(String titleKeyword) throws IOException, InterruptedException {

        try {

            String query = "ti=" + URLEncoder.encode(titleKeyword, StandardCharsets.UTF_8);


            String baseUrl = properties.getBaseUrl();

            // Remove /rest-services if it's in the base URL
            if (baseUrl.endsWith("/rest-services")) {
                baseUrl = baseUrl.substring(0, baseUrl.length() - 14);
                log.warn("Base URL contained /rest-services, removed it. New base: {}", baseUrl);
            }

            // Build the complete URL
            String fullUrl = baseUrl + "/rest-services/published-data/search?q=" + query;




            URI uri = URI.create(fullUrl);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(uri)
                    .GET()
                    .timeout(Duration.ofSeconds(30))
                    .header("Authorization", "Bearer " + getAccessToken())
                    .header("Accept", "application/xml")
                    .header("X-OPS-Range", "1-10")  // FIXED: Use X-OPS-Range
                    .header(
                            "User-Agent",
                            "global-ip/1.0 (academic project; contact: chinna@example.com)"
                    )
                    .build();

            log.debug("Sending request to EPO...");
            HttpResponse<String> response =
                    httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            log.info("EPO response status: {}", response.statusCode());
            log.debug("OPS RAW RESPONSE:\n{}", response.body());


            if (response.statusCode() != 200) {
                log.error("EPO OPS search failed. Status: {}, Body: {}",
                        response.statusCode(), response.body());
                throw new RuntimeException(
                        "OPS search failed. HTTP "
                                + response.statusCode()
                                + "\n"
                                + response.body()
                );
            }

            log.debug("Parsing XML response...");
            log.info("OPS STATUS: {}", response.statusCode());
            log.info("OPS HEADERS: {}", response.headers().map());
            log.info("OPS BODY:\n{}", response.body());
            EpoSearchResponse searchResponse =
                    xmlMapper.readValue(response.body(), EpoSearchResponse.class);

            if (searchResponse.getBiblioSearch() == null ||
                    searchResponse.getBiblioSearch().getSearchResult() == null) {

                return List.of(); // empty but valid
            }
            log.info("Parsed publications count: {}",
                    searchResponse.getBiblioSearch()
                            .getSearchResult()
                            .getPublications()
                            .size()
            );


            searchResponse.getBiblioSearch()
                    .getSearchResult()
                    .getPublications()
                    .forEach(p -> log.info(
                            "ID: {}{}{}",
                            p.getDocumentId().getCountry(),
                            p.getDocumentId().getDocNumber(),
                            p.getDocumentId().getKind()
                    ));



            return searchResponse.getBiblioSearch()
                    .getSearchResult()
                    .getPublications()
                    .stream()
                    .map(EpoPublicationReferenceSearch::getDocumentId)
                    .filter(id -> id.getKind() != null && id.getKind().startsWith("B"))
                    .toList();




        } catch (Exception e) {
            log.error("OPS FAILURE for title [{}]", titleKeyword);
            throw e;
        }

    }


    public List<EpoExchangeDocument> fetchBiblio(EpoDocumentId docId) {

        String publicationId =
                docId.getCountry()
                        + docId.getDocNumber()
                        + docId.getKind();
        if (docId.getKind() == null || docId.getKind().startsWith("A")) {
            log.info("Skipping application publication {}",
                    docId.getCountry() + docId.getDocNumber() + docId.getKind());
            return List.of();
        }


        log.info("Fetching biblio (EPODOC) for {}", publicationId);


        try {
            String url = buildBiblioUrl(docId);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .GET()
                    .header("Authorization", "Bearer " + getAccessToken())
                    .header("Accept", "application/xml")
                    .header("User-Agent",
                            "global-ip/1.0 (academic project; contact: chinna@example.com)")
                    .timeout(Duration.ofSeconds(30))
                    .build();

            HttpResponse<String> response =
                    httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            log.info("OPS RESPONSE,{}",response.body());


            if (response.statusCode() != 200) {
                log.warn("OPS biblio not available for {}", publicationId);
                return List.of();
            }

            EpoBiblioResponse biblioResponse =
                    xmlMapper.readValue(response.body(), EpoBiblioResponse.class);

            if (biblioResponse == null ||
                    biblioResponse.getExchangeDocuments() == null ||
                    biblioResponse.getExchangeDocuments().getDocuments() == null ||
                    biblioResponse.getExchangeDocuments().getDocuments().isEmpty()) {

                log.warn("OPS returned empty biblio for {}", publicationId);
                return List.of();
            }

            log.info("Biblio docs returned: {}",
                    biblioResponse.getExchangeDocuments().getDocuments().size()
            );


            List<EpoExchangeDocument> docs =
                    biblioResponse.getExchangeDocuments().getDocuments();




            if (docs == null || docs.isEmpty()) {
                return List.of();
            }


            return docs.stream()
                    .sorted((a, b) -> {
                        if ("B1".equals(a.getKind())) return -1;
                        if ("B1".equals(b.getKind())) return 1;
                        return 0;
                    })
                    .toList();




        } catch (Exception e) {
            log.warn("OPS biblio fetch failed for {}", publicationId, e);
            return List.of();
        }
    }






    private synchronized String getAccessToken() {

        if (accessToken != null && Instant.now().isBefore(tokenExpiry)) {
            log.debug("Using cached access token");
            return accessToken;
        }

        log.info("Obtaining new EPO access token...");

        try {
            String auth =
                    properties.getConsumerKey() + ":" + properties.getConsumerSecret();

            String encodedAuth = Base64.getEncoder()
                    .encodeToString(auth.getBytes(StandardCharsets.UTF_8));

            HttpRequest tokenRequest = HttpRequest.newBuilder()
                    .uri(URI.create("https://ops.epo.org/3.2/auth/accesstoken"))
                    .POST(HttpRequest.BodyPublishers.ofString("grant_type=client_credentials"))
                    .header("Authorization", "Basic " + encodedAuth)
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .header(
                            "User-Agent",
                            "global-ip/1.0 (academic project; contact: chinna@example.com)"
                    )
                    .timeout(Duration.ofSeconds(20))
                    .build();

            log.debug("Requesting access token from EPO...");
            HttpResponse<String> tokenResponse =
                    httpClient.send(tokenRequest, HttpResponse.BodyHandlers.ofString());

            log.debug("Token response status: {}", tokenResponse.statusCode());

            if (tokenResponse.statusCode() != 200) {
                log.error("OPS token request failed. Status: {}, Body: {}",
                        tokenResponse.statusCode(), tokenResponse.body());
                throw new RuntimeException(
                        "OPS token request failed. HTTP "
                                + tokenResponse.statusCode()
                                + "\n"
                                + tokenResponse.body()
                );
            }

            JsonNode json = jsonMapper.readTree(tokenResponse.body());

            accessToken = json.get("access_token").asText();
            long expiresIn = json.get("expires_in").asLong();


            tokenExpiry = Instant.now().plusSeconds(expiresIn - 60);

            log.info("Successfully obtained EPO access token, expires in {} seconds", expiresIn);

            return accessToken;

        } catch (Exception e) {
            log.error("Failed to obtain OPS access token", e);
            throw new RuntimeException("Failed to obtain OPS access token", e);
        }
    }

    private String buildBiblioUrl(EpoDocumentId docId) {

        String format;
        String identifier;

        if ("EP".equalsIgnoreCase(docId.getCountry())) {
            // EP → epodoc
            format = "epodoc";
            identifier =
                    docId.getCountry()
                            + docId.getDocNumber()
                            + docId.getKind();
        } else {
            // Non-EP → docdb
            format = "docdb";
            identifier =
                    docId.getCountry() + "."
                            + docId.getDocNumber() + "."
                            + docId.getKind();
        }

        return properties.getBaseUrl()
                + "/rest-services/published-data/publication/"
                + format + "/"
                + identifier
                + "/biblio";
    }



}