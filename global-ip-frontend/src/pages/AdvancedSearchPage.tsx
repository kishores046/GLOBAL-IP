import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { Sidebar } from "../components/dashboard/Sidebar";
import { Search, Filter, X } from "lucide-react";

export function AdvancedSearchPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
      <DashboardHeader userName="Analyst" />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="mb-8">
              <h1 className="text-4xl text-blue-900 mb-2">Advanced Search</h1>
              <p className="text-slate-600">Powerful search tools for comprehensive IP analysis</p>
            </div>

            {/* Search Panel */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-blue-200 shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Search className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl text-blue-900">Search Parameters</h2>
              </div>

              <div className="space-y-6">
                {/* Boolean Search */}
                <div>
                  <label className="block text-slate-700 mb-2">Boolean Search Query</label>
                  <textarea
                    rows={3}
                    placeholder='Example: ("artificial intelligence" OR "machine learning") AND (patent OR application)'
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-700 mb-2">Jurisdiction</label>
                    <select className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                      <option>All Jurisdictions</option>
                      <option>United States (USPTO)</option>
                      <option>European Union (EPO)</option>
                      <option>Japan (JPO)</option>
                      <option>China (CNIPA)</option>
                      <option>WIPO (PCT)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-2">Status</label>
                    <select className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                      <option>All Status</option>
                      <option>Granted</option>
                      <option>Pending</option>
                      <option>Abandoned</option>
                      <option>Expired</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-2">Document Type</label>
                    <select className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                      <option>All Types</option>
                      <option>Utility Patent</option>
                      <option>Design Patent</option>
                      <option>Trademark</option>
                      <option>PCT Application</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 mb-2">Assignee/Applicant</label>
                    <input
                      type="text"
                      placeholder="Company or individual name..."
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-2">Inventor</label>
                    <input
                      type="text"
                      placeholder="Inventor name..."
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 mb-2">Filing Date From</label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-2">Filing Date To</label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 mb-2">Technology Classification (IPC/CPC)</label>
                  <input
                    type="text"
                    placeholder="e.g., G06F, H04L, A61K..."
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                <div className="flex gap-3">
                  <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    Search
                  </button>
                  <button className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-all">
                    Clear All
                  </button>
                  <button className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all">
                    Save Query
                  </button>
                </div>
              </div>
            </div>

            {/* Search Results */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-blue-200 shadow-lg p-6">
              <h2 className="text-2xl text-blue-900 mb-6">Search Results (1,247 found)</h2>
              
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className="border border-slate-200 rounded-lg p-4 hover:bg-blue-50 transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg text-blue-900">US11{item}234567 B2</h3>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Granted</span>
                    </div>
                    <p className="text-slate-700 mb-2">Method and system for artificial intelligence-based data processing</p>
                    <div className="flex gap-4 text-sm text-slate-600">
                      <span>Assignee: Tech Corp Inc.</span>
                      <span>Filed: 2021-03-15</span>
                      <span>IPC: G06F</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-center gap-2">
                <button className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg">Previous</button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">1</button>
                <button className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg">2</button>
                <button className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg">3</button>
                <button className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg">Next</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
