# Quick Start Guide - Enhanced Citation Network

## 🚀 Get Started in 5 Minutes

### Step 1: Import the Component

```tsx
import { EnhancedCitationGraph } from "./components/citation";
```

### Step 2: Add to Your Patent Detail Page

```tsx
function PatentDetailPage() {
  const { patentId } = useParams();

  return (
    <div>
      {/* Your existing patent info */}

      {/* Add the citation graph */}
      <EnhancedCitationGraph
        patentId={patentId}
        source="PATENTSVIEW"
        currentPatentTitle="Your Patent Title"
      />
    </div>
  );
}
```

### Step 3: Ensure API Endpoint Exists

The component expects this endpoint:

```
GET /api/patents/{patentId}/citations/network?backwardDepth=1&forwardDepth=1
```

**Response format:**

```json
{
  "nodes": [
    {
      "patentId": "US10006624",
      "title": "Patent title",
      "assignee": "Company Name",
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
    "assigneeDistribution": {},
    "technologyDistribution": {}
  },
  "clusters": {}
}
```

### Step 4: Test It

Visit a patent detail page with ID: `US10006624`

**Expected behavior:**

- ✅ Loading spinner appears
- ✅ Graph renders with nodes and edges
- ✅ Metrics panel shows on the right
- ✅ Hover over nodes shows tooltips
- ✅ Click nodes navigates to that patent

### Step 5: Handle Edge Cases

Test these scenarios:

- Patent with 0 forward citations → Shows warning message
- Invalid patent ID → Shows error with retry button
- Non-US patent → Shows "US only" message

---

## 📦 Files Created

You now have these files:

```
src/
├── components/citation/
│   ├── EnhancedCitationGraph.tsx    ⭐ Main component
│   ├── CustomPatentNode.tsx
│   ├── CitationMetricsPanel.tsx
│   └── index.ts
├── hooks/
│   └── useCitationNetwork.ts
├── types/
│   └── citation.ts
└── utils/
    └── citationLayout.ts
```

---

## 🎨 Customization

### Change Colors

Edit `CustomPatentNode.tsx` and `EnhancedCitationGraph.tsx`:

```tsx
// Root node color
backgroundColor: "#3B82F6"; // Change to your brand color

// Prior art color
backgroundColor: "#94A3B8";

// Forward citations color
backgroundColor: "#10B981";
```

### Change Layout Spacing

Edit `utils/citationLayout.ts`:

```tsx
const {
  centerX = 500, // Center position X
  centerY = 300, // Center position Y
  horizontalSpacing = 400, // Distance between columns
  verticalSpacing = 80, // Distance between nodes
} = options;
```

### Change Graph Size

Edit `EnhancedCitationGraph.tsx`:

```tsx
<div style={{ width: "100%", height: "600px" }}>{/* Change height here */}</div>
```

---

## 🔧 Troubleshooting

### "Cannot find module" error

**Fix:** Update `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### API returns 404

**Fix:** Ensure backend has the new endpoint or use mock data:

```tsx
// Temporarily use mock data for testing
const mockData = {
  nodes: [...],
  edges: [...],
  metrics: {...}
};
```

### Graph not showing

**Check:**

1. ✅ Is patentId valid?
2. ✅ Is source = "PATENTSVIEW"?
3. ✅ Browser console for errors?
4. ✅ Network tab shows API call?

### Nodes overlap

**Fix:** Increase spacing in layout:

```tsx
horizontalSpacing: 500,  // Increase this
verticalSpacing: 100,    // And this
```

---

## 📱 Mobile Testing

Test on mobile:

1. Open DevTools
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select iPhone/Android
4. Check:
   - ✅ Metrics panel collapses
   - ✅ Toggle button appears
   - ✅ Graph scales correctly
   - ✅ Controls are touch-friendly

---

## 🎯 Next Steps

1. ✅ Integrate into your patent detail page
2. ✅ Test with real patent IDs
3. ✅ Customize colors to match your brand
4. ✅ Deploy to staging
5. ✅ Gather user feedback
6. ✅ Plan advanced features

---

## 📚 More Documentation

- **Full docs**: `CITATION_NETWORK_README.md`
- **Migration**: `MIGRATION_GUIDE.md`
- **Examples**: `IntegrationExample.tsx`
- **Summary**: `IMPLEMENTATION_SUMMARY.md`

---

## 💡 Pro Tips

1. **Use TypeScript**: Import types from `types/citation.ts`
2. **Custom Hook**: Use `useCitationNetwork` for custom UIs
3. **Performance**: Component handles memoization automatically
4. **Responsive**: Works on mobile out of the box
5. **Keyboard**: All controls are keyboard accessible

---

## 🆘 Need Help?

Check these resources:

- React Flow docs: https://reactflow.dev/
- TypeScript handbook: https://www.typescriptlang.org/
- Tailwind CSS: https://tailwindcss.com/

---

**Ready to go! 🎉**

Your enhanced citation network visualization is production-ready!
