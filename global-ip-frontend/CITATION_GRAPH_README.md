# Patent Citation Graph Visualization

## Overview

A React Flow-based citation network visualization component for patent details. This component displays the citation relationships for US patents (PatentsView source) with proper conditional rendering and graceful handling for unsupported sources.

## Features

✅ **Interactive Graph Visualization**

- Directed graph with React Flow
- Center node = current patent
- Left side = backward citations (prior art)
- Right side = forward citations (later patents)
- Arrows indicate citation direction

✅ **Source-Aware Rendering**

- Only renders for `PATENTSVIEW` source
- Shows informational message for EPO and other sources
- Handles missing citation data gracefully

✅ **User Experience**

- Zoom & pan controls
- Mini-map for navigation
- Visual legend explaining node types
- Citation count statistics
- Limits display to 10 citations per direction for clarity

✅ **Proper Integration**

- Appears only on Patent Detail Page (not search results)
- Positioned below the abstract section
- Lazy-loaded with motion animations
- 500px container height

## Architecture

### Files Created/Modified

1. **`src/components/CitationGraph.tsx`** (NEW)

   - Main visualization component
   - Helper function `convertToGraphData()`
   - Conditional rendering logic

2. **`src/services/api.ts`** (MODIFIED)

   - Added `Citation` interface
   - Added `CitationNetwork` interface
   - Updated `GlobalPatentDetailDto` to include `citationNetwork` field

3. **`src/pages/PatentDetailPage.tsx`** (MODIFIED)
   - Imported `CitationGraph` component
   - Added component below abstract section with motion animation

### Type Definitions

```typescript
interface Citation {
  citingPatent: string;
  citedPatent: string;
  citationDirection: "BACKWARD" | "FORWARD";
  citationType?: string;
  country?: string;
}

interface CitationNetwork {
  centerPatent: string; // The current patent number
  backwardCitations: Citation[]; // Already capped at 10 by backend
  forwardCitations: Citation[]; // Already capped at 10 by backend
  backwardTotal: number; // Full count before truncation
  forwardTotal: number; // Full count before truncation
  truncated: boolean; // True if totals > rendered
  // Legacy fields for backward compatibility
  patentNumber?: string;
  backwardCount?: number;
  forwardCount?: number;
}

interface GlobalPatentDetailDto {
  // ... existing fields
  citationNetwork?: CitationNetwork | null;
}
```

## API Contract

### Expected Response Format (Updated)

```json
{
  "publicationNumber": "US1234567B2",
  "source": "PATENTSVIEW",
  "jurisdiction": "US",
  "title": "Example Patent",
  "abstractText": "...",

  "citationNetwork": {
    "centerPatent": "US1234567B2",
    "backwardTotal": 12,
    "forwardTotal": 7,
    "truncated": true,
    "backwardCitations": [
      {
        "citingPatent": "US1234567B2",
        "citedPatent": "US7654321B1",
        "citationDirection": "BACKWARD",
        "citationType": "US_PATENT",
        "country": "US"
      }
    ],
    "forwardCitations": [
      {
        "citingPatent": "US9999999B2",
        "citedPatent": "US1234567B2",
        "citationDirection": "FORWARD",
        "citationType": "US_PATENT",
        "country": "US"
      }
    ]
  }
}
```

### Handling Different Sources

- **PatentsView (US)**: Full citation graph displayed
- **EPO**: Informational message shown
- **Other sources**: Informational message shown
- **No citation data**: "No citation data available" message

## Component Usage

```tsx
import { CitationGraph } from "../components/CitationGraph";

<CitationGraph
  citationNetwork={patent.citationNetwork}
  source={patent.source}
  currentPatent={patent.publicationNumber}
/>;
```

## Visual Layout

```
┌───────────────────────────────────────────────────────────────┐
│         Citation Network (US patents only)                    │
├───────────────────────────────────────────────────────────────┤
│  Stats: [Backward: 10 of 12] [Forward: 7]                    │
│  Legend: [Prior Art] [Current] [Later Patents]               │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                                                        │  │
│  │   [Prior Art]  →  [Current]  →  [Later]              │  │
│  │   [Prior Art]  →   Patent   →  [Later]               │  │
│  │   [Prior Art]  →            →  [Later]               │  │
│  │                                                        │  │
│  │   Controls: [+ - ⊡ ⊙]    MiniMap: [▪]                │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                               │
│  ℹ️ Displaying up to 10 prior-art (backward) and 10          │
│     subsequent (forward) citations for readability.          │
│     • Prior-art citations are ordered by reference sequence  │
│     • Subsequent citations are ordered by most recent filings│
│     • Some patents may have no forward citations if not yet  │
│       cited                                                   │
└───────────────────────────────────────────────────────────────┘
```

