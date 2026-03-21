 import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Nav() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 h-screen bg-white border-r p-6 fixed">
        <h1 className="text-2xl font-bold mb-8">Mygram</h1>

        <Link to="/home" className="mb-4 hover:font-semibold">
          Home
        </Link>

        <Link to="/profile" className="mb-4 hover:font-semibold">
          Profile
        </Link>


        <Link to="/chat" className="mb-4 hover:font-semibold">
          Chat
        </Link>

        {/* 🔥 CONDITIONAL PART */}
        {token ? (
          <button
            onClick={handleLogout}
            className="text-red-500 hover:font-semibold text-left"
          >
            Logout
          </button>
        ) : (
          <Link to="/" className="hover:font-semibold">
            Login
          </Link>
        )}
      </div>

      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 flex justify-around md:hidden">
        <Link to="/home">Home</Link>
        <Link to="/chat">Chat</Link>
        <Link to="/profile">Profile</Link>

        {token ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <Link to="/">Login</Link>
        )}
      </div>
    </>
  );
}

export default Nav;