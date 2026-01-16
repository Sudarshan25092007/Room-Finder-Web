"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useToast } from "@/app/components/ui/ToastProvider";

export default function LoginPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <LoginForm />
    </div>
  );
}

export function LoginForm() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const { showToast } = useToast();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        if (
          error.message.includes("Invalid login credentials") ||
          error.message.includes("Invalid") ||
          error.status === 400 ||
          error.status === 401
        ) {
          showToast(
            "Account not found or password incorrect. If you are a new user, please sign up first.",
            "error",
          );
        } else {
          showToast("Login failed. Please try again.", "error");
        }
        return;
      }

      showToast("Login successful!", "success");
      router.push("/owner/rooms");
      router.refresh();
    } catch {
      showToast("Login failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        showToast(error.message || "Signup failed. Please try again.", "error");
        return;
      }

      showToast(
        "Signup successful! Please check your email to verify your account before logging in.",
        "success",
      );

      setTimeout(() => {
        setIsLogin(true);
        setEmail("");
        setPassword("");
      }, 2000);
    } catch {
      showToast("Signup failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {isLogin ? "Login" : "Signup"}
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {isLogin
            ? "Use your email and password to manage your rooms."
            : "Create an account to start listing your rooms."}
        </p>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <form
          onSubmit={isLogin ? handleLogin : handleSignup}
          className="space-y-3"
        >
          <div>
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              disabled={loading}
              className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-zinc-100 dark:focus:border-zinc-100 dark:focus:ring-zinc-100"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              minLength={6}
              disabled={loading}
              className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-zinc-100 dark:focus:border-zinc-100 dark:focus:ring-zinc-100"
              placeholder="••••••••"
            />
          </div>

          {!isLogin && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              You may need to verify your email before you can log in,
              depending on project settings.
            </p>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-slate-900 dark:hover:bg-white"
            >
              {loading
                ? isLogin
                  ? "Logging in..."
                  : "Signing up..."
                : isLogin
                ? "Login"
                : "Signup"}
            </button>
          </div>

          <div className="pt-2 text-center text-xs">
            {isLogin ? (
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className="text-zinc-600 underline hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                New here? Create an account
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className="text-zinc-600 underline hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                Already have an account? Log in
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
