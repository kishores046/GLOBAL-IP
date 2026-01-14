import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/dashboard/Sidebar';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { useCompetitors } from '../hooks/useCompetitors';
import { competitorAPI, Competitor, CompetitorCreateRequest, CompetitorUpdateRequest } from '../services/competitorAPI';
import { Building2, Plus, Edit, Trash2, Search, X, Save } from 'lucide-react';

export function CompetitorManagementPage() {
  const navigate = useNavigate();
  const { competitors, isLoading, refetch } = useCompetitors(false); // Get all competitors including inactive
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCompetitor, setEditingCompetitor] = useState<Competitor | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create form state
  const [createForm, setCreateForm] = useState<CompetitorCreateRequest>({
    code: '',
    displayName: '',
    assigneeNames: [],
    description: '',
    industry: '',
  });

  // Edit form state
  const [editForm, setEditForm] = useState<CompetitorUpdateRequest>({
    displayName: '',
    assigneeNames: [],
    active: true,
    description: '',
    industry: '',
  });

  const [assigneeInput, setAssigneeInput] = useState('');

  const filteredCompetitors = competitors.filter(comp =>
    comp.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comp.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comp.industry?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateCompetitor = async () => {
    try {
      setIsSubmitting(true);
      await competitorAPI.createCompetitor(createForm);
      setShowCreateModal(false);
      setCreateForm({
        code: '',
        displayName: '',
        assigneeNames: [],
        description: '',
        industry: '',
      });
      refetch();
    } catch (error) {
      console.error('Error creating competitor:', error);
      alert('Failed to create competitor');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCompetitor = async () => {
    if (!editingCompetitor) return;
    
    try {
      setIsSubmitting(true);
      await competitorAPI.updateCompetitor(editingCompetitor.id, editForm);
      setEditingCompetitor(null);
      refetch();
    } catch (error) {
      console.error('Error updating competitor:', error);
      alert('Failed to update competitor');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCompetitor = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    
    try {
      setIsSubmitting(true);
      await competitorAPI.deleteCompetitor(id);
      await refetch();
    } catch (error) {
      console.error('Error deleting competitor:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete competitor';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (competitor: Competitor) => {
    setEditingCompetitor(competitor);
    setEditForm({
      displayName: competitor.displayName,
      assigneeNames: competitor.assigneeNames,
      active: competitor.active,
      description: competitor.description || '',
      industry: competitor.industry || '',
    });
  };

  const addAssignee = (formType: 'create' | 'edit') => {
    if (!assigneeInput.trim()) return;
    
    if (formType === 'create') {
      setCreateForm(prev => ({
        ...prev,
        assigneeNames: [...prev.assigneeNames, assigneeInput.trim()]
      }));
    } else {
      setEditForm(prev => ({
        ...prev,
        assigneeNames: [...(prev.assigneeNames || []), assigneeInput.trim()]
      }));
    }
    setAssigneeInput('');
  };

  const removeAssignee = (index: number, formType: 'create' | 'edit') => {
    if (formType === 'create') {
      setCreateForm(prev => ({
        ...prev,
        assigneeNames: prev.assigneeNames.filter((_, i) => i !== index)
      }));
    } else {
      setEditForm(prev => ({
        ...prev,
        assigneeNames: (prev.assigneeNames || []).filter((_, i) => i !== index)
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
      <DashboardHeader userName="Admin" />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Building2 className="w-8 h-8 text-blue-600" />
                  <h1 className="text-4xl font-bold text-blue-900">Competitor Management</h1>
                </div>
                <p className="text-slate-600">Manage tracked competitors and their assignee names</p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md"
              >
                <Plus className="w-5 h-5" />
                Add Competitor
              </button>
            </div>

            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search competitors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Competitors List */}
            <div className="bg-white rounded-xl shadow-md border border-slate-200">
              {isLoading ? (
                <div className="p-12 text-center">
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-slate-600">Loading competitors...</p>
                </div>
              ) : filteredCompetitors.length === 0 ? (
                <div className="p-12 text-center">
                  <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600">No competitors found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-slate-200 bg-slate-50">
                        <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Code</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Name</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Industry</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Assignees</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Status</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">Total Filings</th>
                        <th className="text-right py-4 px-6 text-sm font-semibold text-slate-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCompetitors.map((competitor) => (
                        <tr key={competitor.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-4 px-6 text-sm font-mono text-blue-600 font-medium">
                            {competitor.code}
                          </td>
                          <td className="py-4 px-6 text-sm text-slate-900 font-medium">
                            {competitor.displayName}
                          </td>
                          <td className="py-4 px-6 text-sm text-slate-600">
                            {competitor.industry || 'N/A'}
                          </td>
                          <td className="py-4 px-6 text-sm text-slate-600">
                            <div className="flex flex-wrap gap-1">
                              {competitor.assigneeNames.slice(0, 2).map((assignee, idx) => (
                                <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                                  {assignee}
                                </span>
                              ))}
                              {competitor.assigneeNames.length > 2 && (
                                <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                                  +{competitor.assigneeNames.length - 2} more
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-6 text-sm">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              competitor.active 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {competitor.active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-sm text-slate-600">
                            {competitor.totalFilings?.toLocaleString() || '0'}
                          </td>
                          <td className="py-4 px-6 text-sm text-right">
                            <button
                              onClick={() => openEditModal(competitor)}
                              disabled={isSubmitting}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors mr-2 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCompetitor(competitor.id, competitor.displayName)}
                              disabled={isSubmitting}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col">
            {/* Fixed Header */}
            <div className="p-6 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
              <h2 className="text-2xl font-bold text-slate-900">Add New Competitor</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Scrollable Content */}
            <div className="p-6 space-y-4 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 180px)' }}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={createForm.code}
                  onChange={(e) => setCreateForm({ ...createForm, code: e.target.value.toUpperCase() })}
                  placeholder="e.g., APPLE, SAMSUNG"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Display Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={createForm.displayName}
                  onChange={(e) => setCreateForm({ ...createForm, displayName: e.target.value })}
                  placeholder="e.g., Apple Inc."
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Assignee Names <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={assigneeInput}
                    onChange={(e) => setAssigneeInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAssignee('create'))}
                    placeholder="Add assignee name"
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={() => addAssignee('create')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {createForm.assigneeNames.map((assignee, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg flex items-center gap-2">
                      {assignee}
                      <button
                        onClick={() => removeAssignee(idx, 'create')}
                        className="hover:text-blue-900"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Industry</label>
                <input
                  type="text"
                  value={createForm.industry}
                  onChange={(e) => setCreateForm({ ...createForm, industry: e.target.value })}
                  placeholder="e.g., Technology, Pharmaceuticals"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  rows={3}
                  placeholder="Brief description of the competitor"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Fixed Footer */}
            <div className="p-6 border-t border-slate-200 flex gap-3 justify-end bg-white rounded-b-xl flex-shrink-0">
              <button
                onClick={() => setShowCreateModal(false)}
                disabled={isSubmitting}
                className="px-6 py-2.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCompetitor}
                disabled={isSubmitting || !createForm.code || !createForm.displayName || createForm.assigneeNames.length === 0}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-lg"
              >
                <Save className="w-5 h-5" />
                {isSubmitting ? 'Creating...' : 'Create Competitor'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingCompetitor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col">
            {/* Fixed Header */}
            <div className="p-6 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
              <h2 className="text-2xl font-bold text-slate-900">Edit Competitor</h2>
              <button
                onClick={() => setEditingCompetitor(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Scrollable Content */}
            <div className="p-6 space-y-4 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 180px)' }}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Code (Read-only)
                </label>
                <input
                  type="text"
                  value={editingCompetitor.code}
                  disabled
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Display Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editForm.displayName}
                  onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Assignee Names <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={assigneeInput}
                    onChange={(e) => setAssigneeInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAssignee('edit'))}
                    placeholder="Add assignee name"
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={() => addAssignee('edit')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(editForm.assigneeNames || []).map((assignee, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg flex items-center gap-2">
                      {assignee}
                      <button
                        onClick={() => removeAssignee(idx, 'edit')}
                        className="hover:text-blue-900"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Industry</label>
                <input
                  type="text"
                  value={editForm.industry}
                  onChange={(e) => setEditForm({ ...editForm, industry: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.active}
                    onChange={(e) => setEditForm({ ...editForm, active: e.target.checked })}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-slate-700">Active</span>
                </label>
              </div>
            </div>

            {/* Fixed Footer */}
            <div className="p-6 border-t border-slate-200 flex gap-3 justify-end bg-white rounded-b-xl flex-shrink-0">
              <button
                onClick={() => setEditingCompetitor(null)}
                disabled={isSubmitting}
                className="px-6 py-2.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateCompetitor}
                disabled={isSubmitting || !editForm.displayName || (editForm.assigneeNames || []).length === 0}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-lg"
              >
                <Save className="w-5 h-5" />
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