## UI Copy (Important)

The component displays a detailed explanation panel that removes all ambiguity:

**Title**: "Citation Network (US patents only)"

**Stats badges**: Show "X of Y" when truncated (e.g., "10 of 12"), otherwise just the count

**Explanation panel**:

- "Displaying up to 10 prior-art (backward) and 10 subsequent (forward) citations for readability."
- Bullet points explaining:
  - Prior-art citations are ordered by reference sequence
  - Subsequent citations are ordered by most recent filings
  - Some patents may have no forward citations if they are not yet cited

This messaging:

- ✅ Removes ambiguity about limits
- ✅ Explains zero forward citations as valid
- ✅ Clarifies ordering logic
- ✅ Builds trust with "X of Y" indicators

## Styling

- **Current Patent**: Blue background (#3B82F6), bold, center
- **Backward Citations**: Gray background (#F3F4F6), left side
- **Forward Citations**: Indigo background (#EEF2FF), right side
- **Edges**: Smooth step connections with arrow markers
- **Container**: 500px height, white background, rounded corners

## Conditional Rendering Logic

```typescript
1. Check source === "PATENTSVIEW"
   ├─ NO → Show "Citation network is currently available only for US patents"
   └─ YES → Continue

2. Check citationNetwork exists and has data (backwardTotal > 0 OR forwardTotal > 0)
   ├─ NO → Show "No citation data available for this patent"
   └─ YES → Render graph

3. Backend provides citations already capped at 10 per direction
4. Display "X of Y" when backwardTotal or forwardTotal > displayed count
5. Position nodes vertically on left/right
6. Add directional edges with labels
7. Show detailed explanation panel about ordering and zero citations
```

## Backend ↔ Frontend Contract

**Critical**: The frontend expects the backend to:

- Cap `backwardCitations` and `forwardCitations` arrays at 10 items max
- Provide `backwardTotal` and `forwardTotal` with full counts
- Set `truncated: true` when total > displayed
- Order backward citations by reference sequence
- Order forward citations by most recent filings

This contract ensures:

- **Trust**: "Showing 10 of 11" is accurate
- **Performance**: No frontend filtering needed
- **Consistency**: Backend owns ordering logic

## Dependencies

- **reactflow**: ^11.x (installed via npm)
- **lucide-react**: For icons (already in project)
- **motion**: For animations (already in project)

## Non-Goals

❌ No maps  
❌ No timelines  
❌ No recursive graph expansion  
❌ No API calls from graph component  
❌ No Neo4j assumptions  
❌ No display on search result pages

## Testing Scenarios

1. **US Patent with Citations**: Full graph rendered with "X of Y" indicators
2. **US Patent with Zero Forward Citations**: Shows 0, with explanation that this is normal
3. **US Patent without Any Citations**: "No citation data available" message
4. **EPO Patent**: "Citation network is currently available only for US patents"
5. **Patent with 100+ Citations**: Shows "10 of 100+", backend pre-filters
6. **Search Results Page**: No graph shown (only on detail page)
7. **Patent with Exactly 10 Citations**: Shows "10" (no "of" suffix)

## Why This Design?

✅ **Graphs scale O(n²) visually** — limits are necessary  
✅ **Forward citations are often 0 for newer patents** — this is valid, not an error  
✅ **Reviewers care about clarity + honesty** — "X of Y" builds trust  
✅ **Backend owns filtering** — consistent ordering and performance  
✅ **Aligns with real patent analytics tools** — e.g., Google Patents, Lens.org

## Performance Considerations

- Graph limited to depth = 1 (no recursion)
- Maximum 10 nodes per direction for visual clarity
- Lazy rendering with motion animations
- No blocking of page render
- Memoized graph data conversion

## Maintenance Notes

- Graph data comes from backend API (`/api/patents/{publicationNumber}`)
- No frontend API calls from graph component
- All data passed via props from parent (PatentDetailPage)
- Component is reusable and self-contained
- Proper TypeScript typing for all data structures

## Future Enhancements (Optional)

- Click on citation nodes to navigate to that patent
- Filter citations by type or country
- Export graph as image
- Expand to depth > 1 with toggle
- Search within citation network
