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
            {editingId === task.id ? (
              <input
                className="border p-1 flex-1 mr-2"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            ) : (
              <p
                className={`${
                  task.completed ? "line-through text-gray-500" : ""
                }`}
              >
                {task.title}
              </p>
            )}

            <div className="flex gap-2">
              {editingId === task.id ? (
                <button
                  onClick={() => updateTask(task.id)}
                  className="text-green-600"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => {
                    setEditingId(task.id);
                    setEditTitle(task.title);
                  }}
                  className="text-yellow-600"
                >
                  Edit
                </button>
              )}

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

      <div className="flex justify-center gap-4 mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="px-3 py-1 border disabled:opacity-50"
        >
          Prev
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-3 py-1 border disabled:opacity-50"
        >
          Next
        </button>
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
