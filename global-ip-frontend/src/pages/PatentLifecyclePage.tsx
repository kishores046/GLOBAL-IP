import { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sidebar } from '../components/dashboard/Sidebar';
import { PatentLifecyclePanel } from '../trends/patent-lifecycle/PatentLifecyclePanel';
import { Search, AlertCircle, Loader2, X } from 'lucide-react';
import { AnalystLayoutContext } from '../components/dashboard/AnalystLayout';

export function PatentLifecyclePage() {
  const [searchParams] = useSearchParams();
  const [patentId, setPatentId] = useState('');
  const [searchedPatentId, setSearchedPatentId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    setTimeout(() => {
      setSearchedPatentId(patentId.trim());
      setIsLoading(false);
    }, 500);
  };

  const handleReset = () => {
    setPatentId('');
    setSearchedPatentId('');
    setError(null);
    setIsLoading(false);
  };

  const inAnalystLayout = useContext(AnalystLayoutContext);

  const inner = (
    <div className="max-w-6xl mx-auto space-y-10">
      <div>
        <h1 className="text-4xl font-bold text-blue-900">Patent Lifecycle</h1>
        <p className="text-slate-600 mt-1">Track the journey of a patent from filing to expiration</p>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-200/70">
        <form onSubmit={handleSearch}>
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-end">
            <div className="flex-1 w-full">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Patent Publication Number</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={patentId}
                  onChange={(e) => setPatentId(e.target.value)}
                  placeholder="e.g. US10123456B2"
                  disabled={isLoading}
                  className="w-full h-12 pl-12 pr-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 disabled:opacity-50"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 mt-3 text-red-600 text-sm font-medium">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={!patentId.trim() || isLoading}
                className="h-12 min-w-[160px] px-8 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold shadow-md hover:shadow-lg hover:from-blue-700 hover:to-blue-800 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Searching
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Search
                  </>
                )}
              </button>

              {searchedPatentId && !isLoading && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="h-12 px-6 flex items-center gap-2 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-100 transition-all duration-200"
                >
                  <X className="w-4 h-4" />
                  Clear
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {searchedPatentId ? (
        <PatentLifecyclePanel publicationNumber={searchedPatentId} />
      ) : (
        <div className="bg-white rounded-xl p-12 shadow-md border border-slate-200 text-center">
          <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-700 mb-2">Search for a Patent</h3>
          <p className="text-slate-600">Enter a patent publication number to view its complete lifecycle</p>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-blue-900 mb-2">About Patent Lifecycle</h3>
        <ul className="text-blue-800 text-sm space-y-2">
          <li>• <strong>Filing:</strong> Application submission</li>
          <li>• <strong>Grant:</strong> Patent approval</li>
          <li>• <strong>Expiration:</strong> Protection ends</li>
          <li>• <strong>Status:</strong> Current legal state</li>
        </ul>
      </div>
    </div>
  );

  if (inAnalystLayout) {
    return inner;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">{inner}</main>
      </div>
    </div>
  );
}
