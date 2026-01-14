/**
 * Transform API responses to chart-compatible formats
 */

export const transformFilingTrends = (data: any): any[] => {
  if (Array.isArray(data)) return data;
  if (data?.data && Array.isArray(data.data)) return data.data;
  return [];
};

export const transformTechnologyTrends = (data: any): any[] => {
  if (Array.isArray(data)) return data;
  // If it's the response object with evolutionData
  if (data?.evolutionData && Array.isArray(data.evolutionData)) {
    return data.evolutionData;
  }
  // If it has topTechnologies array, use it
  if (data?.topTechnologies && Array.isArray(data.topTechnologies)) {
    return data.topTechnologies;
  }
  return [];
};

export const transformAssigneeTrends = (data: any): any[] => {
  if (Array.isArray(data)) return data;
  if (data?.topAssignees && Array.isArray(data.topAssignees)) return data.topAssignees;
  return [];
};

export const transformCountryTrends = (data: any): any[] => {
  if (Array.isArray(data)) return data;
  if (data?.countries && Array.isArray(data.countries)) return data.countries;
  return [];
};

export const transformCitationTrends = (data: any): any => {
  if (!data) return { topCited: [], topCiting: [] };
  
  console.log('[transformCitationTrends] Input data:', data);
  
  // If it's already the transformed format
  if (data.topCited !== undefined && data.topCiting !== undefined) {
    const result = {
      topCited: Array.isArray(data.topCited) ? data.topCited : [],
      topCiting: Array.isArray(data.topCiting) ? data.topCiting : [],
    };
    console.log('[transformCitationTrends] Output:', result);
    return result;
  }
  
  console.log('[transformCitationTrends] Returning empty');
  return { topCited: [], topCiting: [] };
};

export const transformPatentQuality = (data: any): any => {
  if (!data) return { typeDistribution: [], claimComplexity: [], timeToGrant: [] };
  
  // If it's already the transformed format
  if (
    data.typeDistribution !== undefined &&
    data.claimComplexity !== undefined &&
    data.timeToGrant !== undefined
  ) {
    return {
      typeDistribution: Array.isArray(data.typeDistribution) ? data.typeDistribution : [],
      claimComplexity: Array.isArray(data.claimComplexity) ? data.claimComplexity : [],
      timeToGrant: Array.isArray(data.timeToGrant) ? data.timeToGrant : [],
    };
  }
  
  return { typeDistribution: [], claimComplexity: [], timeToGrant: [] };
};

export const transformPatentTypes = (data: any): any[] => {
  if (Array.isArray(data)) return data;
  if (data?.typeDistribution && Array.isArray(data.typeDistribution)) {
    return data.typeDistribution;
  }
  // If it's already just the type distribution array
  return Array.isArray(data) ? data : [];
};

export const transformClaimComplexity = (data: any): any[] => {
  if (Array.isArray(data)) return data;
  if (data?.claimComplexity && Array.isArray(data.claimComplexity)) {
    return data.claimComplexity;
  }
  return [];
};

export const transformTimeToGrant = (data: any): any[] => {
  if (Array.isArray(data)) return data;
  if (data?.timeToGrant && Array.isArray(data.timeToGrant)) {
    return data.timeToGrant;
  }
  return [];
};

// Map trend IDs to their transformer functions
export const trendTransformers: Record<string, (data: any) => any> = {
  'filing-trends': transformFilingTrends,
  'grant-trends': transformFilingTrends,
  'top-technologies': transformTechnologyTrends,
  'top-assignees': transformAssigneeTrends,
  'country-distribution': transformCountryTrends,
  'top-cited-patents': transformCitationTrends,
  'top-citing-patents': transformCitationTrends,
  'patent-types': transformPatentTypes,
  'claim-complexity': transformClaimComplexity,
  'time-to-grant': transformTimeToGrant,
  'technology-evolution': transformTechnologyTrends,
};

export const getTransformedData = (trendId: string, data: any): any => {
  const transformer = trendTransformers[trendId];
  if (!transformer) {
    console.warn(`No transformer found for trend ${trendId}`);
    return data;
  }
  const transformed = transformer(data);
  console.debug(`Transformed data for ${trendId}:`, transformed);
  return transformed;
};
