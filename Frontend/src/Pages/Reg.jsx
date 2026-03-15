import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Reg(){

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = e.target.name.value
    const email = e.target.email.value
    const password = e.target.password.value

    const response = await axios.post("https://localhost:2000/api/user/reg",{
        name,
        email,
        password
    })

    console.log("User Registered:");
    navigate("/");
  };

  return(
    <>
    <div className="min-h-screen flex items-center justify-center bg-[#0F0F0F]">

      <div className="w-full max-w-md bg-[#1A1A1A] rounded-lg shadow-lg p-8 text-white">

        <h2 className="text-2xl font-bold text-center text-white mb-6">
          Create an Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Name
            </label>

            <input
              type="text"
              name="name"
              required
              className="mt-1 w-full px-4 py-2 border border-gray-600 bg-[#0F0F0F] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#F97316]"
              placeholder="John Doe"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Email
            </label>

            <input
              type="email"
              name="email"
              required
              className="mt-1 w-full px-4 py-2 border border-gray-600 bg-[#0F0F0F] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#F97316]"
              placeholder="john@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Password
            </label>

            <input
              type="password"
              name="password"
              required
              className="mt-1 w-full px-4 py-2 border border-gray-600 bg-[#0F0F0F] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#F97316]"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#F97316] text-white py-2 rounded-md hover:bg-[#FB923C] transition duration-200"
          >
            Register
          </button>

        </form>

        <p className="text-sm text-center text-gray-400 mt-4">
          Already have an account?{" "}
          <a href="/user/log" className="text-[#F97316] hover:underline">
            Login
          </a>
        </p>

      </div>

    </div>
    </>
  )
}