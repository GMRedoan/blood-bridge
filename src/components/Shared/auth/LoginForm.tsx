"use client";

import { useAuth } from "@/providers/AuthProvider";

export function LoginForm() {
  const { setAuthStep } = useAuth();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Welcome Back</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Login to your Blood Bridge account
        </p>
      </div>

      {/* Your login inputs */}
      <div>{/* Email */}</div>

      <div>{/* Password */}</div>

      {/* Login button */}
      <button className="w-full">Login</button>

      {/* Register */}
      <div className="text-center text-sm">
        <span className="text-muted-foreground">Do not have an account?</span>

        <button
          type="button"
          onClick={() => setAuthStep("register")}
          className="ml-1 font-semibold text-primary hover:underline"
        >
          Register
        </button>
      </div>
    </div>
  );
}
