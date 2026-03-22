 import React, { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`https://mygram-production-e1e0.up.railway.app/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProfile();
  }, [token]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-8">

        {/* Profile Image */}
        <div className="flex flex-col items-center">
          <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {user.Username?.charAt(0).toUpperCase()}
          </div>

          <h2 className="mt-4 text-2xl font-bold">{user.Fullname}</h2>
          <p className="text-gray-500">@{user.Username}</p>
        </div>

        {/* Info Section */}
        <div className="mt-8 space-y-4">

          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-sm text-gray-400">Email</p>
            <p className="font-medium">{user.Email}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-sm text-gray-400">User ID</p>
            <p className="font-medium text-sm break-all">
              {user._id}
            </p>
          </div>

        </div>

        {/* Buttons */}
        <div className="mt-8">
          <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition">
            Edit Profile
          </button>
        </div>

      </div>
    </div>
  );
}

export default Profile;