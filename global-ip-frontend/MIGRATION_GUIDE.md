# Migration Guide: Legacy to Enhanced Citation Graph

## Overview

This guide helps you migrate from the legacy `CitationGraph` component to the new `EnhancedCitationGraph` component with enhanced API integration.

## Quick Migration

### Before (Legacy)

```tsx
import { CitationGraph } from "@/components/CitationGraph";

<CitationGraph
  citationNetwork={legacyApiData}
  currentPatent="US10006624"
  source="PATENTSVIEW"
  currentPatentTitle="Method for..."
/>;
```

### After (Enhanced)

```tsx
import { EnhancedCitationGraph } from "@/components/citation";

<EnhancedCitationGraph
  patentId="US10006624"
  source="PATENTSVIEW"
  currentPatentTitle="Method for..."
/>;
```

## Key Differences

| Feature            | Legacy             | Enhanced                          |
| ------------------ | ------------------ | --------------------------------- |
| **Data Fetching**  | Manual (pass data) | Automatic (uses hook)             |
| **API Endpoint**   | Old `/citations`   | New `/citations/network`          |
| **Node Styling**   | Basic circles      | Rich, sized nodes with tooltips   |
| **Interactivity**  | Click to navigate  | Hover tooltips + click navigation |
| **Metrics**        | None               | Side panel with statistics        |
| **Controls**       | Basic React Flow   | Full zoom, fit, reset, export     |
| **Layout**         | Simple positioning | Hierarchical algorithm            |
| **Empty States**   | Basic message      | Comprehensive states              |
| **Loading**        | None               | Spinner with status               |
| **Error Handling** | None               | Retry button                      |

## Migration Steps

### Step 1: Update Imports

```tsx
// Old
import { CitationGraph } from "@/components/CitationGraph";

// New
import { EnhancedCitationGraph } from "@/components/citation";
```

### Step 2: Remove Manual Data Fetching

```tsx
// Old - You had to fetch data manually
const [citationData, setCitationData] = useState(null);

useEffect(() => {
  fetch(`/api/patents/${patentId}/citations`)
    .then(res => res.json())
    .then(data => setCitationData(data));
}, [patentId]);

<CitationGraph citationNetwork={citationData} ... />

// New - Component handles fetching
<EnhancedCitationGraph patentId={patentId} ... />
```

### Step 3: Update Props

```tsx
// Old props
interface CitationGraphProps {
  citationNetwork?: CitationNetwork | null; // ❌ Remove
  source?: string; // ✅ Keep
  currentPatent: string; // ❌ Change to patentId
  currentPatentTitle?: string; // ✅ Keep
}

// New props
interface EnhancedCitationGraphProps {
  patentId: string; // ✅ New (replaces currentPatent)
  source?: string; // ✅ Same
  currentPatentTitle?: string; // ✅ Same
}
```

### Step 4: Update Component Usage

```tsx
// Old
<CitationGraph
  citationNetwork={data}
  currentPatent={patent.id}
  source={patent.source}
  currentPatentTitle={patent.title}
/>

// New
<EnhancedCitationGraph
  patentId={patent.id}
  source={patent.source}
  currentPatentTitle={patent.title}
/>
```

## Backend API Changes

### Old API Endpoint

```
GET /api/patents/{patentId}/citations
```

**Response:**

```json
{
  "backwardCitations": [{ "citedPatent": "US9999999", "title": "..." }],
  "forwardCitations": [{ "citingPatent": "US8888888", "title": "..." }],
  "backwardTotal": 5,
  "forwardTotal": 3
}
```

### New API Endpoint

```
GET /api/patents/{patentId}/citations/network?backwardDepth=1&forwardDepth=1
```

**Response:**

```json
{
  "nodes": [
    {
      "patentId": "US10006624",
      "title": "...",
      "assignee": "...",
      "ipcClasses": ["H04L29/06"],
      "backwardCitationCount": 5,
      "forwardCitationCount": 3,
      "nodeSize": 35,
      "nodeColor": "#3B82F6",
      "depth": 0
    }
  ],
  "edges": [
    {
      "source": "US9999999",
      "target": "US10006624",
      "citationType": "cited by applicant",
      "weight": 1
    }
  ],
  "metrics": {
    "totalNodes": 8,
    "totalEdges": 12,
    "citationDensity": 0.23,
    "averageCitationsPerPatent": 5.8,
    "assigneeDistribution": { "Google": 3, "Microsoft": 2 },
    "technologyDistribution": { "H04L": 5, "G06F": 3 }
  },
  "clusters": {}
}
```

