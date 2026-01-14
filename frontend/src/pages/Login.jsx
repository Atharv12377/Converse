import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios"
import useAuthStore from "../store/useAuthStore.js"
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
  const login = useAuthStore((state) => state.login)
  const [error, setError] = useState("")
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/login`, {
        email,
        password
      }, { withCredentials: true })
      setError("")
      console.log(res);
      console.log(res.data)
      login({
        user: res.data.user,
        token: res.data.token
      })
      if (res.status === 200) {
        navigate("/")
      }
    } catch (error) {
      setError(error.response.data.message)
      console.log(error)
    }

  }

  return (
    <div className="min-h-screen w-full bg-linear-to-b from-white to-blue-200 flex items-center justify-center">

      <div className="hidden md:flex md:w-1/3 h-screen bg-gradient-to-br from-red-500 to-red-600 shadow-2xl flex flex-col items-center justify-center text-center rounded-tr-full px-6">
        <p className="text-2xl lg:text-3xl font-Cabin font-bold text-white drop-shadow-md">
          Please login to continue
        </p>
      </div>

      <div className="w-full md:w-2/3 h-screen bg-gradient-to-br from-indigo-700 to-indigo-900 shadow-2xl rounded-none md:rounded-bl-full flex flex-col justify-center items-center px-4">

        <span className="text-3xl text-white font-Cause font-extrabold mb-6 drop-shadow-lg">
          Log In
        </span>

        <div className="w-full max-w-md bg-white/95 backdrop-blur-lg border border-white/50 rounded-2xl p-6 space-y-4 shadow-xl">

          <input
            type="email"
            placeholder="Email"
            value={email}
            className="w-full h-11 px-4 rounded-xl border border-gray-200 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-200 hover:border-gray-400"
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

          <button
            className="h-12 w-full rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 hover:shadow-lg active:scale-[0.98] transition-all duration-200"
            onClick={() => {
              handleLogin();
            }}
          >
            Log In
          </button>

          <p className="text-sm text-center text-gray-600">
            New here?{" "}
            <Link
              to="/signup"
              className="text-indigo-800 font-semibold hover:underline"
            >
              Create an account
            </Link>
          </p>
          {error && <p className="text-sm text-center text-red-500 animate-pulse">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Login;
