import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      setLoading(true);

      await axios.post(
        "https://fittrack-4-mlfn.onrender.com/api/user/register",
        { name, email, password }
      );

      alert("Registered successfully 🎉");
      navigate("/login");

    } catch (error) {
      console.log(error.response?.data || error.message);
      alert("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A0A0A] via-[#111111] to-[#1A1A1A] px-4">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-[#1A1A1A]/80 backdrop-blur-xl border border-[#2A2A2A] p-6 rounded-2xl shadow-lg"
      >

        {/* TITLE */}
        <h2 className="text-3xl font-bold text-center text-white mb-1">
          Create Account 🚀
        </h2>
        <p className="text-center text-gray-400 text-sm mb-6">
          Start your fitness journey
        </p>

        {/* NAME */}
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            required
            placeholder="John Doe"
            className="w-full px-4 py-2 rounded-lg bg-[#0F0F0F] border border-[#2A2A2A] text-white focus:outline-none focus:ring-2 focus:ring-[#F97316]"
          />
        </div>

        {/* EMAIL */}
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            placeholder="john@example.com"
            className="w-full px-4 py-2 rounded-lg bg-[#0F0F0F] border border-[#2A2A2A] text-white focus:outline-none focus:ring-2 focus:ring-[#F97316]"
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-5">
          <label className="block text-sm text-gray-400 mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            required
            placeholder="••••••••"
            className="w-full px-4 py-2 rounded-lg bg-[#0F0F0F] border border-[#2A2A2A] text-white focus:outline-none focus:ring-2 focus:ring-[#F97316]"
          />
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="relative w-full py-2 rounded-lg font-semibold text-white overflow-hidden
          bg-gradient-to-r from-orange-500 to-orange-600
          transition-all duration-200
          hover:scale-95 active:scale-90
          disabled:opacity-70"
        >

          {/* RIPPLE */}
          <span className="absolute inset-0 overflow-hidden rounded-lg">
            <span className="absolute inset-0 bg-white opacity-0 active:opacity-20 active:animate-ping"></span>
          </span>

          {/* CONTENT */}
          <span className="relative flex items-center justify-center gap-2">

            {loading && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}

            {loading ? "Creating..." : "Register"}

          </span>

        </button>

        {/* LOGIN LINK */}
        <p className="text-center text-gray-400 text-sm mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/user/log")}
            className="text-orange-400 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>

      </form>
    </div>
  );
}