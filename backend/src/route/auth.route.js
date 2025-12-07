import express from "express"
const authRouter = express.Router()
import { signup, verify, login} from "../controller/auth.controller.js";

authRouter.post("/signup", signup)
authRouter.post("/verify", verify)
authRouter.post("/login", login)
 
export default authRouter