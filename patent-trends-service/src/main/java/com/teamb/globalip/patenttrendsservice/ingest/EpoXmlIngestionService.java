package com.teamb.globalip.patenttrendsservice.ingest;

import com.teamb.globalip.patenttrendsservice.domain.epo.EpoPatentAssigneeEntity;
import com.teamb.globalip.patenttrendsservice.domain.epo.EpoPatentCpcEntity;
import com.teamb.globalip.patenttrendsservice.domain.epo.EpoPatentEntity;
import com.teamb.globalip.patenttrendsservice.domain.epo.EpoPatentFamilyEntity;
import com.teamb.globalip.patenttrendsservice.repository.epo.EpoPatentAssigneeRepository;
import com.teamb.globalip.patenttrendsservice.repository.epo.EpoPatentCpcRepository;
import com.teamb.globalip.patenttrendsservice.repository.epo.EpoPatentFamilyRepository;
import com.teamb.globalip.patenttrendsservice.repository.epo.EpoPatentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import javax.xml.stream.XMLInputFactory;
import javax.xml.stream.XMLStreamConstants;
import javax.xml.stream.XMLStreamReader;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
@Profile("ingest")
public class EpoXmlIngestionService {

    private final EpoPatentRepository patentRepo;
    private final EpoPatentCpcRepository cpcRepo;
    private final EpoPatentAssigneeRepository assigneeRepo;

    private final XMLInputFactory factory = XMLInputFactory.newFactory();

    public void ingestDirectory(Path root) throws Exception {
        Files.walk(root)
                .filter(p -> p.toString().endsWith(".xml"))
                .forEach(p -> {
                    try {
                        ingestFile(p);
                    } catch (Exception e) {
                        throw new RuntimeException("Failed at file: " + p, e);
                    }
                });
    }

    public void ingestFile(Path file) throws Exception {
        try (InputStream is = Files.newInputStream(file)) {
            XMLStreamReader r = factory.createXMLStreamReader(is);

            while (r.hasNext()) {
                if (r.next() == XMLStreamConstants.START_ELEMENT &&
                        "exchange-document".equals(r.getLocalName())) {
                    parseExchangeDocument(r);
                }
            }
        }
    }

    private void parseExchangeDocument(XMLStreamReader r) throws Exception {

        String country = r.getAttributeValue(null, "country");
        String docNumber = r.getAttributeValue(null, "doc-number");
        String kind = r.getAttributeValue(null, "kind");
        String familyIdStr = r.getAttributeValue(null, "family-id");
        String datePublStr = r.getAttributeValue(null, "date-publ");

        String epoPatentId = country + docNumber + kind;

        if (patentRepo.existsById(epoPatentId)) {
            skipCurrentElement(r);
            return;
        }

        EpoPatentEntity patent = new EpoPatentEntity(
                epoPatentId,
                country,
                kind,
                parseDate(datePublStr),
                null,
                familyIdStr == null ? null : Long.parseLong(familyIdStr)
        );

        patentRepo.save(patent);

        Set<String> cpcSeen = new HashSet<>();
        Set<String> assigneeSeen = new HashSet<>();

        while (r.hasNext()) {
            int e = r.next();

            if (e == XMLStreamConstants.START_ELEMENT) {

                switch (r.getLocalName()) {

                    case "patent-classification" ->
                            parseCpc(r, epoPatentId, cpcSeen);

                    case "applicant" ->
                            parseApplicant(r, epoPatentId, assigneeSeen);
                }
            }

            if (e == XMLStreamConstants.END_ELEMENT &&
                    "exchange-document".equals(r.getLocalName())) {
                break;
            }
        }
    }
    private void parseCpc(XMLStreamReader r,
                          String epoPatentId,
                          Set<String> seen) throws Exception {

        String symbol = null;

        while (r.hasNext()) {
            int e = r.next();

            if (e == XMLStreamConstants.START_ELEMENT &&
                    "classification-symbol".equals(r.getLocalName())) {

                symbol = readTextSafely(r);
            }

            if (e == XMLStreamConstants.END_ELEMENT &&
                    "patent-classification".equals(r.getLocalName())) {
                break;
            }
        }

        if (symbol == null || symbol.length() < 1) return;

        symbol = symbol.trim().replaceAll("\\s+", " ");

        String section = symbol.substring(0, 1);
        String cpcClass = symbol.substring(1).trim();

        String key = epoPatentId + "|" + section + "|" + cpcClass;

        if (seen.add(key)) {
            cpcRepo.save(new EpoPatentCpcEntity(
                    null,
                    epoPatentId,
                    section,
                    cpcClass
            ));
        }
    }
    private void parseApplicant(XMLStreamReader r,
                                String epoPatentId,
                                Set<String> seen) throws Exception {

        String name = null;

        while (r.hasNext()) {
            int e = r.next();

            if (e == XMLStreamConstants.START_ELEMENT &&
                    "name".equals(r.getLocalName())) {

                name = readTextSafely(r);
            }

            if (e == XMLStreamConstants.END_ELEMENT &&
                    "applicant".equals(r.getLocalName())) {
                break;
            }
        }

        if (name == null) return;

        name = normalize(name);

        if (seen.add(name)) {
            assigneeRepo.save(new EpoPatentAssigneeEntity(
                    null,
                    epoPatentId,
                    name
            ));
        }
    }
    private String readTextSafely(XMLStreamReader r) throws Exception {
        StringBuilder sb = new StringBuilder();

        while (r.hasNext()) {
            int e = r.next();

            if (e == XMLStreamConstants.CHARACTERS) {
                sb.append(r.getText());
            }

            if (e == XMLStreamConstants.END_ELEMENT) {
                break;
            }
        }
        return sb.toString().trim();
    }
    private void skipCurrentElement(XMLStreamReader r) throws Exception {
        int depth = 1;
        while (depth > 0 && r.hasNext()) {
            int e = r.next();
            if (e == XMLStreamConstants.START_ELEMENT) depth++;
            if (e == XMLStreamConstants.END_ELEMENT) depth--;
        }
    }

    private LocalDate parseDate(String s) {
        if (s == null || s.length() != 8) return null;
        return LocalDate.of(
                Integer.parseInt(s.substring(0, 4)),
                Integer.parseInt(s.substring(4, 6)),
                Integer.parseInt(s.substring(6, 8))
        );
    }

    private String normalize(String s) {
        return s.trim().replaceAll("\\s+", " ");
    }
}
