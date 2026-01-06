/**
 * Enhanced Citation Network Visualization Component
 * Fixed: Wrapped with ReactFlowProvider to resolve zustand error
 */
import { useMemo, useState, useCallback } from 'react';
import ReactFlow, {
  Edge,
  Controls,
  Background,
  BackgroundVariant,
  MiniMap,
  ConnectionLineType,
  MarkerType,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { 
  AlertCircle, 
  Network, 
  Loader2, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  RotateCcw,
  Download,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useCitationNetwork } from '../../hooks/useCitationNetwork';
import { CustomPatentNode } from './CustomPatentNode';
import { CitationMetricsPanel } from './CitationMetricsPanel';
import { CitationEdge } from '../../types/citation';
import { applyHierarchicalLayout } from '../../utils/citationLayout';

interface EnhancedCitationGraphProps {
  readonly patentId: string;
  readonly source?: string;
  readonly currentPatentTitle?: string;
}

interface PatentNode {
  id: string;
  title: string;
  isRoot: boolean;
  depth?: number;
}

interface FlowEdgeStyle {
  stroke: string;
  strokeWidth: number;
  opacity: number;
}

interface FlowEdgeLabelStyle {
  fontSize: number;
  fill: string;
  fontWeight: number;
}

interface FlowEdgeLabelBgStyle {
  fill: string;
  fillOpacity: number;
  rx: number;
  ry: number;
}

type TransformedFlowEdge = Edge & {
  style?: FlowEdgeStyle;
  labelStyle?: FlowEdgeLabelStyle;
  labelBgStyle?: FlowEdgeLabelBgStyle;
};

interface CitationNetworkData {
  nodes: PatentNode[];
  edges: CitationEdge[];
  metrics: Record<string, unknown>;
}

interface CitationGraphInnerProps extends EnhancedCitationGraphProps {
  data: CitationNetworkData | null;
  isLoading: boolean;
  error: unknown;
  refetch: () => void;
}

// Node types configuration
const nodeTypes = {
  customPatentNode: CustomPatentNode,
};

// Transform API edges to React Flow format
function transformToFlowEdges(apiEdges: CitationEdge[]): Edge[] {
  return apiEdges.map((edge, index) => {
    const isExaminerCitation = edge.citationType?.toLowerCase().includes('examiner');
    
    return {
      id: `${edge.source}-${edge.target}-${index}`,
      source: edge.source,
      target: edge.target,
      type: ConnectionLineType.SmoothStep,
      animated: false,
      style: {
        stroke: isExaminerCitation ? '#EF4444' : '#3B82F6',
        strokeWidth: 2,
        opacity: 0.6,
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: isExaminerCitation ? '#EF4444' : '#3B82F6',
        width: 20,
        height: 20,
      },
      label: edge.citationType,
      labelStyle: { 
        fontSize: 10, 
        fill: isExaminerCitation ? '#DC2626' : '#2563EB',
        fontWeight: 500,
      },
      labelBgStyle: { 
        fill: '#FFFFFF', 
        fillOpacity: 0.8,
        rx: 4,
        ry: 4,
      },
    };
  });
}

// Inner component that uses React Flow hooks
function CitationGraphInner({ 
  patentId, 
  source, 
  currentPatentTitle,
  data,
  isLoading,
  error,
  refetch
}: EnhancedCitationGraphProps & {
  data: any;
  isLoading: boolean;
  error: any;
  refetch: () => void;
}) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [showLabels, setShowLabels] = useState(true);
  const [showMetricsPanel, setShowMetricsPanel] = useState(true);

  // Check if source supports citation graphs
  const isSourceSupported = source === 'PATENTSVIEW';

  // Transform data when available
  useMemo(() => {
    if (!data || !data.nodes || data.nodes.length === 0) {
      setNodes([]);
      setEdges([]);
      return;
    }

    console.log('📊 Citation Network Data Received:', {
      totalNodes: data.nodes.length,
      totalEdges: data.edges.length,
      nodes: data.nodes.map((n: { id: any; title: any; isRoot: any; }) => ({ id: n.id, title: n.title, isRoot: n.isRoot })),
      edges: data.edges.map((e: { source: any; target: any; citationType: any }) => ({ source: e.source, target: e.target, type: e.citationType })),
      metrics: data.metrics
    });

    // Validate that all edge sources and targets exist as nodes
    const nodeIds = new Set(data.nodes.map((n: { id: any }) => n.id));
    const invalidEdges = data.edges.filter((e: { source: any; target: any }) => !nodeIds.has(e.source) || !nodeIds.has(e.target));
    
    if (invalidEdges.length > 0) {
      console.warn('⚠️ Found edges with missing nodes:', invalidEdges);
    }

    // Apply hierarchical layout
    const layoutedNodes = applyHierarchicalLayout(data.nodes, patentId);
    const flowEdges = transformToFlowEdges(data.edges);

    console.log('✅ Visualization ready:', {
      layoutedNodes: layoutedNodes.length,
      flowEdges: flowEdges.length
    });

    setNodes(layoutedNodes);
    setEdges(flowEdges);
  }, [data, patentId]);

  // Control handlers - without using useReactFlow hook
  const handleZoomIn = useCallback(() => {
    // Will use Controls component built-in functionality
  }, []);

  const handleZoomOut = useCallback(() => {
    // Will use Controls component built-in functionality
  }, []);

  const handleFitView = useCallback(() => {
    // Will use Controls component built-in functionality
  }, []);

  const handleResetLayout = useCallback(() => {
    if (data && data.nodes) {
      const layoutedNodes = applyHierarchicalLayout(data.nodes, patentId);
      setNodes(layoutedNodes);
    }
  }, [data, patentId]);

  const handleExportJSON = useCallback(() => {
    if (data) {
      const exportData = {
        patent: patentId,
        nodes: data.nodes,
        edges: data.edges,
        metrics: data.metrics,
        exportedAt: new Date().toISOString(),
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `patent-${patentId}-citations.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  }, [data, patentId]);

  // Don't render if source doesn't support citations
  if (!isSourceSupported) {
    return (
      <div className="bg-blue-50/50 backdrop-blur-xl rounded-2xl p-8 border border-blue-200/50 shadow-xl">
        <h2 className="text-2xl font-semibold text-blue-900 mb-4 flex items-center gap-2">
          <Network className="w-6 h-6" />
          Citation Network (US patents only)
        </h2>
        <div className="flex items-start gap-3 p-4 bg-blue-100 border border-blue-300 rounded-lg">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-blue-800 text-sm">
            Citation network is currently available only for US patents from PatentsView API.
          </p>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-blue-200/50 shadow-xl">
        <h2 className="text-2xl font-semibold text-blue-900 mb-4 flex items-center gap-2">
          <Network className="w-6 h-6" />
          Citation Network
        </h2>
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <p className="text-gray-600 text-sm">Loading citation network...</p>
          <p className="text-gray-500 text-xs">Fetching citations from PatentsView API</p>
          <p className="text-gray-400 text-xs">This may take a few seconds</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-red-200/50 shadow-xl">
        <h2 className="text-2xl font-semibold text-blue-900 mb-4 flex items-center gap-2">
          <Network className="w-6 h-6" />
          Citation Network
        </h2>
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-300 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div>
              <p className="text-red-800 font-medium">Failed to load citation network</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          </div>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // No data state
  if (!data || !data.nodes || data.nodes.length === 0) {
    return (
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-blue-200/50 shadow-xl">
        <h2 className="text-2xl font-semibold text-blue-900 mb-4 flex items-center gap-2">
          <Network className="w-6 h-6" />
          Citation Network (Experimental)
        </h2>
        <div className="flex items-start gap-3 p-4 bg-slate-100 border border-slate-300 rounded-lg">
          <AlertCircle className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-slate-700 text-sm font-medium">No citation data available</p>
            <p className="text-slate-600 text-xs mt-1">
              This is normal for newly granted patents or patents not yet in the PatentsView database. 
              Citation data availability varies by patent age and jurisdiction.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Count citations by type
  const backwardCount = data.nodes.filter((n: any) => n.depth === 1).length;
  const forwardCount = data.nodes.filter((n: any) => n.depth === -1).length;
  const hasForwardCitations = forwardCount > 0;

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-blue-200/50 shadow-xl">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-semibold text-blue-900 flex items-center gap-2">
          <Network className="w-6 h-6" />
          Citation Network (Experimental)
        </h2>
        
        {/* Metrics Panel Toggle (Mobile) */}
        <button
          onClick={() => setShowMetricsPanel(!showMetricsPanel)}
          className="lg:hidden px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm flex items-center gap-2"
        >
          {showMetricsPanel ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {showMetricsPanel ? 'Hide' : 'Show'} Stats
        </button>
      </div>

      {/* Experimental Notice */}
      <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-xs text-amber-800">
          <strong>Limited depth for performance:</strong> Showing direct citations only (depth 1) • US patents only
        </p>
      </div>

      <div className="flex gap-6">
        {/* Main Graph Area */}
        <div className="flex-1 space-y-4">
          {/* Citation Stats */}
          <div className="flex gap-4 flex-wrap">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg">
              <span className="text-sm text-slate-600">Backward Citations:</span>
              <span className="font-bold text-slate-900">{backwardCount}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-lg">
              <span className="text-sm text-green-600">Forward Citations:</span>
              <span className="font-bold text-green-900">{forwardCount}</span>
            </div>
            {!hasForwardCitations && (
              <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span className="text-xs text-amber-700">
                  No forward citations - patent not yet cited by later patents
                </span>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-6 text-xs text-slate-600 bg-slate-50 p-4 rounded-lg">
            <div className="space-y-2">
              <div className="font-semibold text-slate-700 mb-2">Node Types:</div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-slate-400 border-2 border-slate-600 rounded-full"></div>
                <span>Prior Art (Left)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 border-4 border-white rounded-full shadow-md"></div>
                <span>Current Patent (Center)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 border-2 border-green-700 rounded-full"></div>
                <span>Later Patents (Right)</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="font-semibold text-slate-700 mb-2">Edge Types:</div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 bg-red-500"></div>
                <span>Examiner Citations</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 bg-blue-500"></div>
                <span>Applicant Citations</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleZoomIn}
              className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center gap-2"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
              Zoom In
            </button>
            <button
              onClick={handleZoomOut}
              className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center gap-2"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
              Zoom Out
            </button>
            <button
              onClick={handleFitView}
              className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center gap-2"
              title="Fit View"
            >
              <Maximize2 className="w-4 h-4" />
              Fit View
            </button>
            <button
              onClick={handleResetLayout}
              className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center gap-2"
              title="Reset Layout"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <button
              onClick={() => setShowLabels(!showLabels)}
              className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center gap-2"
              title="Toggle Labels"
            >
              {showLabels ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showLabels ? 'Hide' : 'Show'} Labels
            </button>
            <button
              onClick={handleExportJSON}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
              title="Export as JSON"
            >
              <Download className="w-4 h-4" />
              Export JSON
            </button>
          </div>

          {/* React Flow Graph */}
          <div 
            className="bg-white rounded-lg border border-slate-200 shadow-inner relative"
            style={{ width: '100%', height: '600px' }}
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{
                padding: 0.2,
                includeHiddenNodes: false,
                minZoom: 0.5,
                maxZoom: 1.5,
              }}
              attributionPosition="bottom-left"
              proOptions={{ hideAttribution: true }}
              nodesDraggable={true}
              nodesConnectable={false}
              elementsSelectable={true}
              minZoom={0.2}
              maxZoom={3}
            >
              <Background 
                variant={BackgroundVariant.Dots} 
                gap={16} 
                size={1} 
                color="#E5E7EB" 
              />
              <Controls className="bg-white border border-slate-200 rounded-lg shadow-lg" />
              <MiniMap
                className="bg-white border border-slate-200 rounded-lg shadow-lg"
                nodeColor={(node) => {
                  const nodeData = node.data as any;
                  if (nodeData?.isRoot) return '#3B82F6';
                  if (nodeData?.depth === 1) return '#94A3B8';
                  return '#10B981';
                }}
                maskColor="rgba(0, 0, 0, 0.1)"
              />
            </ReactFlow>
          </div>

          {/* Info Text */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <p className="text-sm text-slate-700 mb-3 font-medium">
              Interactive citation network visualization
            </p>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
              <li>Hover over nodes to see patent details</li>
              <li>Click on citation nodes to view that patent's details</li>
              <li>Drag nodes to reposition them</li>
              <li>Use mouse wheel to zoom in/out</li>
              <li>Arrow direction shows citing → cited relationship</li>
            </ul>
          </div>
        </div>

        {/* Metrics Panel (Desktop) */}
        {showMetricsPanel && (
          <div className="hidden lg:block w-96">
            <CitationMetricsPanel 
              metrics={data.metrics} 
              onClose={() => setShowMetricsPanel(false)}
            />
          </div>
        )}
      </div>

      {/* Metrics Panel (Mobile) */}
      {showMetricsPanel && (
        <div className="lg:hidden mt-6">
          <CitationMetricsPanel 
            metrics={data.metrics}
            onClose={() => setShowMetricsPanel(false)}
          />
        </div>
      )}
    </div>
  );
}

// Main component with ReactFlowProvider wrapper
export function EnhancedCitationGraph(props: EnhancedCitationGraphProps) {
  const { data, isLoading, error, refetch } = useCitationNetwork(props.patentId);

  return (
    <ReactFlowProvider>
      <CitationGraphInner 
        {...props} 
        data={data}
        isLoading={isLoading}
        error={error}
        refetch={refetch}
      />
    </ReactFlowProvider>
  );
}
