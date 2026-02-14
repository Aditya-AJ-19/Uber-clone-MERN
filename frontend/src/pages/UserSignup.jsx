import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

const UserSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [userData, setUserData] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email, password);
    setUserData({ fullname: { firstname, lastname }, email, password });

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
            <label className="text-base font-medium mb-2">
              What's Your Name
            </label>
            <div className="flex gap-4 mb-5">
              <input
                className="bg-[#EEEEEE] rounded px-4 py-2 border w-1/2 text-base placeholder:text-sm"
                type="text"
                id="firstname"
                name="firstname"
                placeholder="First Name"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
              />
              <input
                className="bg-[#EEEEEE] rounded px-4 py-2 border w-1/2 text-base placeholder:text-sm"
                type="text"
                id="lastname"
                name="lastname"
                placeholder="Last Name"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
              />
            </div>
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
            Sign up
          </button>
          <p className="text-center text-sm text-[#111111]">
            Already have an account?{" "}
            <Link className="text-blue-600 cursor-pointer" to="/login">
              Login here
            </Link>
          </p>
        </form>
      </div>
      <p className="text-[10px] leading-tight">
        By proceeding, you consent to get calls, WhatsApp or SMS messages,
        including by automated means, from Uber and its affiliates to the number
        provided.
      </p>
    </div>
  );
};

export default UserSignup;
