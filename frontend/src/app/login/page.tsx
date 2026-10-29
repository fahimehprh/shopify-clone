"use client";
import { setToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import React from "react";
import { useState } from "react";

const apiUrl = process.env.API_URL ?? "http://localhost:3001";

export default function LoginPage() {
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const userId = formData.get("userId") as string;
    const password = formData.get("password") as string;

    try {
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password }),
      });

      if (!res.ok) {
        throw new Error(`Failed to login: ${res.status}`);
      }
      const data = await res.json();
      setToken(data.token);
      router.push("/products");
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black py-16">
      <main className="flex w-full  max-w-md flex-col gap-6 py-6 px-6 border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-black rounded-2xl">
        <h1 className="text-2xl font-bold">Login</h1>
        <form method="POST" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="userId" className="block py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              User ID
            </label>
            <input
              className="form-input border rounded-md border-zinc-300 dark:border-zinc-700 dark:bg-black dark:text-zinc-50 py-2 px-2 w-full"
              type="text"
              id="userId"
              name="userId"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Password
            </label>
            <input
              className="form-input border rounded-md border-zinc-300 dark:border-zinc-700 dark:bg-black dark:text-zinc-50 w-full py-2 px-2"
              type="password"
              id="password"
              name="password"
              required
            />
          </div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md border border-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed w-full"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        {loginError && <p className="text-red-500 bg-red-100 dark:bg-red-900 border rounded-md py-2 px-2">{loginError}</p>}
      </main>
    </div>
  );
}
