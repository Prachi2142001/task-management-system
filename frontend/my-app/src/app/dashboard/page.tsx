"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, refreshToken } from "@/src/lib/auth";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/auth/login");
    }
  }, []);
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const refresh = localStorage.getItem("refreshToken");

    if (!token && refresh) {
      refreshToken();
    }
  }, []);

  return (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>You are logged in successfully!!!</p>
    </div>
  );
}
