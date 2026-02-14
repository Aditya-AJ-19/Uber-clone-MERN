import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <div className="bg-cover bg-bottom bg-[url('https://plus.unsplash.com/premium_photo-1737083053903-b7c9a38fc496?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] h-screen w-full pt-8 flex justify-between flex-col ">
        <img
          className="w-20 ml-8"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt="logo"
        />
        <div className="bg-white py-5 px-4 pb-7">
          <h2 className="text-3xl font-bold">Get started with Uber</h2>
          <Link
            className="flex justify-center items-center w-full bg-black text-white py-3 mt-5 rounded"
            to="/login"
          >
            Continue
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
