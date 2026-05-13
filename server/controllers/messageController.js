

//get all user except loggedin user

import Message from "../models/message.js";
import cloudinary from "../lib/cloudinary.js";
import { io } from "../server.js";//by using the socket.io user can instantly
import { userSocketMap } from "../server.js";


export const getUsersForSidebar=async(req,res)=>{
    try {
        const userId=req.user._id;
        const filteredUser=await User.find({_id:{$ne:userId}}).select("-password");


        //count number of message not seen
        const unseenMessages={}
        const promises=filteredUser.map(async (user)=>{
            const messages=await Message.find({senderId:user._id,recieverId:userId,seen:false})
            if(messages.length>0){
                unseenMessages[user._id]=messages.length;
            }
        })

        await Promise.all(promises);
        res.json({success:true,users:filteredUser,unseenMessages})
        
    } catch (error) {
        console.log(error.messages);
        res.json({success:false,message:error.message})
        
        
    }
}
//get all msg for selected user

export const getMessages=async(req,res)=>{

    try {

        const {id:selectedUserId}=req.params
        const myId=req.user._id


        const messages=await Message.find({
            $or:[
                {senderId:myId,recieverId:selectedUserId},
                {senderId:selectedUserId,recieverId:myId},
            ]
        })
        
    } catch (error) {
        console.log(error.message)
        res.json({success:false,message:error.message})
        
    }
}

//api to make message as seen unsing message.is

export const markMessageAsSeen=async(req,res)=>{
    try {
        const {id}=req.params
        await Message.findByIdAndUpdate(id,{seen:true})
        res.json({success:true})

        
    } catch (error) {
         console.log(error.message)
        res.json({success:false,message:error.message})
        
        
    }
}

//send message to selected user
export const sendMessage=async(req,res)=>{
    try{
        const {text,image}=req.body
        const receiverId=req.params.id
        const senderId=req.user._id

        let imageUrl;
        if(image){
            const uploadResponse=await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url 
        }

        const newMessage=await Message.create({senderId,receiverId,text,image:imageUrl})//save data in database

        //emit new msg to reciver socket
        const recieverSocketId=userSocketMap[receiverId]

        if(recieverSocketId){
            io.to(recieverSocketId).emit("newMessage")
        }

        res.json({success:true,message:'new message'})
        

    }catch{
         console.log(error.message)
        res.json({success:false,message:error.message})

    }
}

//message recieved in real time