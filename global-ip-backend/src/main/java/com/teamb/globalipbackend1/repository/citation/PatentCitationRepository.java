package com.teamb.globalipbackend1.repository.citation;

import com.teamb.globalipbackend1.model.patents.CitationDirection;
import com.teamb.globalipbackend1.model.patents.PatentCitation;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PatentCitationRepository
        extends JpaRepository<@NonNull PatentCitation,@NonNull Long> {

    boolean existsByCitingPatentNumberAndCitedPatentNumber(
            String citingPatentNumber,
            String citedPatentNumber
    );

    List<PatentCitation> findByCitingPatentNumber(String citingPatentNumber);

    List<PatentCitation> findByCitedPatentNumber(String citedPatentNumber);

    List<PatentCitation> findByCitingPatentNumberAndCitationDirection(
            String citingPatentNumber,
            CitationDirection direction
    );

    List<PatentCitation> findByCitedPatentNumberAndCitationDirection(
            String citedPatentNumber,
            CitationDirection direction
    );
}
