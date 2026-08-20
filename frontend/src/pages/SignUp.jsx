import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  const HandleSignUp = async () => {
    setError("");
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/signup`, {
        firstName,
        lastName,
        email,
        password,
        age,
      });

      if (res.status === 201) {
        setToast("✅ Account created! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2500);
      }
    } catch (error) {
      console.log(error);
      const msg = error?.response?.data?.Error?.message
        || error?.response?.data?.message
        || "Something went wrong. Please try again.";
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen w-full bg-linear-to-b from-white to-blue-200 flex items-center justify-center">

      {/* Toast notification */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg font-medium text-sm animate-bounce">
          {toast}
        </div>
      )}


      <div className="hidden md:flex md:w-1/3 h-screen bg-gradient-to-br from-red-500 to-red-600 shadow-2xl flex-col items-center justify-center text-center rounded-tr-full px-6">
        <p className="text-5xl lg:text-6xl font-Cabin font-bold text-white drop-shadow-md">
          WELCOME,
        </p>
        <p className="mt-2 text-xl lg:text-2xl font-Cabin font-semibold text-white/90 drop-shadow-sm">
          Create your account to get started
        </p>
      </div>


      <div className="w-full md:w-2/3 h-screen bg-gradient-to-br from-indigo-700 to-indigo-900 shadow-2xl rounded-none md:rounded-bl-full flex flex-col justify-center items-center px-4">

        <span className="text-3xl text-white font-Cause font-extrabold mb-6 drop-shadow-lg">
          Sign Up
        </span>


        <div className="w-full max-w-md bg-white/95 backdrop-blur-lg border border-white/50 rounded-2xl p-6 space-y-4 shadow-xl">

          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            className="w-full h-11 px-4 rounded-xl border border-gray-200 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-200 hover:border-gray-400"
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
              className="w-full h-11 px-4 pr-14 rounded-xl border border-gray-200 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-200 hover:border-gray-400"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-indigo-600 transition-colors duration-200"
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
            className="h-12 w-full rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 hover:shadow-lg active:scale-[0.98] transition-all duration-200"
          >
            Create Account
          </button>

          {error && (
            <p className="text-sm text-center text-red-500 font-medium">{error}</p>
          )}

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
