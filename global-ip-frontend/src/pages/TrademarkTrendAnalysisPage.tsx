/**
 * Trademark Trend Analysis Page
 * Demonstrates lazy-loading integration of the Trademark Intelligence Layer
 * 
 * Route: /trademark-trends
 */

import React from 'react';
import { TrademarkTrendLazyDashboard } from '../components/trademark-trends';

export default function TrademarkTrendAnalysisPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <TrademarkTrendLazyDashboard />
    </div>
  );
}
