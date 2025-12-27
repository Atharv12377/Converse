  import React, { useEffect } from "react";
  import { useSearchParams } from "react-router-dom";
  import axios from "axios";
  import { useNavigate } from "react-router-dom";
  import Error from "./Error";

  function VerificationPage() {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();
    const [searchparams] = useSearchParams();
    const token = searchparams.get("token");
    console.log(token);
    const handleVerify = async () => {
      try {
        const res = await axios.post(`${BACKEND_URL}/auth/verify`, {
          token,
        });
        if (res.status === 200) {
          navigate("/login");
        }
      } catch (error) {
        navigate("/error", {
          state: {
            message: error.response?.data?.message || "Verification failed",
            status: error.response?.status || 500,
          },  
        });
        console.log(error);
      }
    };

    useEffect(() => {
      handleVerify();
    }, []);

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-slate-200 rounded-full"></div>
          <div className="absolute w-12 h-12 border-4 border-t-red-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>

        <p className="mt-4 text-slate-600 font-medium animate-pulse">
          Verifying your account...
        </p>
      </div>
    );
  }

  export default VerificationPage;
