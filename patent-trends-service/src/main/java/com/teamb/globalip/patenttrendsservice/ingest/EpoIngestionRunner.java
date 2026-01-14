package com.teamb.globalip.patenttrendsservice.ingest;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;

import java.nio.file.Path;

@Slf4j
@Component
@Profile("ingest")
@RequiredArgsConstructor
public class EpoIngestionRunner implements CommandLineRunner {

    private final EpoXmlIngestionService ingestionService;
    //private final EpoFamilyAggregator familyAggregator;
    private final IngestProperties ingestProperties;

    @Override
    public void run(String... args) throws Exception {

        String path = ingestProperties.getFilepath();

        log.info("======================================");
        log.info("EPO INGESTION STARTED");
        log.info("Source path: {}", path);
        log.info("======================================");

        long start = System.currentTimeMillis();

        ingestionService.ingestDirectory(Path.of(path));
        //familyAggregator.updateFamilySizes();

        long end = System.currentTimeMillis();

        log.info("======================================");
        log.info("EPO INGESTION COMPLETED");
        log.info("Time taken: {} seconds", (end - start) / 1000);
        log.info("======================================");

        // optional: stop JVM after ingestion
        System.exit(0);
    }
}
