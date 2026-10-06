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
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col gap-6 py-16 px-16">
        <h1>Login Page</h1>
        <form method="POST" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="userId">User ID:</label>
            <input
              className="form-input border rounded-md"
              type="text"
              id="userId"
              name="userId"
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              className="form-input border rounded-md"
              type="password"
              id="password"
              name="password"
              required
            />
          </div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        {loginError && <p className="text-red-500">{loginError}</p>}
      </main>
    </div>
  );
}
