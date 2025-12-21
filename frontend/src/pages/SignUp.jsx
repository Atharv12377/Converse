const SignUp = () =>{
    



    return(
        <div className="h-screen w-screen bg-blue-950 flex items-center justify-center">

            <div className="h-1/2 w-1/4 bg-teal-300 rounded-2xl flex-col">
            <p className="h-17 w-full p-3 border-b-2 text-3xl font-bold">SignUp</p>
            <input type="text" placeholder="Enter Your First Name" />
            <input type="text" placeholder="Enter Your Last Name" />
            <input type="text" placeholder="Enter Your Email" />
            <input type="text" placeholder="Enter Your Password"/>
            </div>
        </div>
    )
}
export default SignUp