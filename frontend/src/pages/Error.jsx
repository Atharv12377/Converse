import React from "react";
import FuzzyText from "../components/FuzzyText";
import { useLocation } from "react-router-dom";

function Error() {
  const errorLocation = useLocation();
  const { state } = errorLocation;

  console.log(state);
  return (
    <div className="h-screen w-full min-w-md flex justify-center items-center bg-black  ">
      <div className="h-screen w-full flex flex-col justify-center items-center bg-black gap-4">
        <FuzzyText baseIntensity={0.2} hoverIntensity={0.5} enableHover>
          Status: {state?.status}
        </FuzzyText>
        <div className="text-white text-4xl">
            {state?.message || "Something went wrong"}
        </div>

        
      </div>
    </div>
  );
}

export default Error;
