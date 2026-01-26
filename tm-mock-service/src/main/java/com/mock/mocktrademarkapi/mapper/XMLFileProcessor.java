package com.mock.mocktrademarkapi.mapper;



import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.mock.mocktrademarkapi.model.dto.CaseFile;
import com.mock.mocktrademarkapi.model.main.TradeMarkEntity;
import com.mock.mocktrademarkapi.repository.TrademarkRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;


import javax.xml.stream.XMLInputFactory;
import javax.xml.stream.XMLStreamConstants;
import javax.xml.stream.XMLStreamException;
import javax.xml.stream.XMLStreamReader;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;

@Component
@Slf4j
@Profile("ingest")
@RequiredArgsConstructor
public class XMLFileProcessor {

    private final TrademarkMapper trademarkMapper;
    private final XmlMapper xmlMapper=new XmlMapper();
    private final TrademarkRepository trademarkRepository;
    private final IngestPropertiesConfig ingestPropertiesConfig;



    public void xmlFileRead(){
        XMLInputFactory factory = XMLInputFactory.newInstance();

        log.info("Reading is initialising...");

        try (InputStream is = Files.newInputStream(
                Paths.get(ingestPropertiesConfig.getFilePath()))) {

            XMLStreamReader reader =
                    factory.createXMLStreamReader(is);
            log.info("Reading starts");

            int processed = 0;
            while (reader.hasNext()) {
                int event = reader.next();
                if (event == XMLStreamConstants.START_ELEMENT &&
                        "case-file".equals(reader.getLocalName())) {

                    try {
                        CaseFile caseFile =
                                xmlMapper.readValue(reader, CaseFile.class);

                        processCaseFile(caseFile);
                        processed++;
                        if (processed % 100 == 0) {
                            log.info("Persisted {} trademarks", processed);
                        }

                        log.info("Processed {} document", processed);

                    } catch (Exception e) {
                        log.error("Failed to parse case-file", e);
                    }
                }

            }
        } catch (IOException | XMLStreamException e) {
                log.error("Failed to parse the xml file",e);
        }

    }

    public void processCaseFile(CaseFile caseFile){
        TradeMarkEntity doc = trademarkMapper.map(caseFile);
        trademarkRepository.save(doc);
        log.info("Processed Doc {}",doc);
    }
}
