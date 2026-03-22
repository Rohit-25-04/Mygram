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
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import router from "./Routes/routes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json())

// CORS for REST APIs
app.use(cors({
  origin: "https://mygram-88p6.vercel.app",
  credentials: true,
}));
 mongoose.connect(process.env.MONGO_URI).then(()=>console.log("mongo atlas is connected"))

 app.use("/",router)

const server = createServer(app);

// Socket.IO with proper CORS
const io = new Server(server, {
  cors: {
    origin: "https://mygram-88p6.vercel.app",
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ["polling"] 
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_room", (roomId) => {
    socket.join(roomId);
  });

  socket.on("send_message", (data) => {
    io.to(data.roomId).emit("receive_message", data);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on ${PORT}`));