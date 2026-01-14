import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sidebar } from '../components/dashboard/Sidebar';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { PatentLifecyclePanel } from '../trends/patent-lifecycle/PatentLifecyclePanel';
import { Search, AlertCircle } from 'lucide-react';

export function PatentLifecyclePage() {
  const [searchParams] = useSearchParams();
  const [patentId, setPatentId] = useState<string>('');
  const [searchedPatentId, setSearchedPatentId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Check for publicationNumber in query params (from tracking modal)
  useEffect(() => {
    const publicationNumber = searchParams.get('publicationNumber');
    if (publicationNumber) {
      setPatentId(publicationNumber);
      setSearchedPatentId(publicationNumber);
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patentId.trim()) {
      setError('Please enter a patent publication number');
      return;
    }
    setError(null);
    setSearchedPatentId(patentId.trim());
  };

  const handleReset = () => {
    setPatentId('');
    setSearchedPatentId('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
      <DashboardHeader userName="Analyst" />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-blue-900 mb-2">Patent Lifecycle</h1>
              <p className="text-slate-600">
                Track the journey of a patent from filing to expiration
              </p>
            </div>

            {/* Search Section */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Patent Publication Number
                    </label>
                    <input
                      type="text"
                      value={patentId}
                      onChange={(e) => setPatentId(e.target.value)}
                      placeholder="e.g., US10123456B2"
                      className="w-full px-6 py-3 text-lg border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                    {error && (
                      <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                      </div>
                    )}
                  </div>
                  <div className="flex items-end gap-1">
                   <button
  type="submit"
  className="
    flex items-center gap-2
    px-5 py-3
    bg-blue-600 text-white
    rounded-lg
    hover:bg-blue-700
    transition-colors
    font-semibold
    text-sm
    shadow-sm
  "
>
  <Search className="w-4 h-4" />
  Search
</button>

                    {searchedPatentId && (
                      <button
                        type="button"
                        onClick={handleReset}
                        className="px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 transition-colors text-xs"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>

            {/* Lifecycle Panel */}
            {searchedPatentId && (
              <PatentLifecyclePanel publicationNumber={searchedPatentId} />
            )}

            {!searchedPatentId && (
              <div className="bg-white rounded-xl p-12 shadow-md border border-slate-200 text-center">
                <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-700 mb-2">
                  Search for a Patent
                </h3>
                <p className="text-slate-600">
                  Enter a patent publication number to view its complete lifecycle
                </p>
              </div>
            )}

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-2">About Patent Lifecycle</h3>
              <ul className="text-blue-800 space-y-2 text-sm">
                <li>• <strong>Filing:</strong> When the patent application is submitted</li>
                <li>• <strong>Grant:</strong> When the patent is officially granted</li>
                <li>• <strong>Expiration:</strong> When the patent protection ends</li>
                <li>• <strong>Status:</strong> Current state of the patent (Pending, Granted, Expired, etc.)</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
