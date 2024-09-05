import React from "react";
import { useLoaderData } from "react-router-dom";
const Home = () => {
  const data = useLoaderData();
  console.log("data", data);

  return (
    <div className="font-bold text-2xl text-center mt-10">
      WAIT FOR THE LANDING PAGE!
      
    </div>
  );
};

export default Home;
