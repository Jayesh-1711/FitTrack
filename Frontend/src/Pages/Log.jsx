import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Log() {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await axios.post(
        "https://fittrack-4-mlfn.onrender.com/api/user/login",
        { email, password }
      );

      localStorage.setItem("token", response.data.token);

      console.log("Logged in successfully");
      navigate("/home");

    } catch (error) {
      console.log("Login failed:", error.response?.data || error.message);
      alert("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F0F0F]">
      <form
        onSubmit={handleSubmit}
        className="bg-[#1A1A1A] p-8 rounded-xl shadow-md w-80 text-white"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        
        <div className="mb-4">
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

        
        <div className="mb-6">
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
  className="w-full py-2 rounded-lg font-semibold text-white
  bg-gradient-to-r from-orange-500 to-orange-600
  shadow-[0_0_10px_rgba(249,115,22,0.4)]
  transition-all duration-200 ease-in-out
  hover:scale-95
  hover:shadow-[0_0_20px_rgba(249,115,22,0.7)]
  active:scale-90"
>
  Login
</button>
      </form>
    </div>
  );
}