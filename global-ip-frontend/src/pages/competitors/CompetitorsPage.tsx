/**
 * Competitors Dashboard Page
 * Displays list of competitors with management options
 */

import { useState } from 'react';
import { Plus, Search, Building2, Trash2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useCompetitors } from '../../features/competitors/hooks';
import { competitorApi } from '../../features/competitors/api/competitorApi';
import CompetitorFormModal from '../../features/competitors/components/CompetitorFormModal';
import type { CompetitorCreateRequest } from '../../features/competitors/types';

export function CompetitorsPage() {
  const [activeOnly, setActiveOnly] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  
  const { data: competitors = [], isLoading, error } = useCompetitors(activeOnly);

  const handleCreateCompetitor = async (competitorData: CompetitorCreateRequest) => {
    try {
      setIsSubmitting(true);
      await competitorApi.create(competitorData);
      
      // Invalidate the competitors query to refetch the list
      await queryClient.invalidateQueries({ queryKey: ['competitors'] });
      
      // Close modal
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to create competitor:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Ensure competitors is always an array
  const competitorsArray = Array.isArray(competitors) ? competitors : [];

  const filteredCompetitors = competitorsArray.filter((competitor) =>
    competitor.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    competitor.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="text-center py-16">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          <p className="mt-4 text-slate-600">Loading competitors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800 font-semibold">Error loading competitors</p>
          <p className="text-red-600 text-sm mt-2">{error instanceof Error ? error.message : 'Unknown error'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200">
        <div className="p-8 max-w-7xl mx-auto">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                Competitor Management
              </h1>
              <p className="text-slate-600 mt-2">Track, analyze and manage your competitive landscape</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all flex items-center gap-2 font-semibold shadow-sm hover:shadow-md"
            >
              <Plus className="w-5 h-5" /> Add Competitor
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 max-w-7xl mx-auto">
        {/* Search & Filter Bar */}
        <div className="mb-8">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <button
              onClick={() => setActiveOnly(!activeOnly)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeOnly
                  ? 'bg-blue-600 text-white shadow-sm hover:shadow-md'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {activeOnly ? 'Active' : 'All'}
            </button>
          </div>
        </div>

        {/* Competitors Grid */}
        {filteredCompetitors.length === 0 ? (
          <div className="bg-white rounded-xl border-2 border-dashed border-slate-200 p-12 text-center">
            <div className="inline-block p-4 bg-slate-100 rounded-lg mb-4">
              <Building2 className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No competitors found</h3>
            <p className="text-slate-600 mt-2">
              {searchQuery ? 'Try adjusting your search criteria' : 'Get started by adding your first competitor'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
              >
                Add First Competitor
              </button>
            )}
          </div>
        ) : (
          <div>
            <div className="grid gap-4">
              {filteredCompetitors.map((competitor) => (
                <div
                  key={competitor.id}
                  className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md hover:border-slate-300 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg group-hover:from-blue-100 group-hover:to-blue-200 transition-all">
                          <Building2 className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">{competitor.displayName}</h3>
                          <p className="text-sm text-slate-500">
                            Code: <span className="font-mono font-semibold text-slate-700">{competitor.code}</span>
                          </p>
                        </div>
                      </div>
                      {competitor.description && (
                        <p className="text-sm text-slate-600 mt-3 pl-11">{competitor.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      {competitor.industry && (
                        <div className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full">
                          <p className="text-sm font-semibold text-blue-700">{competitor.industry}</p>
                        </div>
                      )}
                      <button
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        title="Delete competitor"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Stats */}
            <div className="mt-8 pt-6 border-t border-slate-200 flex justify-between items-center">
              <p className="text-sm text-slate-600">
                Showing <span className="font-semibold text-slate-900">{filteredCompetitors.length}</span> of{' '}
                <span className="font-semibold text-slate-900">{competitorsArray.length}</span> competitor
                {competitorsArray.length !== 1 ? 's' : ''}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Clear search
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Competitor Form Modal */}
      <CompetitorFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateCompetitor}
        loading={isSubmitting}
      />
    </div>
  );
}

export default CompetitorsPage;
