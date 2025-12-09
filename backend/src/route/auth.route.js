import express from "express"
const authRouter = express.Router()
import { signup, verify, login} from "../controller/auth.controller.js";
import { arcjetProtection } from "../middlewares/arcjet.middleware.js";

authRouter.post("/signup", arcjetProtection,signup)
authRouter.post("/verify", verify)
authRouter.post("/login",arcjetProtection, login)
 
export default authRouter