// import express from "express"
// import cors from "cors"
// import mongoose from "mongoose"
// import route from "./Routes/routes.js"
// const app=express()
// app.use(express.json())
// app.use(cors())
// app.use("/",route)
 
// mongoose.connect("mongodb://localhost:27017/Friendo")
// .then(()=>console.log("database is connected"))
// .catch((err)=>console.log(err))
// app.get("/",(req,res)=>{
//     res.json("hello yrr m hu")
// })
// app.listen(5000,()=>{
//     console.log("server is running")
// })
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import route from "./Routes/routes.js";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
 app.use(cors({
  origin: ["https://my-gram-omega.vercel.app"], // yahan frontend URL
  methods: ["GET", "POST"],
  credentials: true
}));
app.use("/", route);

// MongoDB connection
 mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas Connected ✅"))
  .catch((err) => console.log(err));

// 🔥 Create HTTP server from express app
const server = createServer(app);

// 🔥 Attach Socket.IO to that server
const io = new Server(server, {
  cors: {
     origin: ["https://my-gram-omega.vercel.app"],
    methods: ["GET", "POST"]
  }
});

// 🔥 Socket connection
 io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Room join
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log("Joined room:", roomId);
  });

  // Message send
  socket.on("send_message", (data) => {
    io.to(data.roomId).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// ❌ app.listen remove karo
// ✅ server.listen use karo
 const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});