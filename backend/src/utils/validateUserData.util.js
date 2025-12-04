
import validator from "validator"


const validateUserData = (userData) =>{
const{fullname, email, password, age} = userData
if(!fullname){
    throw new Error("Please Enter Username");
}
if(!email){
    throw new Error("Please Enter Email");
}
if(!password){
    throw new Error("Please Enter Password");
}
if(validator.isStrongPassword(password) === false){
    throw new Error("Please Enter Valid Password");
}
if(!age){
    throw new Error("Please Enter The Correct Age");
}
} 
export default validateUserData