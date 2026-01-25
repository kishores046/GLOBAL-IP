package com.teamb.globalipbackend1.search;

import com.teamb.globalipbackend1.external.epo.EpoClient;
import com.teamb.globalipbackend1.external.epo.dto.EpoDocumentId;
import com.teamb.globalipbackend1.service.patent.search.provider.EpoPatentSearchProvider;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.*;
import java.util.concurrent.*;

@SpringBootTest
@Slf4j
public class EpoJurisdictionSupportTest {

    @Autowired
    private EpoClient epoClient;

    @Autowired
    private EpoPatentSearchProvider epoProvider;

    /**
     * All jurisdictions claimed to be supported by EpoPatentSearchProvider
     */
    private static final List<String> ALL_CLAIMED_JURISDICTIONS = List.of(
            // Primary & Regional
            "EP", "WO", "EA", "AP", "OA", "GC",
            // Major Global Offices
            "CN", "JP", "KR", "CA", "AU", "BR", "RU",
            // EPO Member States (39)
            "AL", "AT", "BE", "BG", "CH", "CY", "CZ", "DE", "DK", "EE", "ES", "FI", "FR",
            "GB", "GR", "HR", "HU", "IE", "IS", "IT", "LI", "LT", "LU", "LV", "MC", "ME",
            "MK", "MT", "NL", "NO", "PL", "PT", "RO", "RS", "SE", "SI", "SK", "SM", "TR",
            // Extension & Validation States
            "BA", "MA", "MD", "TN", "KH", "GE", "LA"
    );

