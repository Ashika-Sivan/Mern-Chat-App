import { Children } from "react";
import { createContext } from "react";
import axios from 'axios'
import { useState } from "react";
import {toast} from "react-hot-toast";
import { useEffect } from "react";
import {io} from 'socket.io-client'



const backendUrl=import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL=backendUrl
export const AuthContext=createContext()

export const AuthProvider=({Children})=>{
    const [token,setToken]=useState(localStorage.getItem("token"))
    const [authUser,setAuthUser]=useState(null)
    const [onlineUsers,setOnlineUsers]=useState(null)
    const [socket,setSocket]=useState(null)

    //check if the user is authenticated and if so set the user data and connect the socket

    const checkAuth=async()=>{
        try {
            const {data}=await axios.get("/api/auth/check")
            if(data.success){
                setAuthUser(data.user)
            }

            
        } catch (error) {
            toast.error(error.message)

            
        }
    }

    //connect socket fro handle connecrion and user updates
    const connectSocket=(userData)=>{
        if(!userData || socket?.connected) return 
        const newSocket=io(backendUrl,{
            query:{
                userId:userData._id,
            }
        });
        newSocket.connect()
        setSocket(newSocket)

        newSocket.on("getOnlineUsers")

    }

    useEffect(()=>{
        if(token){
            axios.defaults.headers.common["token"]=token;
        }
        checkAuth()

    },[])
    const value={
        axios,
        authUser,
        onlineUser,
        socket
    }
    return (
        <AuthContext.Provider value={value}>
            {Children}
        </AuthContext.Provider>
    )
}
