import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config();
export const connectDB = async() =>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Database Connected")
    } 
    catch(err){
        console.log("Error Connecting to databsase "+ err )
        process.exit(1) //Here status code 1 means fail and 0 means success.
    }
} 