import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import editicon from "../../assets/edit-icon.png";
import profileicon from "../../assets/profile-icon.png";
// import profileavatar from "../../assets/profile-avatar.png";
import avatar from "../../assets/avatar.png";
import key from "../../assets/key.png";
import file from "../../assets/file.png";
import filefolder from "../../assets/files-folder.png";
import security from "../../assets/security.png";
import { API_URL } from "../utils/Apiconfig";
const Profile = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState("default-avatar.png");
  const navigate = useNavigate();
  // Fetch user details on component mount
 
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/api/auth/get-personaluser-details`, {
          headers: {
            Authorization: `Bearer ${token}`, // Assuming token is stored in localStorage
          },
        });
        setUserDetails({
          name: response.data.user.username,
          email: response.data.user.email,
          phone: response.data.user.phoneNumber,
        });
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    const fetchProfilePicture = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/api/auth/getProfilePicture`, {
          headers: {
            Authorization: `Bearer ${token}`, // Add token if needed
          },
        });
        if (response.status === 200) {
          setProfilePicture(response.data.profilePictureUrl);
        }
      } catch (error) {
        console.error("Error fetching profile picture:", error);
        // Use default avatar if fetching fails
        setProfilePicture("default-avatar.png");
      }
    };


  useEffect(() => {
    fetchProfilePicture();
    fetchUserDetails();
  }, []);


  async function logout() {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error("No token found. Please log in again.");
        }

        const apiUrl = `${API_URL}/api/auth/signout`;

        const headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };

        const response = await fetch(apiUrl, { method: "POST", headers });

        if (!response.ok) {
            throw new Error("Failed to log out. Please try again.");
        }

        // Clear token from localStorage
        localStorage.removeItem("token");

        // Clear cookies if used
        Cookies.remove("token");

        // Prevent cached pages from being accessed
        window.history.pushState(null, null, window.location.href);
        window.addEventListener("popstate", () => {
            window.history.pushState(null, null, window.location.href);
        });

        // Redirect to the login page
        navigate("/Login");
    } catch (error) {
        console.error(error);
    }
}

  // Handle profile picture upload
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Preview the image locally
      setProfilePicture(URL.createObjectURL(file));

      // Prepare form data
      const formData = new FormData();
      formData.append("profilePicture", file);
      console.log("API URL:", `${API_URL}/api/auth/uploadProfilePicture`);


      try {
        // Send the image to the backend
        const token = localStorage.getItem("token");
        const response = await axios.post(
          `${API_URL}/api/auth/uploadProfilePicture`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`, // Add token if needed
            },
          }
        );

        if (response.status === 200) {
          alert("Profile picture updated successfully!");
          fetchProfilePicture();
        }
      } catch (error) {
        console.error("Error uploading profile picture:", error);
        alert("Failed to upload profile picture. Please try again.");
      }
    }
  };
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [id]: value,
    }));
  };
  const saveChanges = async () => {
    //   toggleEditMode();
    try {
      const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
      const response = await fetch(`${API_URL}/api/auth/update-user-details`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token for authentication
        },
        body: JSON.stringify({
          username: userDetails.name,
          email: userDetails.email,
          phoneNumber: userDetails.phone,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message); // Show success message
        setIsEditMode(false); // Exit edit mode
        fetchUserDetails();
      } else {
        alert(data.message); // Show error message
      }
    } catch (error) {
      console.error("Error saving user details:", error);
      alert("An error occurred while saving the details. Please try again.");
    }
  };
  return (
    <div className="bg-gray-50 p-6">
      <div className="mx-auto">
        <div className="flex items-center mb-6">
          <i className="fas fa-arrow-left text-gray-500 mr-2"></i>
          <span className="text-[#212636]">Back</span>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-6 gap-4">
            {/* Profile Picture */}
            <span className="border border-[#DCDFE4] rounded-full p-2">
              <div className="relative w-16 h-16 group">
                <div className="w-full h-full rounded-full overflow-hidden">
                  <img
                    src={profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div
                  className="absolute cursor-pointer inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <div className="rounded-full p-4 relative">
                    <img
                      src={editicon}
                      alt="Edit Profile"
                      className="w-full h-full object-cover"
                    />
                    {/* Hidden file input */}
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>
              </div>
            </span>
            {/* Edit Button */}
            {/* <button
              className="absolute top-0 right-0 p-2 bg-gray-700 text-white rounded-full cursor-pointer hover:opacity-100 transition-opacity"
              onClick={() => setIsEditing(true)} 
            >
              <i className="fas fa-pencil-alt"></i>
            </button> */}
            {/* File Input for Image Upload */}
            {isEditing && (
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-24 h-24 opacity-0 cursor-pointer z-10" // Ensure z-index is high enough
                onChange={handleImageChange}
                onClick={(e) => e.stopPropagation()} // Prevent click event from closing the input
              />
            )}
            <div>
              <h1 className="text-3xl font-semibold capitalize text-[#212636]">{userDetails.name}</h1>
              <p className="text-[#667085] text-base">{userDetails.email}</p>
            </div>
          </div>
          <div className="md:flex md:flex-row flex-col gap-6">
            <div className="md:w-2/5 flex flex-col w-full gap-6">
              <div className="bg-white rounded-[20px] border-2 border-[#ececec]">
                <div className="flex justify-between px-6 mt-4">
                  <div className="flex items-center justify-start mb-4">
                    <span className="rounded-full p-2 bg-white shadow-md">
                      <img src={avatar} alt="" className="h-[25px]" />
                    </span>
                    <h2 className="text-lg font-semibold ml-2">Basic Details</h2>
                    {/* <i
                    className="fa-light fa-pen text-gray-500 cursor-pointer"
                    onClick={toggleEditMode}
                  ></i> */}
                  </div>
                  <img src={profileicon} className="h-[37px] mt-1" alt="" onClick={toggleEditMode} />
                </div>
                <div className="px-6 py-3 border-b-2 border-[#ececec]">
                  <p className="text-gray-500">Name</p>
                  {!isEditMode ? (
                    <p>{userDetails.name}</p>
                  ) : (
                    <input
                      id="name"
                      className="border border-gray-300 rounded-lg p-2 w-full"
                      type="text"
                      value={userDetails.name}
                      onChange={handleInputChange}
                    />
                  )}
                </div>
                <div className="px-6 py-3 border-b-2 border-[#ececec]">
                  <p className="text-gray-500">Email</p>
                  {!isEditMode ? (
                    <p>{userDetails.email}</p>
                  ) : (
                    <input
                      id="email"
                      className="border border-gray-300 rounded-lg p-2 w-full"
                      type="email"
                      value={userDetails.email}
                      onChange={handleInputChange}
                    />
                  )}
                </div>
                <div className="mb-4 px-6 py-3">
                  <p className="text-gray-500">Phone number</p>
                  {!isEditMode ? (
                    <p>{userDetails.phone}</p>
                  ) : (
                    <input
                      id="phone"
                      className="border border-gray-300 rounded-lg p-2 w-full"
                      type="text"
                      value={userDetails.phone}
                      onChange={handleInputChange}
                    />
                  )}
                </div>
                <div className="mb-4 px-6 pb-3">
                  {isEditMode && (
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                      onClick={saveChanges}>
                      Save
                    </button>
                  )}
                </div>
              </div>
              <div className="bg-white p-6 rounded-[20px] border-2 border-[#ececec]">
                <div className="flex items-center justify-start mb-4">
                  <span className="rounded-full p-2 bg-white shadow-md">
                    <img src={key} alt="" className="h-[25px]" />
                  </span>
                  <h2 className="text-lg font-semibold ml-2">Secure Personal Information</h2>
                </div>
                <p className="text-gray-500 mb-4">
                  Please re-enter your password to view or edit this information.
                </p>
                {/* <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                  Gain Access
                </button> */}
                <button className="text-blue-600 border w-full 2xl:w-4/12 font-medium border-[#0067FF] px-4 py-2 rounded-lg text-sm">Gain Access</button>
              </div>
            </div>
            <div className="md:w-3/5 flex flex-col w-full gap-6">
              <div className="bg-white p-6 rounded-[20px] border-2 border-[#ececec]">
                <div className="p-6 mb-10 rounded-[8px] border-2 border-[#ececec]">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: "52.35%" }}
                    ></div>
                  </div>
                  <p className="text-gray-500">10.47 GB of 20 GB</p>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Storage Used</h2>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-[20px] border-2 border-[#ececec]">
                <div className="flex flex-col lg:flex-row md:justify-between lg:items-center mb-4">
                  <div className="flex items-center justify-start mt-2 mb-4">
                    <span className="rounded-full p-2 bg-white shadow-md">
                      <img src={file} alt="" className="h-[25px]" />
                    </span>
                    <h2 className="text-lg font-semibold ml-2">Subscription Plan</h2>
                  </div>
                  <button className="text-blue-600 border font-medium border-[#0067FF] bg-[#0067FF14] px-4 py-2 rounded-lg text-sm">Deactivate Subscription</button>
                </div>
                <div className="border-2 border-blue-600 rounded-lg p-8 mb-4">
                  <p className="text-black text-xs mb-1 font-semibold">STANDARD</p>
                  <div className="flex justify-between md:mr-3 items-center flex-col lg:flex-row">
                    <div className="flex items-center">
                      <h1 className="text-5xl font-semibold">$4.99</h1>
                      <span className="text-4xl text-gray-500 ml-2">/mo</span>
                    </div>
                    <img src={filefolder} alt="Subscription plan icon" className="mt-4 w-28" />
                  </div>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full">
                  Upgrade Plan
                </button>
              </div>
              <div className="bg-white p-6 rounded-[20px] border-2 border-[#ececec]">
                <div className="flex items-center mb-4">
                  <span className="rounded-full p-2 bg-white shadow-md">
                    <img src={security} alt="" className="h-[25px]" />
                  </span>
                  <h2 className="text-lg font-semibold ml-2">Log Out of Your Account</h2>
                </div>
                <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg my-2" onClick={logout}>
                  Log Out
                </button>
                <p className="text-gray-500 my-2">
                  Click to securely log out of your account. We'll save all your
                  progress for when you return.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;