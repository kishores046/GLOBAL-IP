import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  BackgroundVariant,
  MiniMap,
  ConnectionLineType,
  MarkerType,
  NodeProps,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { AlertCircle, Network } from 'lucide-react';
import { CitationNetwork } from '../services/api';

interface CitationGraphProps {
  readonly citationNetwork?: CitationNetwork | null;
  readonly source?: string;
  readonly currentPatent: string;
  readonly currentPatentTitle?: string;
}

// Custom node component with tooltip
function CitationNode({ data, id }: NodeProps) {
  const navigate = useNavigate();
  const { label, title, isCurrent, nodeStyle } = data;

  const handleClick = () => {
    if (!isCurrent) {
      navigate(`/patent/${id}`);
    }
  };

  if (isCurrent) {
    return (
      <div
        className="citation-node current"
        title={title ?? label}
        style={{
          ...nodeStyle,
          cursor: 'default',
        }}
      >
        <div style={{ fontWeight: 'bold' }}>{label}</div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="citation-node clickable"
      title={title ?? label}
      style={{
        ...nodeStyle,
        cursor: 'pointer',
        border: 'none',
        textAlign: 'left',
      }}
    >
      <div>{label}</div>
    </button>
  );
}

// Node types configuration
const nodeTypes = {
  citationNode: CitationNode,
};

// Helper function to convert citation network to React Flow nodes and edges
function convertToGraphData(
  citationNetwork: CitationNetwork, 
  currentPatent: string,
  currentPatentTitle?: string
) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  // Validation helper
  const isValidPatentId = (id: any): id is string => {
    return id && 
           typeof id === 'string' && 
           id !== 'undefined' && 
           id.trim() !== '' &&
           id.toLowerCase() !== 'null';
  };

  // Center node - current patent
  nodes.push({
    id: currentPatent,
    type: 'citationNode',
    data: { 
      label: currentPatent,
      title: currentPatentTitle || 'Current Patent',
      isCurrent: true,
      nodeStyle: {
        background: '#3B82F6',
        color: '#fff',
        border: '2px solid #1E40AF',
        borderRadius: '8px',
        padding: '12px 20px',
        fontSize: '14px',
        fontWeight: 'bold',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        minWidth: '180px',
      },
    },
    position: { x: 450, y: 250 },
  });

  // Backward citations (left side - prior art)
  // Limit to 10 for visual clarity and performance
  const backwardCitations = (citationNetwork.backwardCitations || []).slice(0, 10);
  const backwardCount = backwardCitations.length;
  
  // Calculate vertical spacing to avoid overlap
  const verticalSpacing = backwardCount > 1 ? Math.min(80, 440 / (backwardCount - 1)) : 0;
  const startY = backwardCount > 1 ? 250 - ((backwardCount - 1) * verticalSpacing) / 2 : 250;

  backwardCitations.forEach((citation, index) => {
    const nodeId = citation.citedPatent;
    
    // Skip if nodeId is invalid - check for undefined (not string 'undefined')
    if (!isValidPatentId(nodeId)) {
      console.warn('Skipping backward citation with invalid nodeId:', {
        citation,
        nodeId,
        type: typeof nodeId
      });
      return;
    }
    
    const yPosition = backwardCount === 1 ? 250 : startY + index * verticalSpacing;

    nodes.push({
      id: nodeId,
      type: 'citationNode',
      data: { 
        label: nodeId,
        title: citation.title || 'Prior Art Citation',
        isCurrent: false,
        nodeStyle: {
          background: '#F3F4F6',
          color: '#374151',
          border: '2px solid #D1D5DB',
          borderRadius: '8px',
          padding: '10px 16px',
          fontSize: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          minWidth: '160px',
        },
      },
      position: { x: 50, y: yPosition },
    });

    edges.push({
      id: `backward-${nodeId}`,
      source: nodeId,
      target: currentPatent,
      type: ConnectionLineType.SmoothStep,
      animated: false,
      style: { stroke: '#9CA3AF', strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#9CA3AF',
        width: 20,
        height: 20,
      },
      label: 'cites',
      labelStyle: { fill: '#6B7280', fontSize: 10 },
      labelBgStyle: { fill: '#F9FAFB', fillOpacity: 0.8 },
    });
  });

  // Forward citations (right side - later patents)
  // Limit to 10 for visual clarity and performance
  const forwardCitations = (citationNetwork.forwardCitations || []).slice(0, 10);
  const forwardCount = forwardCitations.length;
  
  const forwardVerticalSpacing = forwardCount > 1 ? Math.min(80, 440 / (forwardCount - 1)) : 0;
  const forwardStartY = forwardCount > 1 ? 250 - ((forwardCount - 1) * forwardVerticalSpacing) / 2 : 250;

  forwardCitations.forEach((citation, index) => {
    const nodeId = citation.citingPatent;
    
    // Skip if nodeId is invalid - check for undefined (not string 'undefined')
    if (!isValidPatentId(nodeId)) {
      console.warn('Skipping forward citation with invalid nodeId:', {
        citation,
        nodeId,
        type: typeof nodeId
      });
      return;
    }
    
    const yPosition = forwardCount === 1 ? 250 : forwardStartY + index * forwardVerticalSpacing;

    nodes.push({
      id: nodeId,
      type: 'citationNode',
      data: { 
        label: nodeId,
        title: citation.title || 'Subsequent Citation',
        isCurrent: false,
        nodeStyle: {
          background: '#EEF2FF',
          color: '#4338CA',
          border: '2px solid #C7D2FE',
          borderRadius: '8px',
          padding: '10px 16px',
          fontSize: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          minWidth: '160px',
        },
      },
      position: { x: 850, y: yPosition },
    });

    // Forward citation edge: later patent (citing) → current patent (cited)
    edges.push({
      id: `forward-${nodeId}`,
      source: nodeId,
      target: currentPatent,
      type: ConnectionLineType.SmoothStep,
      animated: false,
      style: { stroke: '#818CF8', strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#818CF8',
        width: 20,
        height: 20,
      },
      label: 'cites',
      labelStyle: { fill: '#4338CA', fontSize: 10 },
      labelBgStyle: { fill: '#F9FAFB', fillOpacity: 0.8 },
    });
  });

  // Log any invalid citations that were skipped
  const invalidBackward = (citationNetwork.backwardCitations || []).filter(
    c => !isValidPatentId(c.citedPatent)
  ).length;
  
  const invalidForward = (citationNetwork.forwardCitations || []).filter(
    c => !isValidPatentId(c.citingPatent)
  ).length;
  
  if (invalidBackward > 0) {
    console.warn(`Skipped ${invalidBackward} backward citation(s) with invalid patent IDs`);
  }
  
  if (invalidForward > 0) {
    console.warn(`Skipped ${invalidForward} forward citation(s) with invalid patent IDs`);
  }

  return { nodes, edges };
}

