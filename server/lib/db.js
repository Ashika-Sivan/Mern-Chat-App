import mongoose from "mongoose"

export const connectDB=async()=>{
    try {

        mongoose.connection.on('connected',()=>console.log('Database connected')
        )
        await mongoose.connect(process.env.MONGODB_URI)
        
    } catch (error) {
         console.error("MongoDB connection failed:", error.message);
        process.exit(1); 
        
        
    }
}



