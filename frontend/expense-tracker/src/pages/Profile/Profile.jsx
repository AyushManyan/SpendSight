import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import CharAvatar from "../../components/Cards/CharAvatar";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import { FiUser, FiMail, FiCalendar, FiLock, FiEye, FiEyeOff, FiSave, FiEdit2 } from "react-icons/fi";
import { toast } from "react-hot-toast"; // or your preferred toast library
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import uploadImage from "../../utils/uploadImage";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import ProfileStats from "./ProfileStats";
import ChangePasswordModal from "./ChangePasswordModal";
import Loading from "../../components/Loading";

const Profile = () => {
  const { user, updateUser } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    location: user?.location || "",
    profileImageUrl: user?.profileImageUrl || null,
  });
  const [profilePic, setProfilePic] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [profileUpdating, setProfileUpdating] = useState(false);
  const [passwordUpdating, setPasswordUpdating] = useState(false);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-gray-500">No user information available.</p>
      </div>
    );
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };

  const handleUpdateProfile = async () => {
    setProfileUpdating(true);
    try {
      let updatedProfileImageUrl = formData.profileImageUrl;
      if (profilePic) {
        // Upload new image if selected
        const imgUploadRes = await uploadImage(profilePic);
        updatedProfileImageUrl = imgUploadRes.imageUrl || formData.profileImageUrl;
      }
      const updatePayload = { ...formData, profileImageUrl: updatedProfileImageUrl };
      const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE, updatePayload);
      if (response.status === 200 && response.data) {
        // Fetch latest user info from backend
        const userRes = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);
        if (userRes.status === 200 && userRes.data) {
          updateUser(userRes.data.user || userRes.data);
        }
        toast.success("Profile updated successfully!");
        setIsEditing(false);
        setProfilePic(null);
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setProfileUpdating(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordUpdating) return;
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match!");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters!");
      return;
    }
    setPasswordUpdating(true);
    try {
      const response = await axiosInstance.put(API_PATHS.AUTH.CHANGE_PASSWORD, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      if (response.status === 200) {
        toast.success("Password changed successfully!");
        setShowChangePassword(false);
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        toast.error(response.data?.message || "Failed to change password");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setPasswordUpdating(false);
    }
  };

  const [dashboardData, setDashboardData] = useState(null);
  const [stats, setStats] = useState([
    { label: "Total Income", value: "-", change: "", color: "text-green-600" },
    { label: "Total Expenses", value: "-", change: "", color: "text-red-600" },
    { label: "Savings", value: "-", change: "", color: "text-blue-600" },
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`${API_PATHS.DASHBOARD.GET_DATA}`);
        if (response.status === 200) {
          setDashboardData(response.data);
          setStats([
            {
              label: "Total Income",
              value: `₹${response.data.totalIncome?.toLocaleString() || 0}`,
              change: "",
              color: "text-green-600"
            },
            {
              label: "Total Expenses",
              value: `₹${response.data.totalExpense?.toLocaleString() || 0}`,
              change: "",
              color: "text-red-600"
            },
            {
              label: "Savings",
              value: `₹${((response.data.totalIncome || 0) - (response.data.totalExpense || 0)).toLocaleString()}`,
              change: "",
              color: "text-blue-600"
            }
          ]);
        }
      } catch (error) {
        toast.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout active="profile">
        <div className="flex justify-center items-center h-[60vh]">
          <Loading />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout active="profile">
      <div className="max-w-3xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Manage your account information and preferences</p>
        </div>

        {/* Responsive Profile Card & Personal Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 flex flex-col items-center text-center w-full">
          <div className="relative mb-4">
            {isEditing ? (
              <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
            ) : user.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt="Profile"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-indigo-500 shadow-lg"
              />
            ) : (
              <CharAvatar 
                fullName={user.fullName} 
                width="w-24 sm:w-28" 
                height="h-24 sm:h-28" 
                style="text-2xl sm:text-3xl font-bold"
              />
            )}
          </div>
          <h2 className="text-lg sm:text-xl font-bold mt-2">{user.fullName}</h2>
          <p className="text-gray-500 text-xs sm:text-sm mb-2">{user.email}</p>

          {/* Stats Overview */}
          <div className="w-full">
            <ProfileStats stats={stats} />
          </div>

          <div className="w-full mt-6 sm:mt-8 text-left">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-2 sm:gap-0">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Personal Information</h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition text-sm"
                >
                  <FiEdit2 size={16} />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-3 sm:px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateProfile}
                    className={`flex items-center gap-2 px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm ${profileUpdating ? 'opacity-60 cursor-not-allowed' : ''}`}
                    disabled={profileUpdating}
                  >
                    {profileUpdating ? (
                      <>
                        <span className="loader border-white border-2 mr-2 w-4 h-4 rounded-full border-t-indigo-500 animate-spin"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <FiSave size={16} />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  <FiUser className="inline mr-2" size={14} />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-sm"
                  />
                ) : (
                  <p className="text-gray-900 text-sm">{user.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  <FiMail className="inline mr-2" size={14} />
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-sm"
                  />
                ) : (
                  <p className="text-gray-900 text-sm">{user.email}</p>
                )}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  <FiCalendar className="inline mr-2" size={14} />
                  Member Since
                </label>
                <p className="text-gray-900 text-sm">{new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowChangePassword(true)}
            className="mt-6 sm:mt-8 w-full flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition border border-gray-200 text-sm"
          >
            <FiLock size={16} />
            Change Password
          </button>
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <ChangePasswordModal
          show={showChangePassword}
          onClose={() => setShowChangePassword(false)}
          passwordData={passwordData}
          setPasswordData={setPasswordData}
          showPassword={showPassword}
          togglePasswordVisibility={togglePasswordVisibility}
          handlePasswordChange={handlePasswordChange}
          handleChangePassword={handleChangePassword}
          passwordUpdating={passwordUpdating}
        />
      )}
    </DashboardLayout>
  );
};

export default Profile;