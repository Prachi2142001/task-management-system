"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      alert("Login successful");
      router.push("/dashboard");
      
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-8">
        <h1 className="text-2xl font-semibold text-center mb-2">
          Welcome back!
        </h1>

        <p className="text-sm text-center mb-6 text-gray-500">
          Enter your credentials to access your account
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email address</label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              className="w-full mt-1 p-2 border rounded-md"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              name="password"
              type="password"
              placeholder="Enter password"
              className="w-full mt-1 p-2 border rounded-md"
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-700 text-white py-2 rounded-md hover:bg-green-800"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="text-center text-sm mt-4">
            Don’t have an account?{" "}
            <Link href="/auth/register" className="text-blue-600">
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
