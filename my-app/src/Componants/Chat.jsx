
// function Chat() {
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   const username = localStorage.getItem("username") || "Me";

//   useEffect(() => {
//     socket.on("receive_message", (data) => {
//       setMessages((prev) => [...prev, data]);
//     });

//     return () => socket.off("receive_message");
//   }, []);

//   const sendMessage = () => {
//     if (!message.trim()) return;

//     const msgData = {
//       message,
//       user: username,
//     };

//     socket.emit("send_message", msgData);
//     setMessages((prev) => [...prev, msgData]);
//     setMessage("");
//   }; 
 
 
 
 
 
 
 
  import axios from "axios";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { ArrowLeft } from "lucide-react";

 const socket = io(import.meta.env.VITE_API_URL, {
  cors: {
    origin: "*",
  },
});

function Chat() {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [currentRoom, setCurrentRoom] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const myId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/${myId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUsers(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUsers();
  }, [myId, token]);

  // Receive message
  useEffect(() => {
    socket.on("receive_message", (data) => {
       
    });

    return () => socket.off("receive_message");
  }, []);

  const selectUser = (user) => {
    const roomId = [myId, user._id].sort().join("_");

    setSelectedUser(user);
    setCurrentRoom(roomId);
    setMessages([]);

    socket.emit("join_room", roomId);
  };

  const sendMessage = () => {
    if (!message.trim() || !currentRoom) return;

    const msgData = {
      roomId: currentRoom,
      message,
      user: username,
    };

    socket.emit("send_message", msgData);
    setMessages((prev) => [...prev, msgData]);
    setMessage("");
  };

  return (
    <div className="h-screen bg-gray-100  flex">

      {/* SIDEBAR */}
      <div className={`
        ${selectedUser ? "hidden md:block" : "block"} 
        w-full md:w-80 bg-white border-r
      `}>
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Messages</h2>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-64px)]">
          {users.map((user) => (
            <div
              key={user._id}
              onClick={() => selectUser(user)}
              className={`p-4 cursor-pointer flex items-center gap-3
              ${selectedUser?._id === user._id
                  ? "bg-gray-200"
                  : "hover:bg-gray-100"}`}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-purple-500"></div>
              <div>
                <div className="font-semibold">{user.Username}</div>
                <div className="text-sm text-gray-500">{user.Fullname}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CHAT AREA */}
      <div className={`
        ${selectedUser ? "flex" : "hidden md:flex"} 
        flex-1 flex-col
      `}>

        {/* HEADER */}
        <div className="bg-white px-4 py-3 border-b flex items-center gap-3 shadow-sm">
          
          {/* Mobile Back Button */}
          <button
            onClick={() => setSelectedUser(null)}
            className="md:hidden"
          >
            <ArrowLeft size={22} />
          </button>

          {selectedUser ? (
            <>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-purple-500"></div>
              <h2 className="font-semibold text-lg">
                {selectedUser.Username}
              </h2>
            </>
          ) : (
            <h2 className="text-gray-500">Select a chat</h2>
          )}
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, index) => {
            const isMe = msg.user === username;

            return (
              <div
                key={index}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-4 py-2 max-w-[75%] text-sm rounded-2xl shadow
                  ${isMe
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-none"
                      : "bg-white text-black rounded-bl-none"
                    }`}
                >
                  {!isMe && (
                    <p className="text-xs font-semibold mb-1">
                      {msg.user}
                    </p>
                  )}
                  {msg.message}
                </div>
              </div>
            );
          })}
        </div>

        {/* INPUT */}
        {selectedUser && (
          <div className="p-3  bg-white border-t flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message..."
              className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button
              onClick={sendMessage}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-2 rounded-full"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;