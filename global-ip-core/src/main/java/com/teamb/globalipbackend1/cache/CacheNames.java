package com.teamb.globalipbackend1.cache;

public final class CacheNames {

    public static final String GEO_COUNTRY_DISTRIBUTION ="geo-country-distribution" ;

    private CacheNames() {}

    public static final String PATENT_SEARCH = "patent-searchByKeyword";
    public static final String TRADEMARK_SEARCH = "trademark-searchByKeyword";
    public static final String PATENT_SNAPSHOT = "patent_snapshot";
    public static final String TRADEMARK_SNAPSHOT = "trademark_snapshot";
    public static final String FILING_TRENDS = "filingTrends";
    public static final String GRANT_TRENDS = "grantTrends";
    public static final String TOP_TECHNOLOGIES = "topTechnologies";
    public static final String TOP_ASSIGNEES = "topAssignees";
    public static final String TECHNOLOGY_EVOLUTION = "technologyEvolution";
    public static final String TOP_CITED_PATENTS = "topCitedPatents";
    public static final String TOP_CITING_PATENTS = "topCitingPatents";
    public static final String PATENT_TYPE_DISTRIBUTION = "patentTypeDistribution";
    public static final String CLAIM_COMPLEXITY_TREND = "claimComplexityTrend";
    public static final String TIME_TO_GRANT_TREND = "timeToGrantTrend";

    public static final String UNIFIED_FILING_TREND = "unifiedFilingTrend";
    public static final String UNIFIED_COUNTRY_TREND = "unifiedCountryTrend";


    public static final String EPO_FILING_TREND = "epoFilingTrend";
    public static final String EPO_COUNTRY_TREND = "epoCountryTrend";
    public static final String EPO_TOP_TECHNOLOGIES = "epoTopTechnologies";
    public static final String EPO_TOP_ASSIGNEES = "epoTopAssignees";
    public static final String EPO_FAMILY_TREND = "epoFamilyTrend";
}
