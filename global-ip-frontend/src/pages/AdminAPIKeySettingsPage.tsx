import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { AdminSidebar } from "../components/dashboard/AdminSidebar";
import { Eye, EyeOff, Settings, Edit2 } from "lucide-react";
import { useState } from "react";

export function AdminAPIKeySettingsPage() {
  const [showAPIKeys, setShowAPIKeys] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
      <DashboardHeader userName="Admin" />
      
      <div className="flex">
        <AdminSidebar />
        
        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-4xl text-blue-900 mb-2">API Key Configuration</h1>
              <p className="text-slate-600">Configure and manage API credentials for all integrated services</p>
            </div>

            {/* API Keys Form */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-blue-200/50 hover:border-blue-300/50 transition-all shadow-xl">
              <div className="space-y-6">
                {/* WIPO */}
                <div className="p-6 bg-blue-50/50 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl text-slate-900 mb-1">WIPO API</h3>
                      <p className="text-sm text-slate-600">World Intellectual Property Organization</p>
                    </div>
                    <button className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-all">
                      <Edit2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="wipo-api-key" className="text-slate-700 mb-2 block text-sm">API Key</label>
                      <div className="relative">
                        <input
                          id="wipo-api-key"
                          type={showAPIKeys ? "text" : "password"}
                          defaultValue="wipo_live_key_a8f4d2e9c1b7f6e3d8a5c2b9f7e4d1a8"
                          className="w-full px-4 py-3 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900 pr-10"
                        />
                        <button
                          onClick={() => setShowAPIKeys(!showAPIKeys)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-blue-600 transition-colors"
                        >
                          {showAPIKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="wipo-endpoint-url" className="text-slate-700 mb-2 block text-sm">Endpoint URL</label>
                      <input
                        id="wipo-endpoint-url"
                        type="text"
                        defaultValue="https://api.wipo.int/v1"
                        className="w-full px-4 py-3 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900"
                      />
                    </div>
                  </div>
                </div>

                {/* USPTO */}
                <div className="p-6 bg-blue-50/50 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl text-slate-900 mb-1">USPTO API</h3>
                      <p className="text-sm text-slate-600">United States Patent and Trademark Office</p>
                    </div>
                    <button className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-all">
                      <Edit2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="uspto-api-key" className="text-slate-700 mb-2 block text-sm">API Key</label>
                      <div className="relative">
                        <input
                          id="uspto-api-key"
                          type={showAPIKeys ? "text" : "password"}
                          defaultValue="uspto_live_key_b9e5c3d1a7f4e2b8c6d9a5f3e1b7c4d2"
                          className="w-full px-4 py-3 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900 pr-10"
                        />
                        <button
                          onClick={() => setShowAPIKeys(!showAPIKeys)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-blue-600 transition-colors"
                        >
                          {showAPIKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="uspto-endpoint-url" className="text-slate-700 mb-2 block text-sm">Endpoint URL</label>
                      <input
                        id="uspto-endpoint-url"
                        type="text"
                        defaultValue="https://api.uspto.gov/v2"
                        className="w-full px-4 py-3 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900"
                      />
                    </div>
                  </div>
                </div>

                {/* EPO */}
                <div className="p-6 bg-blue-50/50 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl text-slate-900 mb-1">EPO API</h3>
                      <p className="text-sm text-slate-600">European Patent Office</p>
                    </div>
                    <button className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-all">
                      <Edit2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="epo-api-key" className="text-slate-700 mb-2 block text-sm">API Key</label>
                      <div className="relative">
                        <input
                          id="epo-api-key"
                          type={showAPIKeys ? "text" : "password"}
                          defaultValue="epo_live_key_c7d4e2a9b6f3c1e8d5a2f9b7c4e1d8a6"
                          className="w-full px-4 py-3 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900 pr-10"
                        />
                        <button
                          onClick={() => setShowAPIKeys(!showAPIKeys)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-blue-600 transition-colors"
                        >
                          {showAPIKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="epo-endpoint-url" className="text-slate-700 mb-2 block text-sm">Endpoint URL</label>
                      <input
                        id="epo-endpoint-url"
                        type="text"
                        defaultValue="https://ops.epo.org/3.2"
                        className="w-full px-4 py-3 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900"
                      />
                    </div>
                  </div>
                </div>

                {/* TMView */}
                <div className="p-6 bg-blue-50/50 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl text-slate-900 mb-1">TMView API</h3>
                      <p className="text-sm text-slate-600">European Trademark Database</p>
                    </div>
                    <button className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-all">
                      <Edit2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="tmview-api-key" className="text-slate-700 mb-2 block text-sm">API Key</label>
                      <div className="relative">
                        <input
                          id="tmview-api-key"
                          type={showAPIKeys ? "text" : "password"}
                          defaultValue="tmview_live_key_d8e5c2a9f7b4d1c8e6a3f9b7d4c1e8a5"
                          className="w-full px-4 py-3 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900 pr-10"
                        />
                        <button
                          onClick={() => setShowAPIKeys(!showAPIKeys)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-blue-600 transition-colors"
                        >
                          {showAPIKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="tmview-endpoint-url" className="text-slate-700 mb-2 block text-sm">Endpoint URL</label>
                      <input
                        id="tmview-endpoint-url"
                        type="text"
                        defaultValue="https://www.tmdn.org/tmview/api"
                        className="w-full px-4 py-3 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900"
                      />
                    </div>
                  </div>
                </div>

                {/* OpenCorporates */}
                <div className="p-6 bg-blue-50/50 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl text-slate-900 mb-1">OpenCorporates API</h3>
                      <p className="text-sm text-slate-600">Corporate Entity Database</p>
                    </div>
                    <button className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-all">
                      <Edit2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="opencorp-api-key" className="text-slate-700 mb-2 block text-sm">API Key</label>
                      <div className="relative">
                        <input
                          id="opencorp-api-key"
                          type={showAPIKeys ? "text" : "password"}
                          defaultValue="opencorp_live_key_e9f6d3b1a8c5e2f9d7b4a1c8f6d3e9b7"
                          className="w-full px-4 py-3 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900 pr-10"
                        />
                        <button
                          onClick={() => setShowAPIKeys(!showAPIKeys)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-blue-600 transition-colors"
                        >
                          {showAPIKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="opencorp-endpoint-url" className="text-slate-700 mb-2 block text-sm">Endpoint URL</label>
                      <input
                        id="opencorp-endpoint-url"
                        type="text"
                        defaultValue="https://api.opencorporates.com/v0.4"
                        className="w-full px-4 py-3 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8">
                <button className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all shadow-lg flex items-center justify-center gap-2">
                  <Settings className="w-5 h-5" />
                  Save All Changes
                </button>
                <button className="px-6 py-3 bg-white border border-blue-200 hover:bg-blue-50 text-blue-600 rounded-lg transition-all">
                  Reset to Default
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
