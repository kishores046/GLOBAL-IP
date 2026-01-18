/**
 * Competitor Form Modal
 * Modal dialog for creating and editing competitors
 */

import { useState } from 'react';
import { X } from 'lucide-react';
import type { CompetitorCreateRequest } from '../../../features/competitors/types';

interface CompetitorFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (competitor: CompetitorCreateRequest) => Promise<void>;
  loading?: boolean;
}

export function CompetitorFormModal({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
}: CompetitorFormModalProps) {
  const [formData, setFormData] = useState<CompetitorCreateRequest>({
    code: '',
    displayName: '',
    assigneeNames: [''],
    description: '',
    industry: '',
    jurisdiction: 'BOTH',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string>('');

  const handleInputChange = (field: keyof CompetitorCreateRequest, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleAssigneeChange = (index: number, value: string) => {
    const newAssignees = [...formData.assigneeNames];
    newAssignees[index] = value;
    setFormData((prev) => ({
      ...prev,
      assigneeNames: newAssignees,
    }));
  };

  const addAssignee = () => {
    setFormData((prev) => ({
      ...prev,
      assigneeNames: [...prev.assigneeNames, ''],
    }));
  };

  const removeAssignee = (index: number) => {
    if (formData.assigneeNames.length > 1) {
      setFormData((prev) => ({
        ...prev,
        assigneeNames: prev.assigneeNames.filter((_, i) => i !== index),
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.code.trim()) {
      newErrors.code = 'Competitor code is required';
    } else if (formData.code.trim().length > 50) {
      newErrors.code = 'Code must be 50 characters or less';
    }

    if (!formData.displayName.trim()) {
      newErrors.displayName = 'Display name is required';
    }

    const validAssignees = formData.assigneeNames.filter((name) => name.trim().length > 0);
    if (validAssignees.length === 0) {
      newErrors.assigneeNames = 'At least one assignee name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
      return;
    }

    try {
      // Filter out empty assignee names
      const cleanedData = {
        ...formData,
        code: formData.code.toUpperCase(),
        assigneeNames: formData.assigneeNames.filter((name) => name.trim().length > 0),
      };

      console.log('Submitting competitor data:', cleanedData);
      
      await onSubmit(cleanedData);
      
      // Reset form on success
      setFormData({
        code: '',
        displayName: '',
        assigneeNames: [''],
        description: '',
        industry: '',
        jurisdiction: 'BOTH',
      });
      setErrors({});
      setSubmitError('');
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create competitor';
      console.error('Error submitting competitor form:', error);
      setSubmitError(errorMessage);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-[500px] mx-auto">
        <div className="bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Add New Competitor</h2>
              <p className="text-sm text-slate-600 mt-1">Enter details about the competitor you want to track</p>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="text-slate-400 hover:text-slate-600 disabled:opacity-50 p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form id="competitor-form" onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[calc(100vh-200px)] overflow-y-auto">
            {/* Submit Error Alert */}
            {submitError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800 font-semibold">Error</p>
                <p className="text-sm text-red-600 mt-1">{submitError}</p>
              </div>
            )}

            {/* Competitor Code */}
            <div>
              <label htmlFor="code" className="text-sm font-semibold text-slate-700 mb-2 block">
                Competitor Code <span className="text-red-600">*</span>
              </label>
              <input
                id="code"
                type="text"
                placeholder="e.g., APPLE, INTEL-2024, Samsung Inc."
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value)}
                disabled={loading}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.code ? 'border-red-500 focus:ring-red-500' : 'border-slate-200'
                }`}
              />
              {errors.code && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <span>✕</span> {errors.code}
                </p>
              )}
              <p className="mt-2 text-xs text-slate-500">
                Up to 50 characters (letters, numbers, spaces, hyphens, etc.)
              </p>
            </div>

            {/* Display Name */}
            <div>
              <label htmlFor="displayName" className="text-sm font-semibold text-slate-700 mb-2 block">
                Display Name <span className="text-red-600">*</span>
              </label>
              <input
                id="displayName"
                type="text"
                placeholder="e.g., Apple Inc."
                value={formData.displayName}
                onChange={(e) => handleInputChange('displayName', e.target.value)}
                disabled={loading}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.displayName ? 'border-red-500 focus:ring-red-500' : 'border-slate-200'
                }`}
              />
              {errors.displayName && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <span>✕</span> {errors.displayName}
                </p>
              )}
            </div>

            {/* Assignee Names */}
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">
                Assignee Names <span className="text-red-600">*</span>
              </label>
              <div className="space-y-2">
                {formData.assigneeNames.map((assignee, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g., Apple Intellectual Property"
                      value={assignee}
                      onChange={(e) => handleAssigneeChange(index, e.target.value)}
                      disabled={loading}
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    {formData.assigneeNames.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAssignee(index)}
                        disabled={loading}
                        className="px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-all disabled:opacity-50 font-medium text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                {errors.assigneeNames && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <span>✕</span> {errors.assigneeNames}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={addAssignee}
                disabled={loading}
                className="mt-3 px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg transition-all disabled:opacity-50 font-medium text-sm"
              >
                + Add Assignee
              </button>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="text-sm font-semibold text-slate-700 mb-2 block">
                Description <span className="text-slate-400">(Optional)</span>
              </label>
              <textarea
                id="description"
                placeholder="Add notes about this competitor..."
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                disabled={loading}
                rows={3}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 resize-none transition-all"
              />
            </div>

            {/* Industry */}
            <div>
              <label htmlFor="industry" className="text-sm font-semibold text-slate-700 mb-2 block">
                Industry <span className="text-slate-400">(Optional)</span>
              </label>
              <input
                id="industry"
                type="text"
                placeholder="e.g., Technology, Semiconductors"
                value={formData.industry || ''}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                disabled={loading}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 transition-all"
              />
            </div>

            {/* Jurisdiction */}
            <div>
              <label htmlFor="jurisdiction" className="text-sm font-semibold text-slate-700 mb-2 block">
                Jurisdiction
              </label>
              <select
                id="jurisdiction"
                value={formData.jurisdiction || 'BOTH'}
                onChange={(e) => handleInputChange('jurisdiction', e.target.value)}
                disabled={loading}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 transition-all"
              >
                <option value="US">🇺🇸 United States Only</option>
                <option value="EP">🇪🇺 Europe Only</option>
                <option value="BOTH">🌍 Both US & Europe</option>
              </select>
            </div>
          </form>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg transition-all disabled:opacity-50 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="competitor-form"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 rounded-lg transition-all disabled:opacity-50 font-semibold flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                'Create Competitor'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CompetitorFormModal;
