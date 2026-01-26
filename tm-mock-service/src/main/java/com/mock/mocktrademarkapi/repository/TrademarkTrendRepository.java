package com.mock.mocktrademarkapi.repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class TrademarkTrendRepository {

    @PersistenceContext
    private EntityManager em;

    public List<Object[]> totalByYear() {
        return em.createNativeQuery("""
        SELECT YEAR(filing_date) AS year, COUNT(*) 
        FROM trademark
        WHERE filing_date IS NOT NULL
        GROUP BY YEAR(filing_date)
        ORDER BY year
    """).getResultList();
    }

    public List<Object> statusDistribution() {
        return em.createNativeQuery("""
            SELECT status_code, COUNT(*)
            FROM trademark
            GROUP BY status_code
            ORDER BY COUNT(*) DESC
        """).getResultList();
    }

    public List<Object[]> topClasses() {
        return em.createNativeQuery("""
            SELECT class_code, COUNT(*) AS frequency
            FROM international_class_entity
            GROUP BY class_code
            ORDER BY frequency DESC
            LIMIT 10
        """).getResultList();
    }

    public List<Object[]> topCountries() {
        return em.createNativeQuery("""
            SELECT owner_country, COUNT(DISTINCT t.id)
            FROM trademark t
            JOIN trademark_owner tmo ON t.id = tmo.trademark_id
            JOIN owner_entity o ON tmo.owner_id = o.id
            WHERE owner_country IS NOT NULL
            GROUP BY owner_country
            ORDER BY COUNT(*) DESC
            LIMIT 10
        """).getResultList();
    }
}
