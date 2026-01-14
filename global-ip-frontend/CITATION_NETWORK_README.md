# Enhanced Citation Network Visualization

A comprehensive patent citation network visualization component built with React Flow for the Global IP Platform.

## 📁 File Structure

```
src/
├── components/
│   ├── citation/
│   │   ├── EnhancedCitationGraph.tsx    # Main graph component with enhanced API
│   │   ├── CustomPatentNode.tsx          # Custom node with rich tooltips
│   │   ├── CitationMetricsPanel.tsx      # Network statistics sidebar
│   │   └── index.ts                      # Exports
│   └── CitationGraph.tsx                 # Legacy component (preserved)
├── hooks/
│   └── useCitationNetwork.ts             # Data fetching hook
├── types/
│   └── citation.ts                       # TypeScript interfaces
└── utils/
    └── citationLayout.ts                 # Layout algorithms
```

## 🚀 Features

### Core Functionality

- ✅ **Hierarchical Layout**: Root patent centered, backward citations left, forward citations right
- ✅ **Interactive Nodes**: Hover for tooltips, click to navigate to patent details
- ✅ **Rich Tooltips**: Show patent number, title, assignee, grant date, citation counts, IPC class
- ✅ **Edge Styling**: Color-coded by citation type (examiner vs applicant)
- ✅ **Network Metrics**: Side panel with statistics, insights, and distributions

### Visualization

