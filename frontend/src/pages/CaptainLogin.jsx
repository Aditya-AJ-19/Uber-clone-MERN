import React, { useState } from "react";
import { Link } from "react-router-dom";

const CaptainLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captainData, setCaptainData] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email, password);
    setCaptainData({ email, password });

    setEmail("");
    setPassword("");
  };
  return (
    <div className="p-7 h-screen flex justify-between flex-col">
      <div>
        <img
          className="w-20 mb-10"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt="logo"
        />
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label className="text-base font-medium mb-2" htmlFor="email">
              What's Your Email
            </label>
            <input
              className="bg-[#EEEEEE] mb-5 rounded px-4 py-2 border w-full text-base placeholder:text-sm"
              type="email"
              id="email"
              name="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-base font-medium mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="bg-[#EEEEEE] mb-5 rounded px-4 py-2 border w-full text-base placeholder:text-sm"
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            className="bg-[#111111] text-white font-semibold rounded px-4 py-2 w-full text-lg mb-2"
            type="submit"
          >
            Login
          </button>
          <p className="text-center text-sm text-[#111111]">
            Join a Fleet?{" "}
            <Link className="text-blue-600 cursor-pointer" to="/captain-signup">
              Register as Captain
            </Link>
          </p>
        </form>
      </div>
      <div>
        <Link
          className="bg-[#fc9403] flex justify-center items-center text-white font-semibold rounded px-4 py-2 text-lg mb-2"
          to="/login"
        >
          Sign up as User
        </Link>
      </div>
    </div>
  );
};

export default CaptainLogin;
