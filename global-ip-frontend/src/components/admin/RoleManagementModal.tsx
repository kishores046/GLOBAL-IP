/**
 * Role Management Modal Component
 * Allows admins to manage user roles
 */

import { useState } from 'react';
import { X, Shield, User, UserCog, Loader2 } from 'lucide-react';
import { useUpdateUserRoles } from '../../hooks/useUsers';
import { toast } from 'sonner';

interface RoleManagementModalProps {
  userId: string;
  username: string;
  currentRoles: string[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface RoleOption {
  value: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const availableRoles: RoleOption[] = [
  {
    value: 'USER',
    label: 'User',
    description: 'Basic user access - can search and view patents',
    icon: <User className="w-5 h-5" />,
    color: 'blue',
  },
  {
    value: 'ANALYST',
    label: 'Analyst',
    description: 'Advanced features - competitor tracking, trend analysis',
    icon: <UserCog className="w-5 h-5" />,
    color: 'green',
  },
  {
    value: 'ADMIN',
    label: 'Admin',
    description: 'Full administrative access to all features',
    icon: <Shield className="w-5 h-5" />,
    color: 'purple',
  },
];

export const RoleManagementModal: React.FC<RoleManagementModalProps> = ({
  userId,
  username,
  currentRoles,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [selectedRoles, setSelectedRoles] = useState<string[]>(currentRoles);
  const updateRolesMutation = useUpdateUserRoles();

  const toggleRole = (role: string) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter(r => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const handleSave = async () => {
    if (selectedRoles.length === 0) {
      toast.error('User must have at least one role');
      return;
    }

    try {
      await updateRolesMutation.mutateAsync({ userId, roles: selectedRoles });
      toast.success('Roles updated successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Failed to update roles');
      console.error('Error updating roles:', error);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const getRoleColor = (color: string) => {
    const colors = {
      blue: 'border-blue-200 hover:bg-blue-50',
      green: 'border-green-200 hover:bg-green-50',
      purple: 'border-purple-200 hover:bg-purple-50',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getIconColor = (color: string) => {
    const colors = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      purple: 'text-purple-600',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-blue-900">Manage User Roles</h2>
            <p className="text-slate-600 mt-1">Updating roles for <span className="font-semibold">{username}</span></p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-all"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Role Selection */}
        <div className="space-y-3 mb-6">
          {availableRoles.map(role => {
            const isSelected = selectedRoles.includes(role.value);
            return (
              <label 
                key={role.value}
                className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50' 
                    : getRoleColor(role.color)
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleRole(role.value)}
                  className="w-5 h-5 mt-0.5 text-blue-600 rounded focus:ring-2 focus:ring-blue-400"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={getIconColor(role.color)}>
                      {role.icon}
                    </span>
                    <p className="font-semibold text-slate-900">{role.label}</p>
                  </div>
                  <p className="text-sm text-slate-600">{role.description}</p>
                </div>
              </label>
            );
          })}
        </div>

        {/* Warning Message */}
        {selectedRoles.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
            <p className="text-sm text-yellow-800">
              ⚠️ User must have at least one role assigned
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={updateRolesMutation.isPending}
            className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={updateRolesMutation.isPending || selectedRoles.length === 0}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {updateRolesMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
