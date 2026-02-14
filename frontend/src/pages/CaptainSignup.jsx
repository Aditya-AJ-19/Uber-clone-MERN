import React, { useState } from "react";
import { Link } from "react-router-dom";

const CaptainSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [vehicleColor, setVehicleColor] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleCapacity, setVehicleCapacity] = useState("");
  const [vehicleType, setVehicleType] = useState("");

  const [captainData, setCaptainData] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCaptain = {
      fullname: {
        firstname: firstName,
        lastname: lastName,
      },
      email: email,
      password: password,
      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: vehicleCapacity,
        vehicleType: vehicleType,
      },
    };

    setCaptainData(newCaptain);
    console.log(newCaptain);

    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setVehicleColor("");
    setVehiclePlate("");
    setVehicleCapacity("");
    setVehicleType("");
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
              What's our Captain's name
            </label>
            <div className="flex gap-4 mb-5">
              <input
                required
                className="bg-[#EEEEEE] w-1/2 rounded-lg px-4 py-2 border text-base placeholder:text-sm"
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                required
                className="bg-[#EEEEEE] w-1/2 rounded-lg px-4 py-2 border text-base placeholder:text-sm"
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <label className="text-base font-medium mb-2">
              What's our Captain's email
            </label>
            <input
              required
              className="bg-[#EEEEEE] mb-5 rounded-lg px-4 py-2 border w-full text-base placeholder:text-sm"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label className="text-base font-medium mb-2">Enter Password</label>
            <input
              className="bg-[#EEEEEE] mb-5 rounded-lg px-4 py-2 border w-full text-base placeholder:text-sm"
              required
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* <label className="text-base font-medium mb-2">
            Vehicle Information
          </label>
          <div className="flex gap-4 mb-5">
            <input
              required
              className="bg-[#EEEEEE] w-1/2 rounded-lg px-4 py-2 border text-base placeholder:text-sm"
              type="text"
              placeholder="Vehicle Color"
              value={vehicleColor}
              onChange={(e) => setVehicleColor(e.target.value)}
            />
            <input
              required
              className="bg-[#EEEEEE] w-1/2 rounded-lg px-4 py-2 border text-base placeholder:text-sm"
              type="text"
              placeholder="Vehicle Plate"
              value={vehiclePlate}
              onChange={(e) => setVehiclePlate(e.target.value)}
            />
          </div> */}
          {/* <div className="flex gap-4 mb-5">
            <input
              required
              className="bg-[#EEEEEE] w-1/2 rounded-lg px-4 py-2 border text-base placeholder:text-sm"
              type="number"
              placeholder="Vehicle Capacity"
              value={vehicleCapacity}
              onChange={(e) => setVehicleCapacity(e.target.value)}
            />
            <select
              required
              className="bg-[#EEEEEE] w-1/2 rounded-lg px-4 py-2 border text-base placeholder:text-sm"
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
            >
              <option className="text-xs" value="" disabled>
                Select Vehicle Type
              </option>
              <option className="text-xs" value="car">
                Car
              </option>
              <option className="text-xs" value="motorcycle">
                Motorcycle
              </option>
              <option className="text-xs" value="auto">
                Auto
              </option>
            </select>
          </div> */}

          <button className="bg-[#111111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-base placeholder:text-sm">
            Create Captain Account
          </button>
        </form>
        <p className="text-center">
          Already have an account?{" "}
          <Link to="/captain-login" className="text-blue-600">
            Login here
          </Link>
        </p>
      </div>
      <div>
        <p className="text-[10px] mt-6 leading-tight">
          This site is protected by reCAPTCHA and the{" "}
          <span className="underline">Google Privacy Policy</span> and{" "}
          <span className="underline">Terms of Service apply</span>.
        </p>
      </div>
    </div>
  );
};

export default CaptainSignup;
