import React, { useContext, useState, useEffect } from 'react';
import { Edit3, Save, X, Upload } from 'lucide-react';
import profile from '../assets/profile.jpg';
import { AuthContext } from "../context/AuthContext";
import { auth } from '../data/allapi';


const AccountInformation = () => {
  const { userdata, usertoken, setuserdata } = useContext(AuthContext);

  const defaultState = {
    name: userdata?.name || "",
    email: userdata?.email || "",
    mobileNumber: userdata?.mobileNumber || "",
    gender: userdata?.gender || "",
    dateOfBirth: userdata?.dateOfBirth?.slice(0, 10) || "",
    location: userdata?.location || "",
    alternativeMobileNumber: userdata?.alternativeMobileNumber || "",
    hintName: userdata?.hintName || "",
  };

  const [formData, setFormData] = useState(defaultState);
  const [initialData, setInitialData] = useState(defaultState);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);

  useEffect(() => {
    setFormData(defaultState);
    setInitialData(defaultState);
  }, [userdata]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setProfileImage(file);
      setProfilePreview(URL.createObjectURL(file));
    } else {
      alert("Please select a valid image file.");
    }
  };

  const handleSave = async () => {
    try {
      const form = new FormData();
      for (const key in formData) {
        form.append(key, formData[key]);
      }

      if (profileImage) {
        form.append("image", profileImage);
      }

      const response = await fetch(auth.UPDATE_USER_DATA, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${usertoken}`,
        },
        body: form
      });
      // console.log(response)

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();
      setuserdata(data.data);
      setInitialData(formData);
      setIsEditing(false);
      setProfilePreview(null);
      setProfileImage(null);
      alert("Profile updated successfully.");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  const handleCancel = () => {
    setFormData(initialData);
    setProfilePreview(null);
    setProfileImage(null);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">👤 Account Information</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-xl transition-all shadow-md"
        >
          <Edit3 className="w-4 h-4" />
          <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
        </button>
      </div>

      {/* Profile Image */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative group">
          <img
            src={profilePreview || userdata?.image || profile}
            alt="Profile"
            className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-xl transition-transform duration-300 group-hover:scale-105"
          />
          {isEditing && (
            <label className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow cursor-pointer hover:bg-gray-100 transition">
              <Upload className="w-4 h-4 text-indigo-600" />
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          )}
        </div>
        <p className="text-sm text-gray-600">Tap icon to change photo</p>
      </div>

      {/* Form Fields */}
      <div className="bg-[#F6F5F5] backdrop-blur-xl  border border-white/40 shadow-2xl p-10 transition-all">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Full Name" name="name" value={formData.name} onChange={handleInputChange} isEditing={isEditing} />
          <InputField label="Mobile Number" name="mobileNumber" type="tel" value={formData.mobileNumber} onChange={handleInputChange} isEditing={isEditing} />
          <InputField label="Email ID" name="email" type="email" value={formData.email} onChange={handleInputChange} isEditing={isEditing} disabled={true} />

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            {isEditing ? (
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/60 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">--Select--</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            ) : (
              <div className="px-4 py-3 bg-white/20 rounded-xl border border-white/30">
                {formData.gender || '- not added -'}
              </div>
            )}
          </div>

          <InputField label="Date of Birth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleInputChange} isEditing={isEditing} />
          <InputField label="Location" name="location" value={formData.location} onChange={handleInputChange} isEditing={isEditing} />
          <InputField label="Alternate Mobile" name="alternativeMobileNumber" value={formData.alternativeMobileNumber} onChange={handleInputChange} isEditing={isEditing} />
          <InputField label="Hint Name" name="hintName" value={formData.hintName} onChange={handleInputChange} isEditing={isEditing} />
        </div>

        {/* Buttons */}
        {isEditing && (
          <div className="flex justify-end mt-10 gap-4">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 shadow"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};


// InputField Component
const InputField = ({ label, name, value, onChange, isEditing, disabled = false, type = "text" }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    {isEditing ? (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-4 py-3 bg-white/50 border border-white/60 rounded-xl focus:outline-none backdrop-blur-sm ${
          disabled ? 'opacity-60 cursor-not-allowed' : 'focus:ring-2 focus:ring-indigo-500'
        }`}
      />
    ) : (
      <div className="px-4 py-3 bg-white/30 border border-white/40 rounded-xl text-gray-700">
        {value || '- not added -'}
      </div>
    )}
  </div>
);


export default AccountInformation;
