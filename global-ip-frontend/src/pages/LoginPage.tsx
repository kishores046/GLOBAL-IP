import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Eye, EyeOff, Loader2 } from "lucide-react";
import authService from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export function LoginPage() {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      // Login and update AuthContext
      await authLogin(email, password);
      
      // Show success message
      toast.success("Login successful!");
      
      // Get user profile to determine role
      const user = await authService.getUserProfile();
      
      // Get primary role (first role in array)
      const firstRole = user?.roles?.[0];
      const primaryRole = (typeof firstRole === 'string' ? firstRole : firstRole?.roleType)?.toLowerCase() || "user";
      
      // Navigate to appropriate dashboard based on role
      if (primaryRole === "admin") {
        navigate("/dashboard/admin");
      } else if (primaryRole === "analyst") {
        navigate("/dashboard/analyst");
      } else {
        navigate("/dashboard/user");
      }
    } catch (err: any) {
      const errorMessage = err.message ?? "Login failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    authService.loginWithGoogle();
  };

  const handleGitHubLogin = () => {
    authService.loginWithGitHub();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 flex items-center justify-center p-6">
      {/* Login Card */}
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8 md:p-10">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl text-blue-900 text-center mb-2">
            Login to Your Account
          </h1>
          <p className="text-slate-600 text-center mb-8">
            Access your IP intelligence dashboard
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="relative">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-transparent focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all peer"
                placeholder="Email"
                required
                disabled={isLoading}
                autoComplete="email"
              />
              <label
                htmlFor="email"
                className="absolute left-3 -top-2.5 text-blue-700 text-sm bg-white px-2 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-sm peer-focus:bg-white"
              >
                Email
              </label>
            </div>

            {/* Password Input */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-transparent focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all peer pr-12"
                placeholder="Password"
                required
                disabled={isLoading}
                autoComplete="current-password"
              />
              <label
                htmlFor="password"
                className="absolute left-3 -top-2.5 text-blue-700 text-sm bg-white px-2 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-sm peer-focus:bg-white"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3 text-slate-500 hover:text-blue-600 transition-colors"
                disabled={isLoading}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-blue-600 hover:text-blue-700 transition-colors text-sm"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-slate-300"></div>
            <span className="px-4 text-sm text-slate-500">OR</span>
            <div className="flex-1 border-t border-slate-300"></div>
          </div>

          {/* OAuth Login Buttons */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-3 px-4 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow"
              disabled={isLoading}
              aria-label="Continue with Google"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <button
              type="button"
              onClick={handleGitHubLogin}
              className="w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow font-medium"
              disabled={isLoading}
              aria-label="Continue with GitHub"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              Continue with GitHub
            </button>
          </div>

          {/* Create Account Link */}
          <div className="mt-6 text-center">
            <p className="text-slate-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                Create an Account
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-slate-600 hover:text-blue-600 transition-colors text-sm"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}