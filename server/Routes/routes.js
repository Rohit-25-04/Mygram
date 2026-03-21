import express from "express"
 import bcrypt from "bcryptjs"
 import jwt from "jsonwebtoken"
 import multer from "multer"
import { User,Post } from "../Models/models.js"
const router=express.Router()
 const auth = (req, res, next) => {
  const authheader = req.headers.authorization;
  if (!authheader) {
    return res.status(400).json({ Message: "Didnt have auth header" });
  }

  const token = authheader.split(" ")[1];
  if (!token) {
    return res.status(400).json({ Message: "Didnt have token" });
  }

  try {
    const decoded = jwt.verify(token, "Rohit@123");
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ Message: "Token expired, login again" });
    }
    return res.status(401).json({ Message: "Invalid token" });
  }
};
router.post("/signup",async(req,res)=>{
    const {Fullname,Username,Email,Password}=req.body
   const existingUser = await User.findOne({ Email });
    if(existingUser){
       return res.status(400).json({Message:"already have account"})
    }
    const password=await bcrypt.hash(Password,10)
    const newUser=new User({Fullname,Username,Email,Password:password})
    await newUser.save()
})
router.post("/login",async(req,res)=>{
    const {Username,Password}=req.body
    const user=await User.findOne({Username})
    if(!user){
       return  res.status(400).json({Message:"user do not have account"})
    }
    const  ismatch= await  bcrypt.compare(Password,user.Password)
    if(!ismatch){
      return   res.status(400).json({Message:"Incorrect Password"})
    }
    const token=jwt.sign({userId:user._id,username:user.Username},
      "Rohit@123",
      {
        expiresIn:"1h"
    })
    res.status(200).json({Message:"Login Successfull",
        token,
        user:{
            id:user._id,
            Username:user.Username,
            Fullname:user.Fullname,
            Email:user.Email
        }
    })

})
 const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB

router.post("/post", auth, upload.single("image"), async (req, res) => {
  try {
    const { caption } = req.body;

    if (!req.file) return res.status(400).json({ Message: "No image uploaded" });

    const imageBuffer = req.file.buffer; // buffer from multer

    const post = new Post({
      userId: req.user.userId,
      username: req.user.username,
      caption,
      image: imageBuffer.toString("base64") // save as string
    });

    await post.save();
    res.status(201).json({ Message: "Post created successfully ✅", post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ Message: "Server error", error: err.message });
  }
});
 router.get("/posts",auth, async (req,res)=>{
   const posts = await Post.find().sort({createdAt:-1});
   res.status(200).json({posts});
})
router.get("/user/:id",auth,async(req,res)=>{
   try {
    const users=await User.find({
       _id: { $ne: req.params.id }  
    })
    res.json(users)

   } catch (err) {
    console.log(err)
   }

}) 
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
})
export default router