"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, isAuthenticated, refreshToken } from "@/src/lib/auth";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");

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
      let url = `/tasks?page=${page}&limit=5&search=${search}`;

      if (filter === "completed") {
        url += `&status=true`;
      } else if (filter === "pending") {
        url += `&status=false`;
      }

      const res = await apiFetch(url);
      const data = await res.json();

      setTasks(data.tasks);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [search, filter, page]);

  useEffect(() => {
    setPage(1);
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

      await fetchTasks();
      toast.success("Task updated");
    } catch {
      toast.error("Failed to update task");
    }
  };

  const updateTask = async (id: number) => {
    try {
      const res = await apiFetch(`/tasks/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ title: editTitle }),
      });

      if (!res.ok) throw new Error();

      toast.success("Task updated");
      setEditingId(null);
      setEditTitle("");
      fetchTasks();
    } catch {
      toast.error("Update failed");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 px-4 sm:px-8 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Task Dashboard</h1>
          <p className="text-gray-600 mt-1">Organize and manage your tasks</p>
        </div>

        <button
          className="mt-3 sm:mt-0 px-5 py-2 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-medium hover:opacity-90 transition"
          onClick={() => {
            localStorage.clear();
            toast.success("Logged out successfully");
            router.push("/auth/login");
          }}
        >
          Logout
        </button>
      </div>

      <div className="bg-white/40 backdrop-blur-lg p-4 rounded-xl shadow-md mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            className="border border-gray-300 rounded-full px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white/70"
            placeholder="Add a new task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-full hover:opacity-90 transition"
            onClick={createTask}
          >
            Add Task
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          className="border border-gray-300 rounded-full px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/70"
          placeholder="Search tasks..."
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border border-gray-300 rounded-full px-4 py-2 bg-white/70 focus:outline-none"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Tasks</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white/50 backdrop-blur-md border border-gray-200 rounded-xl px-4 py-3 flex justify-between items-center hover:shadow-lg transition"
          >
            {editingId === task.id ? (
              <input
                className="border rounded-full px-3 py-1 flex-1 mr-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            ) : (
              <p
                className={`flex-1 text-gray-800 ${
                  task.completed ? "line-through text-gray-400" : ""
                }`}
              >
                {task.title}
              </p>
            )}

            <div className="flex gap-3 text-sm font-medium">
              {editingId === task.id ? (
                <button
                  onClick={() => updateTask(task.id)}
                  className="text-green-600 hover:text-green-800"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => {
                    setEditingId(task.id);
                    setEditTitle(task.title);
                  }}
                  className="text-yellow-600 hover:text-yellow-800"
                >
                  Edit
                </button>
              )}

              <button
                onClick={() => toggleTask(task.id)}
                className="text-blue-500 hover:text-blue-700"
              >
                Toggle
              </button>

              <button
                onClick={() => deleteTask(task.id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center gap-6 mt-10">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="px-4 py-2 rounded-full bg-white/70 border disabled:opacity-40 hover:bg-white"
        >
          Prev
        </button>

        <span className="text-gray-700 font-medium">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 rounded-full bg-white/70 border disabled:opacity-40 hover:bg-white"
        >
          Next
        </button>
      </div>
    </div>
  );
}
