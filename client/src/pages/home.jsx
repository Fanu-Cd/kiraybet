import React from "react";
import { Button } from "antd";
import { Link, useLoaderData } from "react-router-dom";
const Home = () => {
  const data = useLoaderData();
  console.log("data", data);

  return (
    <div className="font-bold text-2xl text-center mt-10">
      WAIT FOR THE LANDING PAGE!
      <br />
      FOR NOW,
      <br />
      <Link to={"/session/login"}>
        <Button type="primary" className="mt-10">
          Log In
        </Button>
      </Link>
    </div>
  );
};

export default Home;
