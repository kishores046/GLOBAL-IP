import { useState, useEffect, useRef, useContext } from "react";
import { Sidebar } from "../components/dashboard/Sidebar";
import { AnalystSidebar } from "../components/dashboard/AnalystSidebar";
import { AnalystLayoutContext } from "../components/dashboard/AnalystLayout";
import { Camera, Mail, Phone, MapPin, Briefcase, Edit2, Save, X, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROLES } from "../routes/routeConfig";
import authService from "../services/authService";
import { toast } from "sonner";

export function ProfilePage() {
  const navigate = useNavigate();
  const { user: authUser, getRole } = useAuth();
  const userRole = getRole()?.toUpperCase();
  const isAnalyst = userRole === ROLES.ANALYST;
  const isInAnalystLayout = useContext(AnalystLayoutContext);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const hasLoadedRef = useRef(false);
  
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    role: "",
    phone: "",
    location: "",
    company: "",
    position: "",
    joinDate: "",
    bio: "",
    specialization: "",
  });

  const [tempData, setTempData] = useState(profileData);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Fetch user data on component mount
  useEffect(() => {
    // Only load once when component mounts
    if (hasLoadedRef.current) {
      console.log('[ProfilePage] Already loaded, skipping...');
      return;
    }
    
    const loadUserProfile = async () => {
      try {
        setIsLoading(true);
        console.log('[ProfilePage] Loading user profile...');
        const userData = await authService.getUserProfile();
        console.log('[ProfilePage] User data received:', userData);
        
        // Set profile data from user data
        const firstRole = userData?.roles?.[0];
        const primaryRole = typeof firstRole === 'string' ? firstRole : firstRole?.roleType || "USER";
        console.log('[ProfilePage] Primary role:', primaryRole);
        
        setProfileData({
          username: userData.username || "",
          email: userData.email || "",
          role: primaryRole,
          phone: userData.phoneNumber ?? "",
          location: userData.location ?? "",
          company: userData.company ?? "",
          position: userData.position ?? "",
          joinDate: userData.joinDate ?? new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          bio: userData.bio ?? "",
          specialization: "",
        });
        
        setTempData({
          username: userData.username || "",
          email: userData.email || "",
          role: primaryRole,
          phone: userData.phoneNumber ?? "",
          location: userData.location ?? "",
          company: userData.company ?? "",
          position: userData.position ?? "",
          joinDate: userData.joinDate ?? new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          bio: userData.bio ?? "",
          specialization: "",
        });

        if (userData.profileImage) {
          setProfileImage(userData.profileImage);
        }
        
        hasLoadedRef.current = true;
        console.log('[ProfilePage] Profile loaded successfully');
      } catch (error) {
        console.error("Failed to load user profile:", error);
        toast.error("Failed to load profile data");
        // If user is not authenticated, redirect to login
        if (!authService.isAuthenticated()) {
          navigate("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, [navigate]);

  const handleEdit = () => {
    setIsEditing(true);
    setTempData(profileData);
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      console.log('[ProfilePage] Saving profile data:', tempData);
      
      // Call API to update user profile
      const updateResponse = await authService.updateUserProfile({
        username: tempData.username,
        phoneNumber: tempData.phone,
        location: tempData.location,
        company: tempData.company,
        position: tempData.position,
        bio: tempData.bio,
      });
      
      console.log('[ProfilePage] Profile updated successfully:', updateResponse);
      
      // Fetch the complete updated profile
      const updatedUser = await authService.getUserProfile();
      console.log('[ProfilePage] Fetched complete profile:', updatedUser);
      
      // Update local state with complete user data
      const firstRole = updatedUser?.roles?.[0];
      const primaryRole = typeof firstRole === 'string' ? firstRole : firstRole?.roleType || "USER";
      
      const newProfileData = {
        username: updatedUser.username || "",
        email: updatedUser.email || "",
        role: primaryRole,
        phone: updatedUser.phoneNumber ?? "",
        location: updatedUser.location ?? "",
        company: updatedUser.company ?? "",
        position: updatedUser.position ?? "",
        joinDate: profileData.joinDate,
        bio: updatedUser.bio ?? "",
        specialization: "",
      };
      
      setProfileData(newProfileData);
      setTempData(newProfileData);
      
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setTempData(profileData);
    setIsEditing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setTempData(prev => ({ ...prev, [field]: value }));
  };

  // Get role display name
  const getRoleDisplay = (role: string) => {
    switch (role?.toUpperCase()) {
      case 'ADMIN':
        return 'Administrator';
      case 'ANALYST':
        return 'Senior Analyst';
      case 'USER':
      default:
        return 'User';
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
        <div className="flex">
          {!isInAnalystLayout && (isAnalyst ? <AnalystSidebar /> : <Sidebar />)}
          <main className="flex-1 p-8 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-slate-600">Loading profile...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
      <div className="flex">
        {!isInAnalystLayout && (isAnalyst ? <AnalystSidebar /> : <Sidebar />)}
        
        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            {/* Page Header */}
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-4xl text-blue-900 mb-2">
                  My Profile
                </h1>
                <p className="text-slate-600">Manage your personal information</p>
              </div>
              
              {/* Edit/Save/Cancel Buttons */}
              <div className="flex gap-3">
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
                  >
                    <Edit2 className="w-5 h-5" />
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
                    >
                      <Save className="w-5 h-5" />
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-6 py-3 bg-slate-400 hover:bg-slate-500 text-white rounded-lg shadow-md transition-all"
                    >
                      <X className="w-5 h-5" />
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Profile Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Profile Image & Stats */}
              <div className="lg:col-span-1 space-y-6">
                {/* Profile Image Card */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-md p-6">
                  <div className="flex flex-col items-center">
                    {/* Profile Image */}
                    <div className="relative group">
                      <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
                        {profileImage ? (
                          <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-6xl text-white font-bold">
                            {(profileData.username || profileData.email || "U").charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      
                      {/* Camera Icon Overlay */}
                      {isEditing && (
                        <label className="absolute bottom-2 right-2 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-blue-700 transition-colors">
                          <Camera className="w-5 h-5 text-white" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>

                    {/* Name & Role */}
                    <h2 className="mt-4 text-2xl font-semibold text-blue-900 text-center">
                      {profileData.username}
                    </h2>
                    <p className="text-slate-600 mt-1">
                      {getRoleDisplay(profileData.role)}
                    </p>
                    <div className="mt-3 px-4 py-2 bg-blue-50 rounded-full border border-blue-200">
                      <span className="text-sm text-blue-700">
                        Member since {profileData.joinDate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Profile Information */}
              <div className="lg:col-span-2 space-y-6">
                {/* Personal Information */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-md p-6">
                  <h3 className="text-2xl font-semibold text-blue-900 mb-6">
                    Personal Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Username */}
                    <div>
                      <label className="block text-slate-700 font-medium mb-2">Username</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={tempData.username}
                          onChange={(e) => handleInputChange('username', e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        />
                      ) : (
                        <div className="px-4 py-3 bg-slate-50 rounded-lg border border-slate-200">
                          <span className="text-slate-900">{profileData.username}</span>
                        </div>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-slate-700 font-medium mb-2">Email Address</label>
                      <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-lg border border-slate-200">
                        <Mail className="w-5 h-5 text-slate-400" />
                        <span className="text-slate-900">{profileData.email}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-slate-700 font-medium mb-2">Phone Number</label>
                      {isEditing ? (
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            type="tel"
                            value={tempData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="Enter phone number"
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-lg border border-slate-200">
                          <Phone className="w-5 h-5 text-slate-400" />
                          <span className="text-slate-900">{profileData.phone || "Not provided"}</span>
                        </div>
                      )}
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-slate-700 font-medium mb-2">Location</label>
                      {isEditing ? (
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            type="text"
                            value={tempData.location}
                            onChange={(e) => handleInputChange('location', e.target.value)}
                            placeholder="Enter location"
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-lg border border-slate-200">
                          <MapPin className="w-5 h-5 text-slate-400" />
                          <span className="text-slate-900">{profileData.location || "Not provided"}</span>
                        </div>
                      )}
                    </div>

                    {/* Role - Read Only */}
                    <div className="md:col-span-2">
                      <label className="block text-slate-700 font-medium mb-2">Role</label>
                      <div className="px-4 py-3 bg-slate-50 rounded-lg border border-slate-200">
                        <span className="text-slate-900 font-medium">{getRoleDisplay(profileData.role)}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Role is assigned by administrators</p>
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-md p-6">
                  <h3 className="text-2xl font-semibold text-blue-900 mb-6">
                    Professional Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Company */}
                    <div>
                      <label className="block text-slate-700 font-medium mb-2">Company</label>
                      {isEditing ? (
                        <div className="relative">
                          <Briefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            type="text"
                            value={tempData.company}
                            onChange={(e) => handleInputChange('company', e.target.value)}
                            placeholder="Enter company name"
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-lg border border-slate-200">
                          <Briefcase className="w-5 h-5 text-slate-400" />
                          <span className="text-slate-900">{profileData.company || "Not provided"}</span>
                        </div>
                      )}
                    </div>

                    {/* Position */}
                    <div>
                      <label className="block text-slate-700 font-medium mb-2">Position</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={tempData.position}
                          onChange={(e) => handleInputChange('position', e.target.value)}
                          placeholder="Enter position"
                          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        />
                      ) : (
                        <div className="px-4 py-3 bg-slate-50 rounded-lg border border-slate-200">
                          <span className="text-slate-900">{profileData.position || "Not provided"}</span>
                        </div>
                      )}
                    </div>

                    {profileData.role?.toUpperCase() === "ANALYST" && (
                      <div className="md:col-span-2">
                        <label className="block text-slate-700 font-medium mb-2">Specialization</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={tempData.specialization}
                            onChange={(e) => handleInputChange('specialization', e.target.value)}
                            placeholder="Enter your specialization"
                            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                          />
                        ) : (
                          <div className="px-4 py-3 bg-slate-50 rounded-lg border border-slate-200">
                            <span className="text-slate-900">{profileData.specialization || "Not provided"}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bio */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-md p-6">
                  <h3 className="text-2xl font-semibold text-blue-900 mb-6">
                    Bio
                  </h3>
                  
                  {isEditing ? (
                    <textarea
                      value={tempData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      rows={4}
                      placeholder="Tell us about yourself..."
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                    />
                  ) : (
                    <p className="text-slate-700 leading-relaxed">
                      {profileData.bio || "No bio provided yet. Click 'Edit Profile' to add one."}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
