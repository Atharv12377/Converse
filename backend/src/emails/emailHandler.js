
import {resendClient, sender} from "../lib/resend.js"
import { createVerificationEmailTemplate } from "./emailTemplates.js"
export const sendWelcomeEmail = async(email, name, verificationURL) =>{
    console.log(email)
    const {data, error} = await resendClient.emails.send({
        from: `${sender.name} <${sender.email}>`,
        to: email,
        subject: "Verify To Get Started",
        html: createVerificationEmailTemplate(name, verificationURL)
    })
    if(error){
        console.log("Error Sending Verification Email");
        throw new Error("Failed to send verification email");
    }
    console.log("Verifcation Email Sent Successfully")
}
