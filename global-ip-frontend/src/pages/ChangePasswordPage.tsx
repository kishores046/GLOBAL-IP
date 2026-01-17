import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Shield, Eye, EyeOff, Loader2, CheckCircle2, XCircle } from "lucide-react";
import authService from "../services/authService";
import { toast } from "sonner";

// Password requirement indicator component
const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
  <div className="flex items-center gap-2 text-sm">
    {met ? (
      <CheckCircle2 className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-slate-400" />
    )}
    <span className={met ? "text-green-600" : "text-slate-500"}>{text}</span>
  </div>
);

export function ChangePasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Password strength validation
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  // Get email from location state (passed from login page)
  const userEmail = location.state?.email ?? "";

  // Redirect to login if accessed without proper context
  useEffect(() => {
    if (!userEmail) {
      toast.error("Invalid access. Please login first.");
      navigate("/login", { replace: true });
    }
  }, [userEmail, navigate]);

  // Prevent page refresh from losing context
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (oldPassword || newPassword || confirmPassword) {
        e.preventDefault();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [oldPassword, newPassword, confirmPassword]);

  // Validate password strength
  useEffect(() => {
    setPasswordStrength({
      hasMinLength: newPassword.length >= 8,
      hasUpperCase: /[A-Z]/.test(newPassword),
      hasLowerCase: /[a-z]/.test(newPassword),
      hasNumber: /\d/.test(newPassword),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
    });
  }, [newPassword]);

  const isPasswordValid = Object.values(passwordStrength).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (!isPasswordValid) {
      setError("Password does not meet strength requirements");
      return;
    }

    if (oldPassword === newPassword) {
      setError("New password must be different from old password");
      return;
    }

    setIsLoading(true);

    try {
      // Call change password API
      const response = await authService.changePassword(userEmail, oldPassword, newPassword);
      
      toast.success(response.message || "Password changed successfully!");
      
      // Auto-login with new password and redirect to dashboard
      try {
        const loginResponse = await authService.login({
          email: userEmail,
          password: newPassword
        });
        
        if (loginResponse.token) {
          // Get user profile to determine role
          const user = await authService.getUserProfile();
          
          toast.success("Logged in successfully!");
          
          // Get primary role and redirect to appropriate dashboard
          const firstRole = user?.roles?.[0];
          const primaryRole = (typeof firstRole === 'string' ? firstRole : firstRole?.roleType)?.toLowerCase() || "user";
          
          setTimeout(() => {
            if (primaryRole === "admin") {
              navigate("/dashboard/admin", { replace: true });
            } else if (primaryRole === "analyst") {
              navigate("/dashboard/analyst", { replace: true });
            } else {
              navigate("/dashboard/user", { replace: true });
            }
          }, 500);
        }
      } catch (loginErr: any) {
        // If auto-login fails, redirect to login page
        console.error("Auto-login failed:", loginErr);
        setTimeout(() => {
          navigate("/login", { 
            replace: true,
            state: { message: "Password changed successfully. Please login with your new password." }
          });
        }, 1500);
      }
    } catch (err: any) {
      const errorMessage = err.message ?? "Failed to change password. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 flex items-center justify-center p-6">
      {/* Change Password Card */}
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8 md:p-10">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl text-blue-900 text-center mb-2">
            Change Password Required
          </h1>
          <p className="text-slate-600 text-center mb-8">
            Password change required on first login. Please create a strong password to continue.
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Change Password Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Display (read-only) */}
            <div className="relative">
              <input
                type="email"
                id="email"
                value={userEmail}
                className="w-full px-4 py-3 bg-slate-100 border border-slate-300 rounded-lg text-slate-700 cursor-not-allowed"
                disabled
                readOnly
                aria-label="Email address"
              />
              <label htmlFor="email" className="absolute left-3 -top-2.5 text-blue-700 text-sm bg-white px-2">
                Email
              </label>
            </div>

            {/* Old Password Input */}
            <div className="relative">
              <input
                type={showOldPassword ? "text" : "password"}
                id="oldPassword"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-transparent focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all peer pr-12"
                placeholder="Old Password"
                required
                disabled={isLoading}
                autoComplete="current-password"
              />
              <label
                htmlFor="oldPassword"
                className="absolute left-3 -top-2.5 text-blue-700 text-sm bg-white px-2 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-sm peer-focus:bg-white"
              >
                Current (Temporary) Password
              </label>
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-4 top-3 text-slate-500 hover:text-blue-600 transition-colors"
                disabled={isLoading}
                aria-label={showOldPassword ? "Hide password" : "Show password"}
              >
                {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* New Password Input */}
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-transparent focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all peer pr-12"
                placeholder="New Password"
                required
                disabled={isLoading}
                autoComplete="new-password"
              />
              <label
                htmlFor="newPassword"
                className="absolute left-3 -top-2.5 text-blue-700 text-sm bg-white px-2 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-sm peer-focus:bg-white"
              >
                New Password
              </label>
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-3 text-slate-500 hover:text-blue-600 transition-colors"
                disabled={isLoading}
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Confirm Password Input */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-transparent focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all peer pr-12"
                placeholder="Confirm Password"
                required
                disabled={isLoading}
                autoComplete="new-password"
              />
              <label
                htmlFor="confirmPassword"
                className="absolute left-3 -top-2.5 text-blue-700 text-sm bg-white px-2 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-sm peer-focus:bg-white"
              >
                Confirm New Password
              </label>
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-3 text-slate-500 hover:text-blue-600 transition-colors"
                disabled={isLoading}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Password Strength Requirements */}
            {newPassword && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <p className="text-sm font-medium text-slate-700 mb-2">
                  Password Requirements:
                </p>
                <PasswordRequirement
                  met={passwordStrength.hasMinLength}
                  text="At least 8 characters"
                />
                <PasswordRequirement
                  met={passwordStrength.hasUpperCase}
                  text="Contains uppercase letter"
                />
                <PasswordRequirement
                  met={passwordStrength.hasLowerCase}
                  text="Contains lowercase letter"
                />
                <PasswordRequirement
                  met={passwordStrength.hasNumber}
                  text="Contains number"
                />
                <PasswordRequirement
                  met={passwordStrength.hasSpecialChar}
                  text="Contains special character (!@#$%^&*)"
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={isLoading || !isPasswordValid}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Changing Password...
                </>
              ) : (
                "Change Password"
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Security Notice:</strong> You will be redirected to login after changing your password. 
              Please use your new password to access the application.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
