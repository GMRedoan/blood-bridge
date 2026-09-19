"use client";

import { useAuth } from "@/providers/AuthProvider";


export function RegisterForm() {
  const { setAuthStep } = useAuth();

  const handleRegister = async () => {
    // 1. Submit registration
    // 2. Backend sends verification email
    // 3. Move to verification

    setAuthStep("verify-email");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Create Account</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Join Blood Bridge today
        </p>
      </div>

      {/* Name */}
      <div>{/* Name input */}</div>

      {/* Email */}
      <div>{/* Email input */}</div>

      {/* Password */}
      <div>{/* Password input */}</div>

      <button type="button" onClick={handleRegister} className="w-full">
        Create Account
      </button>

      {/* Login */}
      <div className="text-center text-sm">
        <span className="text-muted-foreground">Already have an account?</span>

        <button
          type="button"
          onClick={() => setAuthStep("login")}
          className="ml-1 font-semibold text-primary hover:underline"
        >
          Login
        </button>
      </div>
    </div>
  );
}
