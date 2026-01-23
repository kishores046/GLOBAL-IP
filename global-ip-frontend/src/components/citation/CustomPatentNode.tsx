import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Handle, Position, NodeProps } from 'reactflow';
import { PatentNode } from '../../types/citation';
import { isAuthenticated } from '../../utils/authUtils';

interface CustomPatentNodeData extends PatentNode {
  label: string;
  isRoot: boolean;
}

export function CustomPatentNode({ data, id }: NodeProps<CustomPatentNodeData>) {
  const navigate = useNavigate();
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = () => {
    if (data.isRoot) {
      console.log('🔵 Root node clicked - no navigation');
      return;
    }
    
    // Check authentication before navigating
    if (!isAuthenticated()) {
      console.warn('⚠️ User not authenticated, redirecting to login');
      alert('Your session has expired. Please log in again.');
      navigate('/login');
      return;
    }
    
    console.log('✅ Navigating to patent:', id);
    // Use correct route pattern: /patents/ (plural)
    navigate(`/patents/${id}`);
  };

  const totalCitations = data.backwardCitationCount + data.forwardCitationCount;
  const isHighlyCited = totalCitations >= 10;

  // Root nodes are non-interactive, use div without handlers
  if (data.isRoot) {
    return (
      <>
        <Handle type="target" position={Position.Left} />
        
        <div className="relative" style={{ cursor: 'default' }}>
          {/* Node Circle */}
          <div
            className={`
              rounded-full flex items-center justify-center text-white font-medium
              ${isHighlyCited ? 'shadow-lg' : 'shadow-md'}
              border-4 border-white
            `}
            style={{
              width: `${data.nodeSize}px`,
              height: `${data.nodeSize}px`,
              backgroundColor: data.nodeColor,
              fontSize: '12px',
              boxShadow: isHighlyCited ? `0 0 20px ${data.nodeColor}80` : undefined,
            }}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <span className="font-bold">{data.label}</span>
          </div>

          {/* Tooltip */}
          {showTooltip && (
            <div
              className="absolute z-50 bg-white rounded-lg shadow-xl border-2 border-gray-200 p-4 min-w-[280px]"
              style={{
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                marginTop: '8px',
                pointerEvents: 'none',
              }}
            >
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-blue-600 min-w-[60px]">Patent:</span>
                  <span className="text-gray-900">{data.patentId}</span>
                </div>
                
                {data.title && (
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-blue-600 min-w-[60px]">Title:</span>
                    <span className="text-gray-700 line-clamp-2">{data.title}</span>
                  </div>
                )}
                
                {data.assignee && (
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-blue-600 min-w-[60px]">Assignee:</span>
                    <span className="text-gray-700">{data.assignee}</span>
                  </div>
                )}
                
                {data.grantDate && (
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-blue-600 min-w-[60px]">Grant Date:</span>
                    <span className="text-gray-700">{data.grantDate}</span>
                  </div>
                )}
                
                <div className="flex items-start gap-2">
                  <span className="font-bold text-blue-600 min-w-[60px]">Citations:</span>
                  <span className="text-gray-700">
                    {data.backwardCitationCount} cited / {data.forwardCitationCount} citing
                  </span>
                </div>
                
                {data.ipcClasses && data.ipcClasses.length > 0 && (
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-blue-600 min-w-[60px]">IPC:</span>
                    <span className="text-gray-700">{data.ipcClasses[0]}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <Handle type="source" position={Position.Right} />
      </>
    );
  }

  // Citation nodes are interactive, use button
  return (
    <>
      <Handle type="target" position={Position.Left} />
      
      <button
        type="button"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={handleClick}
        className="relative border-0 bg-transparent p-0 m-0"
        style={{ cursor: 'pointer' }}
        aria-label={`View patent ${data.patentId}`}
      >
        {/* Node Circle */}
        <div
          className={`
            rounded-full flex items-center justify-center text-white font-medium
            ${isHighlyCited ? 'shadow-lg' : 'shadow-md'}
            border-2 border-gray-200
            transition-transform hover:scale-110
          `}
          style={{
            width: `${data.nodeSize}px`,
            height: `${data.nodeSize}px`,
            backgroundColor: data.nodeColor,
            fontSize: '10px',
            boxShadow: isHighlyCited ? `0 0 20px ${data.nodeColor}80` : undefined,
          }}
        />

        {/* Tooltip */}
        {showTooltip && (
          <div
            className="absolute z-50 bg-white rounded-lg shadow-xl border-2 border-gray-200 p-4 min-w-[280px]"
            style={{
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginTop: '8px',
              pointerEvents: 'none',
            }}
          >
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="font-bold text-blue-600 min-w-[60px]">Patent:</span>
                <span className="text-gray-900">{data.patentId}</span>
              </div>
              
              {data.title && (
                <div className="flex items-start gap-2">
                  <span className="font-bold text-blue-600 min-w-[60px]">Title:</span>
                  <span className="text-gray-700 line-clamp-2">{data.title}</span>
                </div>
              )}
              
              {data.assignee && (
                <div className="flex items-start gap-2">
                  <span className="font-bold text-blue-600 min-w-[60px]">Assignee:</span>
                  <span className="text-gray-700">{data.assignee}</span>
                </div>
              )}
              
              {data.grantDate && (
                <div className="flex items-start gap-2">
                  <span className="font-bold text-blue-600 min-w-[60px]">Grant Date:</span>
                  <span className="text-gray-700">{data.grantDate}</span>
                </div>
              )}
              
              <div className="flex items-start gap-2">
                <span className="font-bold text-blue-600 min-w-[60px]">Citations:</span>
                <span className="text-gray-700">
                  {data.backwardCitationCount} cited / {data.forwardCitationCount} citing
                </span>
              </div>
              
              {data.ipcClasses && data.ipcClasses.length > 0 && (
                <div className="flex items-start gap-2">
                  <span className="font-bold text-blue-600 min-w-[60px]">IPC:</span>
                  <span className="text-gray-700">{data.ipcClasses[0]}</span>
                </div>
              )}
              
              <div className="pt-2 border-t border-gray-200 text-xs text-gray-500 italic text-center">
                Click to view details
              </div>
            </div>
          </div>
        )}
      </button>

      <Handle type="source" position={Position.Right} />
    </>
  );
}
