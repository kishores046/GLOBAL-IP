/**
 * Jurisdiction Codes and Labels
 * Supported by EPO Open Patent Services API
 */

export const jurisdictionCodes = [
  "AP", "AT", "AU", "BE", "BG", "CA", "CH", "CN", "CY", "CZ",
  "DE", "DK", "EA", "EE", "EP", "ES", "FI", "FR", "GB", "GC",
  "GE", "GR", "HR", "HU", "IE", "IT", "JP", "KR", "LT", "LU",
  "LV", "MA", "MD", "ME", "NL", "NO", "OA", "PL", "PT", "RO",
  "RS", "RU", "SE", "SI", "SK", "SM", "TN", "TR", "US", "WO"
];

export const jurisdictionLabels: Record<string, string> = {
  "AP": "ARIPO (African Regional)",
  "AT": "Austria",
  "AU": "Australia",
  "BE": "Belgium",
  "BG": "Bulgaria",
  "CA": "Canada",
  "CH": "Switzerland",
  "CN": "China",
  "CY": "Cyprus",
  "CZ": "Czech Republic",
  "DE": "Germany",
  "DK": "Denmark",
  "EA": "EAPO (Eurasian)",
  "EE": "Estonia",
  "EP": "EPO (European Patent Office)",
  "ES": "Spain",
  "FI": "Finland",
  "FR": "France",
  "GB": "United Kingdom",
  "GC": "GCC (Gulf Cooperation Council)",
  "GE": "Georgia",
  "GR": "Greece",
  "HR": "Croatia",
  "HU": "Hungary",
  "IE": "Ireland",
  "IT": "Italy",
  "JP": "Japan",
  "KR": "South Korea",
  "LT": "Lithuania",
  "LU": "Luxembourg",
  "LV": "Latvia",
  "MA": "Morocco",
  "MD": "Moldova",
  "ME": "Montenegro",
  "NL": "Netherlands",
  "NO": "Norway",
  "OA": "OAPI (African Intellectual Property)",
  "PL": "Poland",
  "PT": "Portugal",
  "RO": "Romania",
  "RS": "Serbia",
  "RU": "Russia",
  "SE": "Sweden",
  "SI": "Slovenia",
  "SK": "Slovakia",
  "SM": "San Marino",
  "TN": "Tunisia",
  "TR": "Turkey",
  "US": "United States",
  "WO": "WIPO (World Intellectual Property)"
};

/**
 * Get sorted jurisdictions for display
 * Regional offices are grouped, then countries are sorted alphabetically
 */
export const getSortedJurisdictions = () => {
  const regionalOffices = ["AP", "EA", "EP", "GC", "OA", "WO"];
  const individualCountries = jurisdictionCodes.filter(code => !regionalOffices.includes(code));

  // Sort individual countries by their label
  const sortedCountries = individualCountries.sort((a, b) => 
    jurisdictionLabels[a].localeCompare(jurisdictionLabels[b])
  );

  return {
    regionalOffices,
    individualCountries: sortedCountries
  };
};

/**
 * Get jurisdiction label with code
 */
export const getJurisdictionLabel = (code: string): string => {
  return `${code} - ${jurisdictionLabels[code] || code}`;
};
