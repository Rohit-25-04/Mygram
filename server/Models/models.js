import mongoose from "mongoose";
import { type } from "os";
const userschema=new mongoose.Schema({
    Fullname:String,
    Username:String,
    Email:String,
    Password:String,

})
const PostSchema=new mongoose.Schema({
    UserId:{type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    caption:String,
    image:String,
     username: { type: String, required: true }, 
     createdAt: { type: Date, default: Date.now } 
})
export const Post=mongoose.model("Post",PostSchema)
export const User=mongoose.model("User",userschema)