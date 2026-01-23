import { useState } from "react";
import { X, Eye, EyeOff, Loader2, CheckCircle2, XCircle, User, Mail, Lock, Users, Phone, Building, MapPin, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { adminApi } from "../../services/adminApi";

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface CreateUserRequest {
  username: string;
  email: string;
  temporaryPassword: string;
  roles: string[];
  phoneNumber?: string;
  company?: string;
  location?: string;
  position?: string;
}

// Password requirement indicator component
const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
  <div className="flex items-center gap-2 text-xs">
    {met ? (
      <CheckCircle2 className="w-3 h-3 text-green-500" />
    ) : (
      <XCircle className="w-3 h-3 text-slate-400" />
    )}
    <span className={met ? "text-green-600" : "text-slate-500"}>{text}</span>
  </div>
);

export function CreateUserModal({ isOpen, onClose, onSuccess }: Readonly<CreateUserModalProps>) {
  const [formData, setFormData] = useState<CreateUserRequest>({
    username: "",
    email: "",
    temporaryPassword: "",
    roles: ["USER"],
    phoneNumber: "",
    company: "",
    location: "",
    position: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  if (!isOpen) return null;

  const handleChange = (field: keyof CreateUserRequest, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Check password strength if password field
    if (field === "temporaryPassword" && typeof value === "string") {
      setPasswordStrength({
        hasMinLength: value.length >= 8,
        hasUpperCase: /[A-Z]/.test(value),
        hasLowerCase: /[a-z]/.test(value),
        hasNumber: /\d/.test(value),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
      });
    }
  };

  const handleRoleToggle = (role: string) => {
    setFormData(prev => {
      const roles = prev.roles.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role];
      return { ...prev, roles };
    });
  };

  const isPasswordValid = Object.values(passwordStrength).every(Boolean);
  const isFormValid = formData.username && formData.email && formData.temporaryPassword && isPasswordValid && formData.roles.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      toast.error("Please fill in all required fields with valid data");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare request - convert roles to Set<String> format for backend
      const request: CreateUserRequest = {
        username: formData.username,
        email: formData.email,
        temporaryPassword: formData.temporaryPassword,
        roles: formData.roles, // Backend expects Set<String> with role names
      };

      if (formData.phoneNumber) request.phoneNumber = formData.phoneNumber;
      if (formData.company) request.company = formData.company;
      if (formData.location) request.location = formData.location;
      if (formData.position) request.position = formData.position;

      console.log('Creating user with request:', request); // Debug log

      await adminApi.createUser(request);

      toast.success(`User "${formData.username}" created successfully! They must change password on first login.`);
      
      // Reset form
      setFormData({
        username: "",
        email: "",
        temporaryPassword: "",
        roles: ["USER"],
        phoneNumber: "",
        company: "",
        location: "",
        position: "",
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message ?? error.response?.data?.error ?? "Failed to create user";
      toast.error(errorMessage);
      console.error("Error creating user:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h3 className="text-2xl font-bold text-blue-900">Create New User</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-all"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
          {/* Required Fields Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <span className="text-red-500">*</span> Required Fields
            </h4>

            {/* Username */}
            <div>
              <label htmlFor="username" className="text-slate-700 mb-2 block text-sm font-medium">
                Username <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleChange("username", e.target.value)}
                  placeholder="Enter username"
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="text-slate-700 mb-2 block text-sm font-medium">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="user@example.com"
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Temporary Password */}
            <div>
              <label htmlFor="temporaryPassword" className="text-slate-700 mb-2 block text-sm font-medium">
                Temporary Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  id="temporaryPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.temporaryPassword}
                  onChange={(e) => handleChange("temporaryPassword", e.target.value)}
                  placeholder="Create temporary password"
                  className="w-full pl-10 pr-12 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900"
                  required
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-blue-600 transition-colors"
                  disabled={isSubmitting}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Password Strength Requirements */}
              {formData.temporaryPassword && (
                <div className="mt-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-0.5">
                  <p className="text-xs font-medium text-slate-700 mb-1">Password Requirements:</p>
                  <PasswordRequirement met={passwordStrength.hasMinLength} text="At least 8 characters" />
                  <PasswordRequirement met={passwordStrength.hasUpperCase} text="Uppercase letter" />
                  <PasswordRequirement met={passwordStrength.hasLowerCase} text="Lowercase letter" />
                  <PasswordRequirement met={passwordStrength.hasNumber} text="Number" />
                  <PasswordRequirement met={passwordStrength.hasSpecialChar} text="Special character" />
                </div>
              )}
            </div>

            {/* Roles */}
            <div>
              <label htmlFor="roles-group" className="text-slate-700 mb-2 block text-sm font-medium">
                Roles <span className="text-red-500">*</span>
              </label>
              <div id="roles-group" className="flex gap-3">
                {["USER", "ANALYST", "ADMIN"].map(role => (
                  <label
                    key={role}
                    className={`flex items-center gap-2 px-4 py-2 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.roles.includes(role)
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-slate-300 bg-white text-slate-700 hover:border-blue-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.roles.includes(role)}
                      onChange={() => handleRoleToggle(role)}
                      className="w-4 h-4"
                      disabled={isSubmitting}
                    />
                    <Users className="w-4 h-4" />
                    <span className="text-sm font-medium">{role}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

            {/* Optional Fields Section */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <h4 className="text-sm font-semibold text-slate-700">Optional Fields</h4>

              {/* Two-column grid for optional fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Phone Number */}
                <div>
                  <label htmlFor="phoneNumber" className="text-slate-700 mb-1.5 block text-sm font-medium">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      id="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => handleChange("phoneNumber", e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Company */}
                <div>
                  <label htmlFor="company" className="text-slate-700 mb-1.5 block text-sm font-medium">
                    Company
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      id="company"
                      type="text"
                      value={formData.company}
                      onChange={(e) => handleChange("company", e.target.value)}
                      placeholder="Company name"
                      className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label htmlFor="location" className="text-slate-700 mb-1.5 block text-sm font-medium">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      id="location"
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleChange("location", e.target.value)}
                      placeholder="City, Country"
                      className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Position */}
                <div>
                  <label htmlFor="position" className="text-slate-700 mb-1.5 block text-sm font-medium">
                    Position
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      id="position"
                      type="text"
                      value={formData.position}
                      onChange={(e) => handleChange("position", e.target.value)}
                      placeholder="Job title"
                      className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all text-slate-900"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> The user will be required to change their password on first login for security purposes.
              </p>
            </div>
          </form>
        </div>

        {/* Footer - Fixed */}
        <div className="border-t border-slate-200 p-6">
          <div className="flex gap-3">
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating User...
                </>
              ) : (
                <>
                  <User className="w-5 h-5" />
                  Create User
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
