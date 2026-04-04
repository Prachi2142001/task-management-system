"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!form.email) {
      newErrors.email = "Please enter a valid email";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!form.password) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Something went wrong");

      toast.success("Registration successful");
      router.push("/auth/login");
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 px-4">
      <div className="w-full max-w-md bg-white/40 backdrop-blur-lg rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">
          Register
        </h1>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div>
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              className={`w-full px-4 py-3 rounded-full border ${
                errors.name ? "border-red-500" : "border-indigo-400"
              } focus:outline-none focus:ring-2 ${
                errors.name ? "focus:ring-red-400" : "focus:ring-indigo-500"
              } bg-white/70`}
              value={form.name}
              onChange={handleChange}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <input
              name="email"
              type="text"
              placeholder="E-mail"
              className={`w-full px-4 py-3 rounded-full border ${
                errors.email ? "border-red-500" : "border-indigo-400"
              } focus:outline-none focus:ring-2 ${
                errors.email ? "focus:ring-red-400" : "focus:ring-indigo-500"
              } bg-white/70`}
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={`w-full px-4 py-3 rounded-full border ${
                errors.password ? "border-red-500" : "border-indigo-400"
              } focus:outline-none focus:ring-2 ${
                errors.password ? "focus:ring-red-500" : "focus:ring-indigo-500"
              } bg-white/70`}
              value={form.password}
              onChange={handleChange}
            />
            <span
              className="absolute right-4 top-4 text-sm cursor-pointer text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          <div className="relative">
            <input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className={`w-full px-4 py-3 rounded-full border ${
                errors.confirmPassword ? "border-red-500" : "border-indigo-400"
              } focus:outline-none focus:ring-2 ${
                errors.confirmPassword
                  ? "focus:ring-red-500"
                  : "focus:ring-indigo-500"
              } bg-white/70`}
              value={form.confirmPassword}
              onChange={handleChange}
            />

            <span
              className="absolute right-4 top-4 text-sm cursor-pointer text-gray-600"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </span>

            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div className="flex items-center text-sm text-gray-700">
            <input type="checkbox" className="mr-2" required />I agree to the
            terms & policy
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold hover:opacity-90 transition"
          >
            {loading ? "Signing up..." : "Register"}
          </button>

          <button
            type="button"
            className="w-full py-3 rounded-full bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-semibold hover:opacity-90 transition"
            onClick={() => router.push("/auth/login")}
          >
            Have account? Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
