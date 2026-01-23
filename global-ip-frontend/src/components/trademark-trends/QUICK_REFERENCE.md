# Trademark Trend Analysis - Quick Reference Guide

## Option B: Custom Panels Only

```tsx
import { useTrademarkTrendAnalysis } from "@/hooks/useTrademarkTrendAnalysis";
import { ExecutiveInsightPanel } from "@/components/trademark-trends";
import { BusinessImplicationsPanel } from "@/components/trademark-trends";

function CustomDashboard() {
  const { analysisReport, loading, error } = useTrademarkTrendAnalysis();

  return (
    <div className="space-y-6">
      <ExecutiveInsightPanel
        insights={analysisReport?.executiveSummary || []}
        loading={loading}
        error={error}
      />
      <BusinessImplicationsPanel
        implications={analysisReport?.businessImplications || []}
        loading={loading}
        error={error}
      />
    </div>
  );
}
```

## Using Individual Hooks

```typescript
import {
  useTrademarkSummary,
  useTrademarkClasses,
  useTrademarkCountries,
  useTrademarkStatus,
} from "@/hooks/useTrademarkTrendAnalysis";

// Full analysis
const { aggregatedData, analysisReport, loading, error, refetch } =
  useTrademarkTrendAnalysis();

// Summary only
const { data: summary } = useTrademarkSummary();

// Classes only
const { data: classes } = useTrademarkClasses();

// Countries only
const { data: countries } = useTrademarkCountries();

// Status only
const { data: status } = useTrademarkStatus();
```

## 3. WITH FILTERS

```typescript
import { TrademarkTrendFilterOptions } from "@/types/trademark-trends";

const filters: TrademarkTrendFilterOptions = {
  startYear: 2020,
  endYear: 2025,
  countries: ["US", "EU"],
  status: ["LIVE"],
};

const { analysisReport } = useTrademarkTrendAnalysis(filters);
```

## 4. ACCESSING ANALYSIS RESULTS

```typescript
if (analysisReport) {
  // Executive Insights (4 findings)
  analysisReport.executiveSummary.forEach((insight) => {
    console.log(insight.title); // "Strong Filing Growth"
    console.log(insight.content); // Detailed explanation
    console.log(insight.severity); // 'high' | 'medium' | 'low'
  });

  // Trend Interpretation
  console.log(analysisReport.trendInterpretation.growthAnalysis);
  console.log(analysisReport.trendInterpretation.concentrationAnalysis);
  console.log(analysisReport.trendInterpretation.stabilityAnalysis);

  // Business Implications
  analysisReport.businessImplications.forEach((impl) => {
    console.log(impl.category); // "Market Saturation"
    console.log(impl.insight); // Analysis
    console.log(impl.recommendation); // Actionable recommendation
  });

  // Visualization Recommendations
  analysisReport.visualizationRecommendations.forEach((rec) => {
    console.log(rec.type); // 'line' | 'bar' | 'pie' | 'map'
    console.log(rec.title);
    console.log(rec.description);
  });

  // Raw Data
  const summary = analysisReport.rawData.summary;
  const topClasses = analysisReport.rawData.topClasses;
  const topCountries = analysisReport.rawData.topCountries;
  const statusDist = analysisReport.rawData.statusDistribution;
}
```

## 5. API SERVICE DIRECT USAGE

```typescript
import trademarkTrendAPI from "@/services/trademarkTrendAPI";

// Fetch individual datasets
const summaryData = await trademarkTrendAPI.getSummary();
const classesData = await trademarkTrendAPI.getTopClasses();
const countriesData = await trademarkTrendAPI.getTopCountries();
const statusData = await trademarkTrendAPI.getStatusDistribution();

// Fetch all in parallel
const allData = await trademarkTrendAPI.getAllTrendData();

// Clear cache
trademarkTrendAPI.clearCache();
```

## 6. INTELLIGENCE ANALYSIS DIRECT USAGE

```typescript
import { TrademarkTrendAnalyzer } from "@/utils/trademarkTrendAnalyzer";
import { AggregatedTrademarkTrendData } from "@/types/trademark-trends";

const analyzer = new TrademarkTrendAnalyzer(
  data as AggregatedTrademarkTrendData
);

// Generate individual components
const insights = analyzer.generateExecutiveSummary(); // 4 insights
const trends = analyzer.generateTrendInterpretation();
const implications = analyzer.generateBusinessImplications();
const visualizations = analyzer.generateVisualizationRecommendations();

// Or get full report
const fullReport = analyzer.generateFullReport();
```

## 7. COMPONENT CUSTOMIZATION

```tsx
// Custom dashboard with configuration
<TrademarkTrendAnalysisDashboard
  title="My Custom Title"
  showRawData={false} // Hide data tables
  autoRefreshInterval={5 * 60 * 1000} // Auto-refresh every 5 min
/>

// Individual panels with custom props
<ExecutiveInsightPanel
  insights={customInsights}
  loading={isLoading}
  error={errorIfAny}
/>
```

## 8. ERROR HANDLING

```tsx
const { analysisReport, error, refetch } = useTrademarkTrendAnalysis();

if (error) {
  console.error("Analysis failed:", error.message);
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded">
      <p>Error: {error.message}</p>
      <button
        onClick={refetch}
        className="mt-2 px-4 py-2 bg-red-600 text-white rounded"
      >
        Retry
      </button>
    </div>
  );
}
```

