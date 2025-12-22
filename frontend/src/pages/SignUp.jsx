const SignUp = () =>{
    



    return(
        <div className="min-h-screen w-full bg-linear-to-b from-white to-blue-200  flex items-center justify-center ">
            <div className="w-1/3 bg-red-500 h-screen flex flex-col items-center justify-center text-center rounded-tr-full">
            <p className="text-6xl font-Cabin font-bold text-white">WELCOME,</p>
            <p className="text-2xl font-Cabin font-bold text-white">Please Create Your Account To Get Started</p>
            </div>
            <div className="w-2/3 bg-indigo-800 rounded-bl-full h-screen flex flex-col justify-center items-center">
             <span className="text-3xl text-white font-Cause font-extrabold mb-4">SignUp</span>
              <div className="w-full max-w-lg border-2 bg-white border-gray-500 rounded-2xl flex flex-col items-center p-3 ml-10">
            <input type="text" placeholder="Enter Your First Name" className="w-full h-10 p-3 rounded-2xl border-2 border-gray-300 text-lg m-3" />

            <input type="text" placeholder="Enter Your Last Name" className="w-full h-10 p-3 rounded-2xl border-2 border-gray-300 text-lg m-3" />
            <input type="email" placeholder="Enter Your Email" className="w-full h-10 p-3 rounded-2xl border-2 border-gray-300 text-lg m-3" />
            <input type="password" placeholder="Enter Your Password" className="w-full h-10 p-3 rounded-2xl border-2 border-gray-300 text-lg m-3" />
            <input type="number" name="" id="" placeholder="Enter Your Age " className="w-full h-10 p-3 rounded-2xl border-2 border-gray-300 text-lg m-3"/>
            <button className="h-14 w-full text-lg p-2 rounded-3xl bg-gray-300  hover:bg-gray-600 transition-colors duration-150">Create Account</button>
            </div>    
            </div>
          
        </div>
    )
}
export default SignUp