export function CitationGraph({ citationNetwork, source, currentPatent, currentPatentTitle }: CitationGraphProps) {
  // Check if source supports citation graphs
  const isSourceSupported = source === 'PATENTSVIEW';

  // Check if citation data exists (support both new and legacy fields)
  const backwardTotal = citationNetwork?.backwardTotal ?? citationNetwork?.backwardCount ?? 0;
  const forwardTotal = citationNetwork?.forwardTotal ?? citationNetwork?.forwardCount ?? 0;
  const hasCitationData = citationNetwork && (backwardTotal > 0 || forwardTotal > 0);

  // Convert citation network to graph data
  const { nodes, edges } = useMemo(() => {
    if (!hasCitationData || !citationNetwork) {
      return { nodes: [], edges: [] };
    }
    const graphData = convertToGraphData(citationNetwork, currentPatent, currentPatentTitle);
    console.log('Citation Graph Data:', {
      backwardTotal,
      forwardTotal,
      nodesCount: graphData.nodes.length,
      edgesCount: graphData.edges.length,
      nodes: graphData.nodes.map(n => ({ id: n.id, position: n.position })),
    });
    return graphData;
  }, [citationNetwork, currentPatent, currentPatentTitle, hasCitationData, backwardTotal, forwardTotal]);

  // Don't render anything if source doesn't support citations
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
            Citation network is currently available only for US patents.
          </p>
        </div>
      </div>
    );
  }

  // Show message if no citation data
  if (!hasCitationData) {
    return (
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-blue-200/50 shadow-xl">
        <h2 className="text-2xl font-semibold text-blue-900 mb-4 flex items-center gap-2">
          <Network className="w-6 h-6" />
          Citation Network (US patents only)
        </h2>
        <div className="flex items-start gap-3 p-4 bg-slate-100 border border-slate-300 rounded-lg">
          <AlertCircle className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
          <p className="text-slate-700 text-sm">
            No citation data available for this patent.
          </p>
        </div>
      </div>
    );
  }

  // Calculate displayed counts
  const backwardDisplayed = citationNetwork.backwardCitations?.length ?? 0;
  const forwardDisplayed = citationNetwork.forwardCitations?.length ?? 0;

  // Render the citation graph
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-blue-200/50 shadow-xl">
      <h2 className="text-2xl font-semibold text-blue-900 mb-4 flex items-center gap-2">
        <Network className="w-6 h-6" />
        Citation Network (US patents only)
      </h2>

      {/* Citation stats with truncation indicators and zero forward citation handling */}
      <div className="flex gap-4 mb-4 flex-wrap">
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg">
          <span className="text-sm text-slate-600">Backward Citations:</span>
          <span className="font-bold text-slate-900">
            {backwardTotal > backwardDisplayed 
              ? `${backwardDisplayed} of ${backwardTotal}` 
              : backwardTotal}
          </span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-lg">
          <span className="text-sm text-indigo-600">Forward Citations:</span>
          <span className="font-bold text-indigo-900">
            {forwardTotal > forwardDisplayed 
              ? `${forwardDisplayed} of ${forwardTotal}` 
              : forwardTotal}
          </span>
        </div>
        {forwardTotal === 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span className="text-xs text-amber-700">
              0 forward citations - this patent has not yet been cited by later patents
            </span>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex gap-6 mb-4 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-slate-200 border-2 border-slate-400 rounded"></div>
          <span>Prior Art (Left)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 border-2 border-blue-700 rounded"></div>
          <span>Current Patent (Center)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-indigo-100 border-2 border-indigo-300 rounded"></div>
          <span>Later Patents (Right)</span>
        </div>
      </div>

      {/* React Flow Graph with custom node types */}
      <div 
        className="bg-white rounded-lg border border-slate-200 shadow-inner relative"
        style={{ width: '100%', height: '500px' }}
      >
        {nodes.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-500">
            <div className="text-center">
              <p className="text-lg font-semibold mb-2">No graph data available</p>
              <p className="text-sm">Debug: {backwardTotal} backward, {forwardTotal} forward citations detected</p>
            </div>
          </div>
        ) : (
          <>
            {/* Debug indicator */}
            <div className="absolute top-2 right-2 z-10 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
              {nodes.length} nodes • {edges.length} edges
            </div>
            <ReactFlow
              nodes={nodes}
              edges={edges}
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
              nodesDraggable={false}
              nodesConnectable={false}
              elementsSelectable={true}
              minZoom={0.3}
              maxZoom={2}
            >
            <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#E5E7EB" />
            <Controls className="bg-white border border-slate-200 rounded-lg shadow-lg" />
            <MiniMap
              className="bg-white border border-slate-200 rounded-lg shadow-lg"
              nodeColor={(node) => {
                if (node.id === currentPatent) return '#3B82F6';
                if (node.position.x < 400) return '#9CA3AF';
                return '#818CF8';
              }}
              maskColor="rgba(0, 0, 0, 0.1)"
            />
          </ReactFlow>
          </>
        )}
      </div>

      {/* Detailed explanation */}
      <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-lg">
        <p className="text-sm text-slate-700 mb-3 font-medium">
          Displaying up to 10 prior-art (backward) and 10 subsequent (forward) citations for readability.
        </p>
        <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
          <li>Prior-art citations are ordered by reference sequence</li>
          <li>Subsequent citations are ordered by most recent filings</li>
          <li>Some patents may have no forward citations if they are not yet cited</li>
          <li>Click on any citation node to view that patent's details</li>
        </ul>
      </div>
    </div>
  );
}