    @Test
    public void testAllJurisdictionsSingleThreaded() {
        log.info("=== TESTING ALL {} JURISDICTIONS (Single-threaded) ===", ALL_CLAIMED_JURISDICTIONS.size());

        Map<String, TestResult> results = new LinkedHashMap<>();

        for (String jurisdiction : ALL_CLAIMED_JURISDICTIONS) {
            TestResult result = testJurisdiction(jurisdiction);
            results.put(jurisdiction, result);

            // Sleep to avoid rate limiting
            try {
                Thread.sleep(500);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }

        printResults(results);
    }

    @Test
    public void testAllJurisdictionsParallel() {
        log.info("=== TESTING ALL {} JURISDICTIONS (Parallel with rate limiting) ===",
                ALL_CLAIMED_JURISDICTIONS.size());

        Map<String, TestResult> results = new ConcurrentHashMap<>();
        ExecutorService executor = Executors.newFixedThreadPool(3); // Limit concurrent requests
        List<Future<?>> futures = new ArrayList<>();

        for (String jurisdiction : ALL_CLAIMED_JURISDICTIONS) {
            Future<?> future = executor.submit(() -> {
                TestResult result = testJurisdiction(jurisdiction);
                results.put(jurisdiction, result);

                // Rate limiting
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            });
            futures.add(future);
        }

        // Wait for all to complete
        for (Future<?> future : futures) {
            try {
                future.get(60, TimeUnit.SECONDS);
            } catch (Exception e) {
                log.error("Task failed", e);
            }
        }

        executor.shutdown();
        printResults(results);
    }

    @Test
    public void testSampleJurisdictions() {
        log.info("=== TESTING SAMPLE JURISDICTIONS ===");

        List<String> samples = List.of(
                "EP", "FR", "DE", "GB", "US", "CN", "JP",
                "WO", "AL", "BA", "MA", "KH", "XX"  // Include invalid one
        );

        Map<String, TestResult> results = new LinkedHashMap<>();

        for (String jurisdiction : samples) {
            TestResult result = testJurisdiction(jurisdiction);
            results.put(jurisdiction, result);

            try {
                Thread.sleep(500);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }

        printResults(results);
    }

    @Test
    public void testProviderSupportsMethod() {
        log.info("=== TESTING PROVIDER supportsJurisdiction() METHOD ===");

        Map<String, Boolean> results = new LinkedHashMap<>();

        for (String jurisdiction : ALL_CLAIMED_JURISDICTIONS) {
            boolean supports = epoProvider.supportsJurisdiction(jurisdiction);
            results.put(jurisdiction, supports);
        }

        // Also test some that should NOT be supported
        results.put("US", epoProvider.supportsJurisdiction("US"));
        results.put("XX", epoProvider.supportsJurisdiction("XX"));
        results.put("ZZ", epoProvider.supportsJurisdiction("ZZ"));

        log.info("\n=== PROVIDER SUPPORT RESULTS ===");
        results.forEach((jurisdiction, supported) -> {
            log.info("{}: {}", jurisdiction, supported ? "✓ SUPPORTED" : "✗ NOT SUPPORTED");
        });

        long supportedCount = results.values().stream().filter(b -> b).count();
        log.info("\nTotal supported: {}/{}", supportedCount, results.size());
    }

    /**
     * Test if a jurisdiction returns results from EPO
     */
    private TestResult testJurisdiction(String jurisdiction) {
        log.info("Testing jurisdiction: {}", jurisdiction);

        TestResult result = new TestResult();
        result.jurisdiction = jurisdiction;
        result.startTime = System.currentTimeMillis();

        try {
            // Test with a common keyword that should exist in most jurisdictions
            List<EpoDocumentId> documents = epoClient.searchByTitleWithJurisdiction(
                    "battery",
                    jurisdiction
            );

            result.success = true;
            result.resultCount = documents.size();
            result.hasResults = documents.size() > 0;

            if (documents.size() > 0) {
                result.sampleDocumentId = documents.get(0).getCountry() +
                        documents.get(0).getDocNumber() +
                        documents.get(0).getKind();
            }

        } catch (Exception e) {
            result.success = false;
            result.errorMessage = e.getMessage();
            log.error("Failed to test jurisdiction {}", jurisdiction, e);
        } finally {
            result.duration = System.currentTimeMillis() - result.startTime;
        }

        return result;
    }

    /**
     * Print comprehensive results
     */
    private void printResults(Map<String, TestResult> results) {
        log.info("\n\n=== JURISDICTION TEST RESULTS ===");
        log.info("Total tested: {}", results.size());

        // Group results
        List<TestResult> successful = new ArrayList<>();
        List<TestResult> withResults = new ArrayList<>();
        List<TestResult> noResults = new ArrayList<>();
        List<TestResult> failed = new ArrayList<>();

        results.values().forEach(r -> {
            if (r.success) {
                successful.add(r);
                if (r.hasResults) {
                    withResults.add(r);
                } else {
                    noResults.add(r);
                }
            } else {
                failed.add(r);
            }
        });

        log.info("\n--- WORKING JURISDICTIONS (with results) ---");
        withResults.forEach(r -> {
            log.info("✓ {} - {} results - Sample: {} ({}ms)",
                    r.jurisdiction, r.resultCount, r.sampleDocumentId, r.duration);
        });

        log.info("\n--- WORKING BUT NO RESULTS (valid but empty) ---");
        noResults.forEach(r -> {
            log.info("○ {} - 0 results ({}ms)", r.jurisdiction, r.duration);
        });

        log.info("\n--- FAILED JURISDICTIONS ---");
        failed.forEach(r -> {
            log.info("✗ {} - ERROR: {} ({}ms)",
                    r.jurisdiction,
                    r.errorMessage != null ? r.errorMessage.substring(0, Math.min(100, r.errorMessage.length())) : "Unknown",
                    r.duration);
        });

        log.info("\n=== SUMMARY ===");
        log.info("Total Successful: {} / {}", successful.size(), results.size());
        log.info("  - With Results: {}", withResults.size());
        log.info("  - No Results: {}", noResults.size());
        log.info("Failed: {}", failed.size());

        double successRate = (successful.size() * 100.0) / results.size();
        log.info("Success Rate: {:.1f}%", successRate);

        if (withResults.size() > 0) {
            double avgDuration = withResults.stream()
                    .mapToLong(r -> r.duration)
                    .average()
                    .orElse(0);
            log.info("Average Response Time (successful): {:.0f}ms", avgDuration);
        }

        // Print actual supported list
        log.info("\n=== ACTUALLY SUPPORTED JURISDICTIONS ===");
        List<String> actuallySupported = withResults.stream()
                .map(r -> r.jurisdiction)
                .sorted()
                .toList();
        log.info("Count: {}", actuallySupported.size());
        log.info("List: {}", String.join(", ", actuallySupported));
    }

    /**
     * Test result data class
     */
    private static class TestResult {
        String jurisdiction;
        boolean success;
        boolean hasResults;
        int resultCount;
        String sampleDocumentId;
        String errorMessage;
        long startTime;
        long duration;
    }

    @Test
    public void generateUpdatedProviderCode() {
        log.info("=== GENERATING UPDATED PROVIDER CODE ===");
        log.info("Run testAllJurisdictionsSingleThreaded() first to get actual supported list");
        log.info("Then update EPO_JURISDICTIONS in EpoPatentSearchProvider with only verified jurisdictions");

        log.info("\nExpected to work based on EPO OPS documentation:");
        log.info("- EP (European Patent Office)");
        log.info("- WO (WIPO/PCT)");
        log.info("- All EPO member states (39 countries)");
        log.info("- Major patent offices with DOCDB coverage");

        log.info("\nLikely to fail:");
        log.info("- Extension/validation states (BA, MA, MD, TN, KH, GE, LA)");
        log.info("- Some regional offices (EA, AP, OA, GC)");
    }
}