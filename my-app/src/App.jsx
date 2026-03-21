 import React from "react";
 import Home from "./Componants/Home"
 import Login from "./Componants/Login";
import { Route, Routes } from "react-router-dom";
import Nav from "./Componants/Nav";
import Chat from "./Componants/Chat";
import Profile from "./Componants/Profile";
 function App(){
   return (
    <div className="flex">
      <Nav />

      {/* Main Content */}
      <div className="flex-1 md:ml-64 pb-16 md:pb-0">
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Login />} />
          <Route path="/chat" element={<Chat/>}/>
          <Route path="/profile" element={<Profile/>}/>
        </Routes>
      </div>
    </div>
  );
 }
 export default App