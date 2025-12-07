import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import User from "../models/user.model.js"

dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET
export const Auth = async(req,res,next) =>{
    try{
        const token = req.cookies.jwt;
        
        if(!token){
            return res.status(400).json({
                message: "Authentication Time Out, Please Login Again",
            })
        }
        const {userId} = jwt.verify(token,JWT_SECRET);
        
        if(!userId){
            throw new Error("Error In Authentication: Missing ID");
        }
        const user =await User.findById({_id:userId});
        if(!user){
            throw new Error("No User Exist");
        }
        req.user = user
        next()
    }
    catch(err){ 
        res.status(400).json({
            message: "Error Authenticating Please Login Again", 
            error: err.message
        })
    }
} 