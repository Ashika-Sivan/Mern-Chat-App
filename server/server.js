import express from 'express'
import "dotenv/config"
import cors from "cors"
import http from "http"
import { connectDB } from './lib/db.js'
import userRouter from './routes/userRoutes.js'
import messageRouter from './routes/messageRoutes.js'
import { Server } from 'socket.io'

//express
const app=express()
const server=http.createServer(app)

//initializze socketio server

export const io=new Server(server,{
    cors:{origin:'*'}
})

//store online user

export const userSocketMap={}//{userId:socketId}

//socket.io connection hanlder
io.on("connection",(socket)=>{
    const userId=socket.handshake.query.userId
    console.log('user connnected',userId)


    if(userId){
        userSocketMap[userId]=socket.id
    }

    // emit online user for all connected cliend

    io.emit("getOnlineUsers",Object.keys(userSocketMap))

    socket.on('disconnet',()=>{
        console.log('user disconnected',userId);
        delete userSocketMap[userId]
        io.emit('getOnlineUsers',Object.keys(userSocketMap))
        
    })
})


//middleware
app.use(express.json({limit:"4mb"}))
app.use(cors())
app.use("/api/messages",messageRouter)



app.use("/api/status",(req,res)=>res.send('server is live'));
app.use("/api/auth",userRouter);

await connectDB()

const PORT=process.env.PORT||5000
server.listen(PORT,()=>{
    console.log(`server is running on http://localhost:${PORT}`);
    
})