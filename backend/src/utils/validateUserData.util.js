
import validator from "validator"


const validateUserData = (userData) =>{
const{firstName, lastName, email, password, age} = userData
if(!firstName){
    throw new Error("Please Enter Username");
}
if(!firstName){
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