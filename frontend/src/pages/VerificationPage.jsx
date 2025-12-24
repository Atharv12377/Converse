import React from "react";
import { useSearchParams } from "react-router-dom";


function VerificationPage() {
    
    const [searchparams] = useSearchParams()
    const token = searchparams.get('token')
    console.log(token)


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
