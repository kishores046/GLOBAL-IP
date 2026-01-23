import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import roleRequestService from '../services/roleRequestService';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../routes/routeConfig';

export function RequestAdminPage() {
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Redirect if user already has admin role
  useEffect(() => {
    if (hasRole(ROLES.ADMIN)) {
      toast.info('You already have admin access');
      navigate('/dashboard/admin', { replace: true });
    }
  }, [hasRole, navigate]);

  const handleRequestAdmin = async () => {
    setIsLoading(true);
    try {
      const response = await roleRequestService.requestAdminRole();
      toast.success(response.message || 'Admin role request submitted successfully!');
      setIsSubmitted(true);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to submit request';
      
      if (errorMessage.includes('already pending')) {
        toast.warning('You already have a pending admin request');
        setIsSubmitted(true);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate('/dashboard/user');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8 md:p-12">
          {/* Back Button */}
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
              <Shield className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-blue-900 text-center mb-4">
            Request Admin Access
          </h1>

          {!isSubmitted ? (
            <>
              {/* Description */}
              <div className="mb-8 space-y-4">
                <p className="text-slate-700 text-center">
                  Requesting admin access will grant you elevated permissions to manage the platform.
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Admin Privileges Include:</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>User management and role assignment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>API health monitoring and configuration</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>System settings and data synchronization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Usage logs and analytics access</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-amber-900 mb-1">Important Notice</h3>
                      <p className="text-sm text-slate-700">
                        Your request will be reviewed by an administrator. You will be notified once your request is processed.
                        Admin access will not be granted immediately.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Info */}
              {user && (
                <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-sm text-slate-600 mb-1">Requesting as:</p>
                  <p className="font-semibold text-blue-900">{user.username || user.email}</p>
                  <p className="text-sm text-slate-600 mt-1">
                    Current Role: <span className="font-medium text-slate-900">USER</span>
                  </p>
                </div>
              )}

              {/* Request Button */}
              <button
                onClick={handleRequestAdmin}
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting Request...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    Request Admin Access
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              {/* Success Message */}
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-green-900 mb-2">
                  Request Submitted!
                </h2>
                <p className="text-slate-700 mb-4">
                  Your admin role request has been submitted successfully.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                  <p className="text-sm text-slate-700">
                    <strong>What happens next?</strong>
                  </p>
                  <ul className="text-sm text-slate-700 mt-2 space-y-1 list-disc list-inside">
                    <li>An administrator will review your request</li>
                    <li>You'll be notified of the decision via email</li>
                    <li>If approved, your role will be updated automatically</li>
                  </ul>
                </div>
              </div>

              <button
                onClick={handleGoBack}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Dashboard
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
