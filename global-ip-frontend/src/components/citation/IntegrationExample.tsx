/**
 * Example: How to integrate EnhancedCitationGraph into PatentDetailPage
 * 
 * This file demonstrates the integration of the new citation network
 * visualization into your existing patent details page.
 */

import React from 'react';
import { useParams } from 'react-router-dom';
import { EnhancedCitationGraph } from './EnhancedCitationGraph';

// Note: If @/components/ui/tabs is not available, you can replace with your own Tabs component
// or use a third-party library like @headlessui/react or @radix-ui/react-tabs
interface TabsComponent {
  Tabs: React.ComponentType<any>;
  TabsList: React.ComponentType<any>;
  TabsTrigger: React.ComponentType<any>;
  TabsContent: React.ComponentType<any>;
}

let Tabs: React.ComponentType<any>;
let TabsList: React.ComponentType<any>;
let TabsTrigger: React.ComponentType<any>;
let TabsContent: React.ComponentType<any>;

try {
  const tabsModule: TabsComponent = require('@/components/ui/tabs');
  ({ Tabs, TabsList, TabsTrigger, TabsContent } = tabsModule);
} catch {
  // Fallback: Create basic tab components or import from alternative source
  console.warn('Tabs component not found at @/components/ui/tabs');
}

// Example patent data structure (adjust to your actual data)
interface Patent {
  id: string;
  title: string;
  abstract: string;
  assignee: string;
  inventors: string[];
  filingDate: string;
  grantDate: string;
  source: string; // 'PATENTSVIEW', 'EPO', etc.
  // ... other fields
}

export function PatentDetailPageExample() {
  const { patentId } = useParams<{ patentId: string }>();
  
  // Fetch patent data (example - adjust to your API)
  const [patent, setPatent] = React.useState<Patent | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Replace with your actual API call
    fetch(`/api/patents/${patentId}`)
      .then(res => res.json())
      .then(data => setPatent(data))
      .finally(() => setIsLoading(false));
  }, [patentId]);

  if (isLoading) return <div>Loading patent...</div>;
  if (!patent) return <div>Patent not found</div>;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Patent Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {patent.title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="font-mono font-bold text-blue-600">{patent.id}</span>
          <span className="inline-block px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">{patent.source}</span>
          <span>Filed: {patent.filingDate}</span>
          <span>Granted: {patent.grantDate}</span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full lg:w-auto lg:inline-flex">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="claims">Claims</TabsTrigger>
          <TabsTrigger value="citations">
            Citation Network
            <span className="inline-block ml-2 px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">Interactive</span>
          </TabsTrigger>
          <TabsTrigger value="similar">Similar Patents</TabsTrigger>
          <TabsTrigger value="legal">Legal Status</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Abstract</h2>
            <p className="text-gray-700 leading-relaxed">{patent.abstract}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Key Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-semibold text-gray-700">Assignee:</span>
                <span className="ml-2 text-gray-600">{patent.assignee}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Inventors:</span>
                <span className="ml-2 text-gray-600">
                  {patent.inventors.join(', ')}
                </span>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Claims Tab */}
        <TabsContent value="claims">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Patent Claims</h2>
            {/* Your claims content here */}
            <p className="text-gray-600">Claims content...</p>
          </div>
        </TabsContent>

        {/* Citations Tab - NEW ENHANCED VISUALIZATION */}
        <TabsContent value="citations">
          <EnhancedCitationGraph
            patentId={patent.id}
            source={patent.source}
            currentPatentTitle={patent.title}
          />
          
          {/* Optional: Add citation list below graph */}
          <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Citation Details
            </h3>
            <p className="text-sm text-gray-600">
              The interactive graph above shows the citation network for this patent.
              Hover over nodes for details, click to navigate to other patents.
            </p>
          </div>
        </TabsContent>

        {/* Similar Patents Tab */}
        <TabsContent value="similar">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Similar Patents</h2>
            {/* Your similar patents content here */}
            <p className="text-gray-600">Similar patents...</p>
          </div>
        </TabsContent>

        {/* Legal Status Tab */}
        <TabsContent value="legal">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Legal Status</h2>
            {/* Your legal status content here */}
            <p className="text-gray-600">Legal status information...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/**
 * ALTERNATIVE: Standalone Citation Page
 * 
 * If you prefer a dedicated page for citation analysis:
 */
export function CitationAnalysisPageExample() {
  const { patentId } = useParams<{ patentId: string }>();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Citation Network Analysis
        </h1>
        <p className="text-gray-600">
          Interactive visualization of patent {patentId} citation relationships
        </p>
      </div>

      <EnhancedCitationGraph
        patentId={patentId!}
        source="PATENTSVIEW"
      />

      {/* Additional analysis sections */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Citation Timeline
          </h3>
          {/* Timeline visualization */}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Technology Evolution
          </h3>
          {/* Technology trends */}
        </div>
      </div>
    </div>
  );
}

/**
 * INTEGRATION CHECKLIST:
 * 
 * 1. ✅ Import EnhancedCitationGraph from '@/components/citation'
 * 2. ✅ Pass patentId prop
 * 3. ✅ Pass source prop (must be "PATENTSVIEW" for US patents)
 * 4. ✅ Optionally pass currentPatentTitle for better UX
 * 5. ✅ Ensure patent detail page has enough height (600px+ recommended)
 * 6. ✅ Test with patents that have 0 forward citations
 * 7. ✅ Test with mobile responsive layout
 * 8. ✅ Verify navigation works when clicking citation nodes
 * 
 * NOTES:
 * - Component handles all loading, error, and empty states
 * - Automatically shows appropriate messages for non-US patents
 * - Responsive design works on mobile, tablet, and desktop
 * - Metrics panel auto-collapses on mobile
 * - All interactions (zoom, pan, drag) work out of the box
 */
