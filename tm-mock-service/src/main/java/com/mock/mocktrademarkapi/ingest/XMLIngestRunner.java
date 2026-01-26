package com.mock.mocktrademarkapi.ingest;



import com.mock.mocktrademarkapi.mapper.XMLFileProcessor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("ingest")
@RequiredArgsConstructor
@Slf4j
public class XMLIngestRunner implements ApplicationRunner {

    private final XMLFileProcessor xmlFileProcessor;

    @Override
    public void run(ApplicationArguments args) {
        log.info("XML ingestion runner started");
        xmlFileProcessor.xmlFileRead();
        log.info("XML ingestion runner finished");
    }
}