- ✅ **Node Sizing**: Dynamic sizing based on citation importance (15-40px)
- ✅ **Node Colors**:
  - Blue (#3B82F6) - Current patent (root)
  - Slate (#94A3B8) - Backward citations (prior art)
  - Green (#10B981) - Forward citations (later patents)
- ✅ **Glow Effect**: Highly cited patents (10+) get shadow glow
- ✅ **Edge Types**:
  - Red (#EF4444) - Examiner citations
  - Blue (#3B82F6) - Applicant citations

### Controls

- ✅ **Zoom In/Out**: Manual zoom controls
- ✅ **Fit View**: Auto-fit all nodes in viewport
- ✅ **Reset Layout**: Restore original hierarchical layout
- ✅ **Toggle Labels**: Show/hide patent labels
- ✅ **Export JSON**: Download citation data
- ✅ **Draggable Nodes**: Reposition nodes manually

### Empty States

- ✅ **No Forward Citations**: Clear messaging for patents with 0 forward citations
- ✅ **No Data Available**: Graceful handling when API returns empty
- ✅ **Loading State**: Spinner with status message
- ✅ **Error State**: Error message with retry button
- ✅ **Unsupported Source**: Message for non-US patents

### Metrics Panel

- ✅ **Network Statistics**: Total nodes, edges, density, avg citations
- ✅ **Most Cited Patent**: Highlight with navigation link
- ✅ **Key Insights**: Auto-generated based on network characteristics
- ✅ **Assignee Distribution**: Top 3 assignees with bar charts
- ✅ **Technology Areas**: Top IPC classifications
- ✅ **Responsive**: Collapses on mobile, expandable

## 📡 API Integration

### Primary Endpoint

```
GET /api/patents/{patentId}/citations/network?backwardDepth=1&forwardDepth=1
```

### Response Structure

See `src/types/citation.ts` for complete TypeScript interfaces:

- `CitationNetworkResponse` - Complete network data
- `PatentNode` - Node properties
- `CitationEdge` - Edge properties
- `NetworkMetrics` - Statistics
- `TechnologyCluster` - Clustering data

## 🎨 Usage

### Basic Usage

```tsx
import { EnhancedCitationGraph } from "@/components/citation";

function PatentDetailPage({ patentId }: { patentId: string }) {
  return (
    <div>
      {/* Other patent details */}

      <EnhancedCitationGraph
        patentId={patentId}
        source="PATENTSVIEW"
        currentPatentTitle="Method for improving efficiency"
      />
    </div>
  );
}
```

### With Custom Hook

```tsx
import { useCitationNetwork } from "@/hooks/useCitationNetwork";

function CustomComponent({ patentId }: { patentId: string }) {
  const { data, isLoading, error, refetch } = useCitationNetwork(patentId, {
    backwardDepth: 2, // Get 2 levels of backward citations
    forwardDepth: 1, // Get 1 level of forward citations
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Citation Network for {patentId}</h2>
      <p>Total nodes: {data?.metrics.totalNodes}</p>
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

### Legacy Component (Backward Compatible)

```tsx
import { CitationGraph } from "@/components/CitationGraph";

// Old API format still supported
<CitationGraph
  citationNetwork={legacyData}
  currentPatent="US10006624"
  source="PATENTSVIEW"
/>;
```

## 🎯 Component Props

### EnhancedCitationGraph

| Prop                 | Type     | Required | Description                         |
| -------------------- | -------- | -------- | ----------------------------------- |
| `patentId`           | `string` | ✅       | Patent ID to fetch citations for    |
| `source`             | `string` | ❌       | Data source (must be "PATENTSVIEW") |
| `currentPatentTitle` | `string` | ❌       | Title to display for current patent |

### CustomPatentNode

| Prop   | Type                   | Required | Description                |
| ------ | ---------------------- | -------- | -------------------------- |
| `data` | `CustomPatentNodeData` | ✅       | Node data with patent info |
| `id`   | `string`               | ✅       | Unique node identifier     |

### CitationMetricsPanel

| Prop      | Type             | Required | Description          |
| --------- | ---------------- | -------- | -------------------- |
| `metrics` | `NetworkMetrics` | ✅       | Network metrics data |
| `onClose` | `() => void`     | ❌       | Close button handler |

## 🎨 Styling

The component uses Tailwind CSS for styling. Key classes:

```tsx
// Node styling
"rounded-full flex items-center justify-center text-white font-medium";

// Tooltip
"absolute z-50 bg-white rounded-lg shadow-xl border-2 border-gray-200 p-4";

// Metrics panel
"bg-white rounded-xl shadow-lg border border-gray-200 p-6 space-y-6";

// Controls
"px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50";
```

## 🔧 Layout Algorithms

### Hierarchical Layout (Default)

```typescript
import { applyHierarchicalLayout } from "@/utils/citationLayout";

const nodes = applyHierarchicalLayout(apiNodes, rootPatentId, {
  centerX: 500,
  centerY: 300,
  horizontalSpacing: 400,
  verticalSpacing: 80,
});
```

### Radial Layout (Alternative)

```typescript
import { applyRadialLayout } from "@/utils/citationLayout";

const nodes = applyRadialLayout(apiNodes, rootPatentId, {
  centerX: 500,
  centerY: 300,
});
```

## 📊 Network Metrics

The metrics panel automatically calculates and displays:

1. **Basic Stats**

   - Total nodes
   - Total edges
   - Citation density
   - Average citations per patent

2. **Highlights**

   - Most cited patent with navigation
   - Number of technology clusters

3. **Distributions**

   - Top 3 assignees with bar charts
   - Top 3 technology areas (IPC)

4. **Auto-Generated Insights**
   - Large citation network detection
   - High/low density interpretation
   - Multiple cluster identification
   - Assignee diversity analysis

## 🧪 Testing Scenarios

Test with these patent IDs:

| Patent     | Scenario                                             |
| ---------- | ---------------------------------------------------- |
| US10006624 | Normal patent with backward citations                |
| US11234567 | New patent (2023+) - likely 0 forward citations      |
| US8888888  | Popular patent with 10+ forward citations            |
| US9999999  | Patent with 50+ backward citations (truncation test) |

## 🚧 Future Enhancements

Planned features (not yet implemented):

- [ ] PNG export using html2canvas
- [ ] Search/filter nodes by patent number or assignee
- [ ] Highlight citation path between two patents
- [ ] Time slider to animate network growth
- [ ] Assignee filter
- [ ] IPC classification filter
- [ ] Comparison mode (2 patents side-by-side)
- [ ] Deep dive mode (expand node's citations)
- [ ] Context menu on right-click
- [ ] Cluster visualization with color coding

## 📱 Responsive Design

- **Desktop (≥1024px)**: Full layout with side metrics panel
- **Tablet (768-1023px)**: Collapsible metrics panel
- **Mobile (<768px)**: Metrics panel below graph, toggle button

## ⚡ Performance

- **Lazy Loading**: Nodes and edges only created when data available
- **Memoization**: Layout calculations memoized
- **Truncation**: Large networks limited to prevent browser freeze
- **Optimized Rendering**: React Flow handles virtualization

## 🐛 Error Handling

1. **API Errors**: Show error message with retry button
2. **Empty Data**: Clear message explaining no citations found
3. **Unsupported Source**: Inform user only US patents supported
4. **Network Errors**: Timeout and retry logic in hook

## 📝 TypeScript Support

Full TypeScript support with comprehensive interfaces:

```typescript
import type {
  CitationNetworkResponse,
  PatentNode,
  CitationEdge,
  NetworkMetrics,
  TechnologyCluster,
} from "@/types/citation";
```

## 🤝 Contributing

When adding new features:

1. Update TypeScript interfaces in `src/types/citation.ts`
2. Add tests for new layout algorithms
3. Update this README with new props/features
4. Ensure backward compatibility with legacy CitationGraph
5. Test on mobile devices

## 📄 License

Part of the Global IP Platform - All rights reserved

---

**Built with:**

- React Flow v11
- React 18
- TypeScript 5
- Tailwind CSS 3
- Lucide React Icons
