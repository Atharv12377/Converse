import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const HandleSignUp = async () => {
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/signup`, {
        firstName,
        lastName,
        email,
        password,
        age,
      });

      if (res.status === 201) {
        setSuccess(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (success) {
    return (
      <div className="flex h-screen justify-center items-center bg-linear-to-b from-white to-blue-200">
        <div className="text-center px-4">
          <p className="text-3xl md:text-5xl font-serif font-semibold text-gray-800">
            Please verify your email
          </p>
          <p className="mt-3 text-gray-600">
            We’ve sent you a verification link.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-linear-to-b from-white to-blue-200 flex items-center justify-center">
      
   
      <div className="hidden md:flex md:w-1/3 h-screen bg-red-500 shadow-2xl flex-col items-center justify-center text-center rounded-tr-full px-6">
        <p className="text-5xl lg:text-6xl font-Cabin font-bold text-white">
          WELCOME,
        </p>
        <p className="mt-2 text-xl lg:text-2xl font-Cabin font-semibold text-white">
          Create your account to get started
        </p>
      </div>

     
      <div className="w-full md:w-2/3 h-screen bg-indigo-800 shadow-2xl rounded-none md:rounded-bl-full flex flex-col justify-center items-center px-4">
        
        <span className="text-3xl text-white font-Cause font-extrabold mb-6">
          Sign Up
        </span>

       
        <div className="w-full max-w-md bg-white/90 backdrop-blur-md border border-gray-300 rounded-2xl p-6 space-y-4">
          
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            className="w-full h-11 px-4 rounded-xl border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
            onChange={(e) => setFirstName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            className="w-full h-11 px-4 rounded-xl border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
            onChange={(e) => setLastName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            className="w-full h-11 px-4 rounded-xl border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
            onChange={(e) => setEmail(e.target.value)}
          />

          
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              className="w-full h-11 px-4 pr-14 rounded-xl border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-800"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <input
            type="number"
            placeholder="Age"
            value={age}
            className="w-full h-11 px-4 rounded-xl border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
            onChange={(e) => setAge(Number(e.target.value))}
          />

          <button
            onClick={HandleSignUp}
            className="h-12 w-full rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all duration-200"
          >
            Create Account
          </button>

          <p className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
