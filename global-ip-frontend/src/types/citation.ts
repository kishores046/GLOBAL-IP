// Citation Network API Types
export interface PatentNode {
  patentId: string;
  title: string;
  abstractText?: string;
  assignee?: string;
  filingDate?: string;
  grantDate?: string;
  ipcClasses: string[];
  cpcClasses: string[];
  backwardCitationCount: number;
  forwardCitationCount: number;
  patentType?: string;
  inventors: string[];
  
  // Visualization properties
  nodeSize: number;        // 15-40 (based on citation importance)
  nodeColor: string;       // Hex color
  depth: number;           // 0 = root, 1 = direct citations
}

export interface CitationEdge {
  source: string;          // citing patent ID
  target: string;          // cited patent ID
  citationType: string;    // "cited by examiner" or "cited by applicant"
  citationDate?: string;
  weight: number;          // Always 1 for now
}

export interface NetworkMetrics {
  totalNodes: number;
  totalEdges: number;
  citationDensity: number;
  averageCitationsPerPatent: number;
  mostCitedPatent?: string;
  mostCitedCount?: number;
  numberOfClusters?: number;
  assigneeDistribution: Record<string, number>;
  technologyDistribution: Record<string, number>;
  citationsByYear: Record<number, number>;
}

export interface TechnologyCluster {
  clusterId: string;
  clusterName: string;
  patentIds: string[];
  size: number;
  color: string;
}

export interface CitationNetworkResponse {
  nodes: PatentNode[];
  edges: CitationEdge[];
  metrics: NetworkMetrics;
  clusters: Record<string, TechnologyCluster>;
}

// Legacy types for backward compatibility
export interface CitationNetwork {
  backwardCitations?: Array<{
    citedPatent: string;
    title?: string;
  }>;
  forwardCitations?: Array<{
    citingPatent: string;
    title?: string;
  }>;
  backwardTotal?: number;
  forwardTotal?: number;
  backwardCount?: number;
  forwardCount?: number;
}
