"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, isAuthenticated, refreshToken } from "@/src/lib/auth";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

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

  const fetchTasks = async () => {
    try {
      let url = `/tasks?search=${search}`;

      if (filter !== "all") {
        url += `&status=${filter === "completed" ? "true" : "false"}`;
      }

      const res = await apiFetch(url);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch tasks"); 
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [search, filter]);

  const createTask = async () => {
    if (!title) return;

    try {
      const res = await apiFetch("/tasks", {
        method: "POST",
        body: JSON.stringify({ title }),
      });

      if (!res.ok) throw new Error();

      setTitle("");
      fetchTasks();
      toast.success("Task added successfully"); 
    } catch {
      toast.error("Failed to add task");
    }
  };

  const toggleTask = async (id: number) => {
    try {
      const res = await apiFetch(`/tasks/${id}/toggle`, {
        method: "PATCH",
      });

      if (!res.ok) throw new Error();

      fetchTasks();
      toast.success("Task updated"); 
    } catch {
      toast.error("Failed to update task");
    }
  };

  const deleteTask = async (id: number) => {
    try {
      const res = await apiFetch(`/tasks/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      fetchTasks();
      toast.success("Task deleted"); 
    } catch {
      toast.error("Failed to delete task"); 
    }
  };

  console.log("FILTER VALUE:", filter);

  return (
    <div className="p-10 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">Dashboard</h1>
      <p className="text-center mb-6">You are logged in successfully!!!</p>

      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 flex-1"
          placeholder="New task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button className="bg-green-600 text-white px-4" onClick={createTask}>
          Add
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 flex-1"
          placeholder="Search"
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="border p-3 flex justify-between items-center"
          >
            <p
              className={`${
                task.completed ? "line-through text-gray-500" : ""
              }`}
            >
              {task.title}
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => toggleTask(task.id)}
                className="text-blue-500"
              >
                Toggle
              </button>

              <button
                onClick={() => deleteTask(task.id)}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        className="mt-6 text-sm text-red-500"
        onClick={() => {
          localStorage.clear();
          toast.success("Logged out successfully"); 
          router.push("/auth/login");
        }}
      >
        Logout
      </button>
    </div>
  );
}