## 9. EXPORT FUNCTIONALITY

```typescript
// Manual export from dashboard
const handleExport = () => {
  const report = analysisReport;
  const json = JSON.stringify(report, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `trademark-analysis-${
    new Date().toISOString().split("T")[0]
  }.json`;
  a.click();
};
```

## 10. TYPE DEFINITIONS

```typescript
import {
  TrademarkSummaryMetrics,
  CodeDistributionDto,
  SimpleCountDto,
  ExecutiveInsight,
  TrendInterpretation,
  BusinessImplication,
  VisualizationRecommendation,
  TrademarkTrendAnalysisReport,
  AggregatedTrademarkTrendData,
} from "@/types/trademark-trends";
```

## 11. INSIGHT INTERPRETATION REFERENCE

### Filing Growth Thresholds

- `>10% growth` = **HIGH** severity: "Strong Filing Growth"
- `<-10% decline` = **HIGH** severity: "Filing Activity Decline"
- `-10% to +10%` = **MEDIUM** severity: "Stable Filing Activity"

### Class Concentration Thresholds

- `>25%` = **HIGH**: "High Class Concentration"
- `>15%` = **MEDIUM**: "Moderate Class Concentration"
- `≤15%` = **LOW**: "Diversified Class Portfolio"

### Geographic Concentration Thresholds

- `>40%` = **HIGH**: "Strong Geographic Concentration"
- `>25%` = **MEDIUM**: "Moderate Geographic Focus"
- `≤25%` = **LOW**: "Geographically Distributed"

### Brand Lifecycle Thresholds

- `Dead ratio >30%` = **HIGH**: "Brand Longevity Concern"
- `Dead ratio >15%` = **MEDIUM**: "Moderate Brand Churn"
- `Dead ratio ≤15%` = **LOW**: "Strong Brand Longevity"

## 12. STYLING & CUSTOMIZATION

The components use Tailwind CSS classes. You can customize via:

1. **CSS overrides** - wrap components in a styled div
2. **Tailwind config extensions** - add to your `tailwind.config.js`
3. **Component composition** - build custom layout with individual panels

## 13. PERFORMANCE TIPS

1. Use specific hooks if you only need certain data

   - ✅ `useTrademarkClasses()` instead of full analysis if only need classes

2. Leverage caching (10-min default)

   - ✅ Multiple instances will use same cache

3. Configure auto-refresh wisely

   - ✅ Set reasonable intervals to avoid excessive API calls

4. Memoize custom components
   ```typescript
   import { memo } from 'react';
   export const MyComponent = memo(function MyComponent(props) { ... });
   ```

## 14. DEBUGGING CHECKLIST

- ✓ Check console for 🔄, 📊, 🧠, ✅, ❌ logs
- ✓ Verify API endpoints are live
- ✓ Check JWT token in localStorage
- ✓ Test network requests in DevTools
- ✓ Check component props in React DevTools
- ✓ Verify data structure matches expected types
- ✓ Check for 404 or 403 errors
- ✓ Verify CORS headers if cross-origin

## 15. FILE LOCATIONS REFERENCE

**Types**

- → `src/types/trademark-trends.ts`

**API Service**

- → `src/services/trademarkTrendAPI.ts`

**Intelligence Engine**

- → `src/utils/trademarkTrendAnalyzer.ts`

**Hooks**

- → `src/hooks/useTrademarkTrendAnalysis.ts`

**Components**

- → `src/components/trademark-trends/`
  - `TrademarkTrendAnalysisDashboard.tsx`
  - `ExecutiveInsightPanel.tsx`
  - `TrendInterpretationPanel.tsx`
  - `BusinessImplicationsPanel.tsx`
  - `VisualizationRecommendationsPanel.tsx`
  - `DataTable.tsx`

**Documentation**

- → `src/components/trademark-trends/README.md`
- → `src/components/trademark-trends/INTEGRATION_GUIDE.md`

## FREQUENTLY USED IMPORTS

```typescript
// Full dashboard
import { TrademarkTrendAnalysisDashboard } from "@/components/trademark-trends";

// Individual panels
import {
  ExecutiveInsightPanel,
  TrendInterpretationPanel,
  BusinessImplicationsPanel,
  VisualizationRecommendationsPanel,
  TopClassesTable,
  TopCountriesTable,
  StatusDistributionTable,
} from "@/components/trademark-trends";

// Hooks
import {
  useTrademarkTrendAnalysis,
  useTrademarkSummary,
  useTrademarkClasses,
  useTrademarkCountries,
  useTrademarkStatus,
} from "@/hooks/useTrademarkTrendAnalysis";

// API Service
import trademarkTrendAPI from "@/services/trademarkTrendAPI";

// Analyzer
import {
  TrademarkTrendAnalyzer,
  analyzeTrademarkTrends,
} from "@/utils/trademarkTrendAnalyzer";

// Types
import {
  TrademarkTrendAnalysisReport,
  AggregatedTrademarkTrendData,
  TrademarkTrendFilterOptions,
  ExecutiveInsight,
  BusinessImplication,
  VisualizationRecommendation,
} from "@/types/trademark-trends";
```
