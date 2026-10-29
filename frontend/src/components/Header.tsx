"use client";

import Link from "next/link";
import { tokenExists, removeToken } from "../lib/auth";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    setIsLoggedIn(Boolean(tokenExists()));
  }, [pathname]);

  const handleLogout = () => {
    removeToken();
    router.push("/login");
  };
  return (
    <div className="flex w-full items-center justify-between border-b border-zinc-200 bg-zinc-50 px-6 py-4 dark:border-zinc-800 dark:bg-black">
      <Link href="/" className="text-lg font-bold">
        Shopify
      </Link>
      <nav>
        <ul className="flex gap-4">
          <li>
            <Link href="/products" className="text-blue-500 hover:underline">
              Products
            </Link>
          </li>
          <li>
            {isLoggedIn ? (
              <div>
                <p>Logged in</p>
                <button
                  onClick={handleLogout}
                  className="text-blue-500 hover:underline"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login" className="text-blue-500 hover:underline">
                Login
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
}