## Feature Comparison

### ✅ New Features (Not in Legacy)

1. **Network Metrics Panel**

   - Total nodes/edges
   - Citation density
   - Most cited patent
   - Assignee distribution
   - Technology areas
   - Auto-generated insights

2. **Enhanced Interactivity**

   - Rich tooltips with patent details
   - Zoom in/out controls
   - Fit view button
   - Reset layout
   - Export to JSON
   - Draggable nodes

3. **Better Visual Design**

   - Dynamic node sizing (based on importance)
   - Color-coded by citation type
   - Glow effect for highly cited patents
   - Smooth animations
   - Professional styling

4. **Comprehensive States**

   - Loading spinner
   - Error with retry
   - Empty state messages
   - No forward citations explanation
   - Unsupported source warning

5. **Responsive Design**
   - Collapsible metrics panel on mobile
   - Touch-friendly controls
   - Adaptive layout

### 🔄 Preserved Features

- ✅ Basic graph visualization
- ✅ Source validation (US patents only)
- ✅ Click to navigate to patent details
- ✅ Legend explaining colors
- ✅ Backward/forward citation counts

## Custom Hook Usage

If you need more control, use the hook directly:

```tsx
import { useCitationNetwork } from "@/hooks/useCitationNetwork";

function MyCustomComponent({ patentId }: { patentId: string }) {
  const { data, isLoading, error, refetch } = useCitationNetwork(patentId, {
    backwardDepth: 2, // Get 2 levels deep
    forwardDepth: 1,
  });

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage error={error} onRetry={refetch} />;
  if (!data) return <EmptyState />;

  return (
    <div>
      <h2>Network with {data.metrics.totalNodes} nodes</h2>
      {/* Custom visualization */}
    </div>
  );
}
```

## Backward Compatibility

The legacy component is still available if you need it:

```tsx
import { CitationGraph } from '@/components/CitationGraph';

// Still works with old API data
<CitationGraph citationNetwork={oldData} ... />
```

## Rollback Plan

If you need to rollback:

1. Keep using `CitationGraph` from `@/components/CitationGraph`
2. Don't delete legacy API endpoint
3. Test both components side-by-side

## Testing Checklist

Before deploying to production:

- [ ] Test with patent that has 0 forward citations
- [ ] Test with patent that has 50+ backward citations
- [ ] Test with new patent (2023+)
- [ ] Test with popular patent (10+ citations each direction)
- [ ] Test error state (invalid patent ID)
- [ ] Test loading state (slow network)
- [ ] Test on mobile device
- [ ] Test on tablet
- [ ] Test zoom controls
- [ ] Test export functionality
- [ ] Test node click navigation
- [ ] Test tooltip display
- [ ] Verify metrics panel shows correctly
- [ ] Check responsive layout

## Performance Considerations

### Legacy Component

- ⚠️ No data memoization
- ⚠️ Basic node rendering
- ⚠️ No layout optimization

### Enhanced Component

- ✅ Memoized layout calculations
- ✅ Efficient node rendering
- ✅ Optimized for 50+ node networks
- ✅ Lazy loading of metrics

## Common Issues & Solutions

### Issue: "Cannot find module '@/components/citation'"

**Solution:** Check your TypeScript paths configuration:

```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Issue: API returns 404

**Solution:** Ensure backend has new endpoint:

```
GET /api/patents/{patentId}/citations/network
```

### Issue: Metrics panel not showing

**Solution:** Check responsive breakpoint or toggle visibility:

```tsx
<EnhancedCitationGraph ... />
// Panel auto-hides on mobile, click "Show Stats" button
```

### Issue: Nodes not clickable

**Solution:** Ensure you have routing set up:

```tsx
// App routing
<Route path="/patent/:patentId" element={<PatentDetailPage />} />
```

## Support

For issues or questions:

1. Check `CITATION_NETWORK_README.md` for detailed docs
2. Review `IntegrationExample.tsx` for usage examples
3. Contact development team

## Next Steps

After migration:

1. Monitor API performance
2. Gather user feedback
3. Consider implementing advanced features:
   - PNG export
   - Search/filter
   - Time slider
   - Cluster visualization

---

**Migration completed successfully! 🎉**
