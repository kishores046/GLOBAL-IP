import { useState } from "react";
import { Search } from "lucide-react";
import { Sidebar } from "../components/dashboard/Sidebar";
import { motion } from "motion/react";

interface SearchResult {
  assetId: string;
  title: string;
  assignee: string;
  jurisdiction: string;
  status: "Application" | "Granted";
  filingDate: string;
}

const mockSearchResults: SearchResult[] = [
  {
    assetId: "WO2023071234",
    title: "Quantum-Resistant Cryptography Method",
    assignee: "Future Tech Inc.",
    jurisdiction: "WIPO",
    status: "Application",
    filingDate: "2023-05-15",
  },
  {
    assetId: "US11234567B2",
    title: "AI-Powered Drug Discovery Platform",
    assignee: "BioInnovate LLC",
    jurisdiction: "USPTO",
    status: "Granted",
    filingDate: "2021-11-20",
  },
  {
    assetId: "EP3456789A1",
    title: "Method for Manufacturing Graphene Supercapacitors",
    assignee: "NanoMaterials AG",
    jurisdiction: "EPO",
    status: "Application",
    filingDate: "2022-08-01",
  },
  {
    assetId: "TM018765432",
    title: "Synergy AI",
    assignee: "Cognitive Solutions Ltd.",
    jurisdiction: "TMView",
    status: "Granted",
    filingDate: "2020-03-10",
  },
  {
    assetId: "US10987654B1",
    title: "Decentralized Identity Verification System",
    assignee: "VeriChain Corp.",
    jurisdiction: "USPTO",
    status: "Granted",
    filingDate: "2019-07-22",
  },
];

export function GlobalIPSearchPage() {
  const [keywords, setKeywords] = useState("");
  const [assignee, setAssignee] = useState("");
  const [jurisdiction, setJurisdiction] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>(mockSearchResults);
  const [hasSearched, setHasSearched] = useState(true);

  const handleSearch = () => {
    setHasSearched(true);
    // In a real application, this would filter the results based on the search criteria
    setSearchResults(mockSearchResults);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 relative overflow-hidden">
      <div className="relative z-10 flex">
        <Sidebar />
        
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-4xl text-blue-900 mb-2">Search</h1>
              <p className="text-slate-600">Search for patents and trademarks across multiple jurisdictions</p>
            </motion.div>

            {/* Advanced Search Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl mb-8"
            >
              <div className="mb-6">
                <h2 className="text-2xl text-slate-900 mb-1">Advanced IP Search</h2>
                <p className="text-slate-600">
                  Search for patents and trademarks across multiple jurisdictions.
                </p>
              </div>

              {/* Search Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-2">
                  <input
                    type="text"
                    placeholder="Keywords..."
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900 placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Assignee / Inventor..."
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900 placeholder:text-slate-400"
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <select
                    value={jurisdiction}
                    onChange={(e) => setJurisdiction(e.target.value)}
                    className="flex-1 px-4 py-3 bg-white border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900"
                  >
                    <option value="">Jurisdiction</option>
                    <option value="USPTO">USPTO</option>
                    <option value="EPO">EPO</option>
                    <option value="WIPO">WIPO</option>
                    <option value="TMView">TMView</option>
                    <option value="JPO">JPO</option>
                    <option value="CNIPA">CNIPA</option>
                  </select>

                  <button
                    onClick={handleSearch}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl flex items-center gap-2 transition-all shadow-lg"
                  >
                    <Search className="w-5 h-5" />
                    Search
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Search Results Section */}
            {hasSearched && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl"
              >
                <div className="mb-6">
                  <h2 className="text-2xl text-slate-900 mb-1">Search Results</h2>
                  <p className="text-slate-600">Found {searchResults.length} results:</p>
                </div>

                {/* Results Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-blue-200">
                        <th className="text-left py-4 px-4 text-slate-700">Asset ID</th>
                        <th className="text-left py-4 px-4 text-slate-700">Title</th>
                        <th className="text-left py-4 px-4 text-slate-700">Assignee</th>
                        <th className="text-left py-4 px-4 text-slate-700">Jurisdiction</th>
                        <th className="text-left py-4 px-4 text-slate-700">Status</th>
                        <th className="text-left py-4 px-4 text-slate-700">Filing Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {searchResults.map((result, index) => (
                        <motion.tr
                          key={result.assetId}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.05 }}
                          className="border-b border-blue-100 hover:bg-blue-50/50 transition-all cursor-pointer"
                        >
                          <td className="py-4 px-4 text-slate-900">{result.assetId}</td>
                          <td className="py-4 px-4 text-slate-900">{result.title}</td>
                          <td className="py-4 px-4 text-slate-700">{result.assignee}</td>
                          <td className="py-4 px-4 text-slate-700">{result.jurisdiction}</td>
                          <td className="py-4 px-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs ${
                                result.status === "Granted"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {result.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-slate-700">{result.filingDate}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}