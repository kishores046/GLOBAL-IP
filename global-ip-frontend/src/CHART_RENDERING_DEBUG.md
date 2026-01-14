# Charts Not Displaying - Troubleshooting Guide

## Problem

When clicking on trend cards, the data appears to load but charts don't render.

## Common Causes & Solutions

### 1. Check Browser Console

**Action**: Open DevTools (F12) → Console tab
**What to look for**:

- `[TrendDashboard] Fetched data for X:` logs showing the API response
- `Transformed data for X:` logs showing transformed data
- Any errors in red

### 2. Verify API Response Format

The backend may be returning a different data structure. Check if the response matches one of these patterns:

**Filing Trends Format:**

```json
{
  "data": [
    { "year": 2020, "filingCount": 100, "grantCount": 80, "grantRate": 80 }
  ],
  "period": { "startYear": 2015, "endYear": 2025 }
}
```

**Technology Trends Format:**

```json
{
  "topTechnologies": [
    { "cpcGroup": "H01M", "cpcDescription": "...", "count": 150 }
  ],
  "evolutionData": [
    { "cpcGroup": "H01M", "cpcDescription": "...", "yearData": [...], "totalCount": 500, "trend": "rising" }
  ]
}
```

**Citation Trends Format:**

```json
{
  "topCited": [{ "patentId": "US123456", "title": "...", "citationCount": 50 }],
  "topCiting": [{ "patentId": "US789012", "title": "...", "citedByCount": 30 }]
}
```

**Patent Quality Format:**

```json
{
  "typeDistribution": [
    { "year": 2020, "filingCount": 100, "grantCount": 80, "grantRate": 80 }
  ],
  "claimComplexity": [...],
  "timeToGrant": [...]
}
```

### 3. Check Network Tab

**Action**: Open DevTools → Network tab → click a trend card
**What to check**:

1. API call is made to `/api/analyst/trend/X?limit=10&startDate=YYYY-MM-DD`
2. Status code is 200 (not 400, 500, etc.)
3. Response body shows the data in the expected format

### 4. Verify Parameters Are Passed

When clicking a trend card, the API should be called with:

- `limit=10` for methods that support it
- `startDate=YYYY-MM-DD` for country trends
- No extra parameters for filing/grant trends

**Example URLs:**

- `/api/analyst/trend/filings` - No params
- `/api/analyst/trend/technologies/top?limit=10` - With limit
- `/api/analyst/trend/countries?startDate=2015-01-01&limit=10` - With startDate + limit

### 5. Add Debugging Output

To see what the transformers are producing, add this to browser console:

```javascript
// Check transformer output
import { getTransformedData } from './utils/trendDataTransformers';
const mockData = { topTechnologies: [...], evolutionData: [...] };
console.log('Transformed:', getTransformedData('top-technologies', mockData));
```

### 6. Test Individual Chart Components

If a specific chart isn't rendering, test it directly:

```tsx
import { FilingTrendChart } from "./components/trends/FilingTrendChart";

// This should show a chart
<FilingTrendChart
  data={[
    { year: 2020, filingCount: 100, grantCount: 80, grantRate: 80 },
    { year: 2021, filingCount: 110, grantCount: 85, grantRate: 77 },
  ]}
/>;
```

## Data Flow Diagram

```
Trend Card Click
    ↓
handleTrendCardClick() in TrendDashboard
    ↓
card.fetchFunction(filters) - calls API method
    ↓
API Method (e.g., getTechnologyTrends)
    ↓
Check cache / Make HTTP request
    ↓
Get response from /api/analyst/trend/X
    ↓
Return response object
    ↓
TrendViewer component receives data
    ↓
getTransformedData(trendId, data) - extract correct array
    ↓
Pass to Chart Component
    ↓
Chart renders visualization
```

## Quick Fix Checklist

- [ ] Backend is running at `http://localhost:8080`
- [ ] JWT token is valid (check localStorage.jwt_token in DevTools)
- [ ] API endpoints return 200 status with data
- [ ] Response structure matches expected format (check Network tab)
- [ ] Limit parameter is being passed (e.g., `?limit=10`)
- [ ] Browser console shows `[TrendDashboard] Fetched data` logs
- [ ] Browser console shows `Transformed data for` logs
- [ ] No red errors in console
- [ ] Chart component is mounted (check React DevTools)

## API Methods That Need Limit Parameter

These methods require passing limit to the API:

- `getTechnologyTrends(filters, 10)` → `/trend/technologies/top?limit=10`
- `getTopAssignees(filters, 10)` → `/trend/assignees/top?limit=10`
- `getCountryTrends(filters, 10)` → `/trend/countries?startDate=YYYY-MM-DD&limit=10`
- `getCitationTrends(filters, 10)` → `/trend/citations/top-cited?limit=10` + `/trend/citations/top-citing?limit=10`

## If Charts Still Don't Show

1. Check React DevTools to see if TrendViewer component is rendered
2. Verify ChartComponent is not null (inspect TrendChartMap)
3. Check if transformedData is an array or object with the right structure
4. Look at Chart component's error handling (should show "No data available" alert if empty)
5. Check if browser has JavaScript errors (DevTools → Console)

## Key Files to Check

- `src/services/trendAnalysisAPI.ts` - API methods and cache
- `src/utils/trendDataTransformers.ts` - Data transformation logic
- `src/components/trends/TrendViewer.tsx` - Routes data to charts
- `src/components/trends/TrendDashboard.tsx` - Orchestrates trend loading
- `src/components/trends/trendCardConfig.ts` - Card definitions and API calls

## Contact Points

If still not working:

1. Share browser console output (screenshot or text)
2. Share Network tab response for a trend API call
3. Verify backend is returning data (test with Postman/curl)
4. Check backend logs for errors
