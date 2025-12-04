import User from "../models/user.model.js"
import validateUserData from "../utils/validateUserData.util.js"
import dotenv from "dotenv"
dotenv.config()
const FRONTEND_URL = process.env.FRONTEND_URL
import crypto from "crypto"
import bcryptjs from "bcryptjs"
import { sendWelcomeEmail } from "../emails/emailHandler.js"
import { error } from "console"


const signup = async(req , res) =>{
    try{
    const{fullname, email, password, age} = req.body
    console.log(req.body)
    validateUserData(req.body)
    const isExisting = await User.findOne({email:email});
    if(isExisting){
        return res.status(200).json({
            message: "User Already Exist"
        })
    }
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt)
    console.log(hashedPassword);
    let accountType = "adult"
    if(age<18){
        accountType ="minor"
    }
    const verificationID = crypto.randomBytes(32).toString("hex")
    const hashedToken = crypto.createHash("sha256").update(verificationID).digest("hex"); //Im using sha256 hashing here and not bcrypt cuz bcrypt is so slow and not suitable for tokens, its used mainly for passwords.
    const user = new User({
        fullname: fullname,
        email: email,
        password: hashedPassword,
        age: age,
        accountType: accountType,
        verificationToken: hashedToken,
        verificationTokenExpiry:  Date.now() + 1000 * 60 * 60
        //Here isVerified and Auth type will be by default false and password, 
        //And i will do isVerified true later after email verification.
    })
    const verificationURL = process.env.FRONTEND_URL+`?token=${verificationID}` //I NEED TO CHANGE THIS WHILE BUILDing the frontend, VERYY IMPORTANT. 
    const savedUser = await user.save();
    res.status(201).json({
        message: "User Created, Verify through Email to get started",
        fullname: user.fullname,
        email: user.email,
        photourl: user.photoUrl,
        _id: user._id
    })
    try{
        
        sendWelcomeEmail(savedUser.email, savedUser.fullname, verificationURL )
    }
    catch(err){
        res.status(400).json({message: "Failed to send verification mail", err})
    }
    }
    catch(err){
        console.log(err)
        res.status(400).json({
            message: "Error While Signing Up",
            place: "Check signup",
            Error: err
        })
    }


 















}



export {signup}