import { useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState("");

  return (
    <div className="min-h-screen w-full bg-linear-to-b from-white to-blue-200 flex items-center justify-center">
      <div className="w-1/3 bg-indigo-800 h-screen flex flex-col items-center justify-center text-center rounded-tr-full">
       <p className="text-2xl font-Cabin font-bold text-white ">
          Please Login To Continue
        </p>
      </div>
        <div className="w-2/3 bg-red-500 rounded-bl-full h-screen flex flex-col justify-center items-center">
          <span className="text-3xl text-white font-Cause font-extrabold mb-4">
            LogIn
          </span>
          <div className="w-full max-w-lg border-2 bg-white border-gray-500 rounded-2xl flex flex-col items-center p-3 ml-10">
            <input
              type="email"
              value={email}
              placeholder="Enter Your Email"
              className="w-full h-10 p-3 rounded-2xl border-2 border-gray-300 text-lg m-3"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />

            <div className="w-full flex justify-between relative m-3 ">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="Enter Your Password"
                className="w-full h-10 p-3 pr-12 rounded-2xl border-2 border-gray-300 text-lg"
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

            <button className="h-14 w-full text-lg p-2 rounded-3xl bg-gray-300  hover:bg-gray-600 transition-colors duration-150">
              Create Account
            </button>
            <p>
              New Here? <Link to={"/signup"}>Create An Account</Link>
            </p>
          </div>
        </div>
    </div>
  );
};
export default Login;
