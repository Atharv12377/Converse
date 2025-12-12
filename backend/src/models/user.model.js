import mongoose, { mongo } from "mongoose"
import validator from "validator"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true, 
        maxlength: 30, 
        trim: true
    },
    lastName:{
        type: String,
        required: true, 
        maxlength: 30, 
        trim: true
    },
    email:{
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
        validate(value){
            if(validator.isEmail(value) == false){
                throw new Error("Enter valid email address")
            }
        }
    },
    accountType: {
        type: String,
        enum:["adult", "minor"],
        default: "adult",
        trim: true
    },
    age:{
        type: Number,
        required: true,
        min: 0,
        max: 110
    },
    authType:{
        type: String,
        enum: ["password" , "oauth"],
        trim: true,
        default: "password"
    },
    photoUrl:{
        type: String,
        trim: true
    },
    password:{
        type: String,
        required: function(){
            return this.authType === "password" //This sets required true if the authTyep is password else false cuz we dont need password if we are using oAuth.
        },
        trim: true,
        select: false //This prevent mongo db from sending the password field when we access the user document UNLESS we ask for it. It hides password field from other fields. 
        //const user = await User.findOne({ email }).select("+password"); We do this when we need the password too in the response we get when we try to access the user document.
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String,
        trim: true
    },
    verificationTokenExpiry: {
        type: Date,
        default: Date.now + 1000 * 60 * 60
    }
},{
    timestamps: true
})

userSchema.methods.getJWT = function(){
try{
    const token = jwt.sign({userId: this._id}, JWT_SECRET, {expiresIn: "7d"})
    return token
}
catch(err){
    console.log(err)
    throw new Error("Error Generating JWT")
}
}

const Usermodel = mongoose.model("User", userSchema)
export default Usermodel
