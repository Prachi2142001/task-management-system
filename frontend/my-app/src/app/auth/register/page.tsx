"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      alert("Registered successfully");
      router.push("/auth/login");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className=" p-8 ">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Get Started Now
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <input
              name="name"
              type="text"
              placeholder="Enter your name"
              className="w-full mt-1 p-2 border rounded-md"
              onChange={handleChange}
              required
            />
          </div>

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

          <div className="flex items-center text-sm">
            <input type="checkbox" className="mr-2" required />I agree to the
            terms & policy
          </div>

          <button
            type="submit"
            className="w-full bg-green-700 text-white py-2 rounded-md hover:bg-green-800"
          >
            {loading ? "Signing up..." : "Signup"}
          </button>

          <div className="text-center text-sm mt-4">
            Have an account?{" "}
            <Link href="/auth/login" className="text-blue-600">
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
