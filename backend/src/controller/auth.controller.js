import User from "../models/user.model.js";
import validateUserData from "../utils/validateUserData.util.js";
import dotenv from "dotenv";
dotenv.config();
const FRONTEND_URL = process.env.FRONTEND_URL;
import crypto from "crypto";
import bcryptjs from "bcryptjs";
import validator from "validator";
import sendEmail from "../emails/sendEmail.js";
import { createVerificationEmailTemplate } from "../emails/emailTemplates.js";

const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, age } = req.body;
    console.log(req.body);
    validateUserData(req.body);
    const isExisting = await User.findOne({ email: email });
    if (isExisting) {
      return res.status(200).json({
        message: "User Already Exist",
      });
    }
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    console.log(hashedPassword);
    let accountType = "adult";
    if (age < 18) {
      accountType = "minor";
    }
    const verificationID = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(verificationID)
      .digest("hex"); //Im using sha256 hashing here and not bcrypt cuz bcrypt is so slow and not suitable for tokens, its used mainly for passwords.
    const user = new User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
      age: age,
      accountType: accountType,
      verificationToken: hashedToken,
      verificationTokenExpiry: Date.now() + 1000 * 60 * 60,
      //Here isVerified and Auth type will be by default false and password,
      //And i will do isVerified true later after email verification.
    });
    const verificationURL = `${FRONTEND_URL}/verify?token=${verificationID}`; //I NEED TO CHANGE THIS WHILE BUILDing the frontend, VERYY IMPORTANT.
    const emailHTML = createVerificationEmailTemplate(
      user.firstName,
      verificationURL
    );
    const savedUser = await user.save();
    res.status(201).json({
      message: "User Created, Verify through Email to get started",
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      photourl: user.photoUrl,
      _id: user._id,
      verificationToken: verificationID
    });

    try {
      await sendEmail(savedUser.email, "Verify Your Email Address", emailHTML);
    } catch (emailErr) {
      console.error("Failed to send verification email:", emailErr);
      return res.status(500).json({
        message: "User created, but failed to send verification email",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "Error While Signing Up",
      place: "Check signup",
      Error: err,
    });
  }
};

const verify = async (req, res) => {
  try {
    //Here currently im using the local host link which has the token in the query, but itll be changed to the frontend link after deployment and ill need to use request body then.
    const recievedToken = req.body.token || req.query.token;
    if (!recievedToken) {
      return res.status(400).json({
        message: "Verification Token not found",
      });
    }
    //console.log(recievedToken)
    const recievedHashedToken = crypto
      .createHash("sha256")
      .update(recievedToken)
      .digest("hex");
    //console.log(recievedHashedToken)
    const unverifiedUser = await User.findOne({
      verificationToken: recievedHashedToken,
      verificationTokenExpiry: { $gte: Date.now() },
    });
    if (!unverifiedUser) {
      return res.status(400).json({
        message: "Verification Token Expired lolz, Try Again",
      });
    }
    unverifiedUser.isVerified = true;
    unverifiedUser.verificationToken = undefined;
    unverifiedUser.verificationTokenExpiry = undefined;

    await unverifiedUser.save();
    // We can also redirect to login directly.
    res.status(200).json({
      message: "User Verified Successfully Proceed to Log In",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "Error Occured while Email Verification",
      Error: err,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Email And Password are required",
      });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        message: "Enter Valid EmailId",
      });
    }
    // password has select: false in the schema, thats why we needed to explicitly include it here
    const user = await User.findOne({ email: email }).select("+password");
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }
   // console.log(user.password);
    const isValidPassword = await bcryptjs.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({
        message: "Incorrect Credentials",
      });
    }
    if (user.isVerified === false) {
      return res.status(400).json({
        message: "Verify Your Email Address To Log In",
      });
    }
    
    const token = user.getJWT();
    if (!token) {
      throw new Error("Error Generating JWT");
    }
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true, //This will prevent XSS attacks -> Need to learn this
      sameSite: "strict", //CSRF attacks prevented
      // secure: process.env.NODE_ENV === "development" ? false : true,
    });
    console.log(user._id)
    res.json({
      message: "Login Successfull",
      user: {
        userId : user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        authType: user.authType,
        isVerified: user.isVerified,
        photoUrl: user.photoUrl
      },
      token: {
        token,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "Error While logging in",
      error: err.message,
    });
  }
};
export const logout = (req, res) => {
  try { 
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "strict",
    });

    res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error logging out",
      error: error.message,
    });
  }
};

export { signup, verify, login };
