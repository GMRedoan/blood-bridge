"use client";

import { useAuth } from "@/providers/AuthProvider";
import z from "zod";
import { loginSchema } from "../../../validation/auth.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import { Toast } from "@/components/Reusable/Toast";
import { demoCredentials } from "./_components/demoCredentials";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { EyeOff, Eye, Loader2, ShieldCheck, Hospital } from "lucide-react";
import { Button } from "@/components/ui/button";
import { login } from "@/server/auth/auth.service";
import { BiDonateBlood } from "react-icons/bi";
import { MdOutlineSick } from "react-icons/md";
import Animate from "@/components/Reusable/Animate";
import { useState } from "react";

type LoginData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { setAuthStep, closeAuth } = useAuth();
  const { refreshUser } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (payload: LoginData) => {
    try {
      clearErrors("root");
      const result = await login(payload);

      if (result.success) {
        await refreshUser();
        closeAuth();
        Swal.fire({
          title: "Welcome Back",
          text: "You Successfully Logged in your account",
          icon: "success",
          confirmButtonColor: "#D43333",
        });
        reset();
      } else {
        const message = result?.message || "Login failed";

        Toast({
          icon: "error",
          title: message,
        });
        setError("root", {
          type: "server",
          message,
        });
      }
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      return error;
    }
  };

  const handleDemoLogin = async (role: "admin" | "donor" | "patient" | "hospital") => {
    const credentials = demoCredentials[role];

    reset({
      email: credentials.email,
      password: credentials.password,
    });

    await onSubmit(credentials);
  };

  return (
    <Animate type="fadeLeft" duration={0.2} className="space-y-6 py-6 px-3">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold">Welcome Back</h2>

        <p className="text-muted-foreground mt-2">
          Login to your Blood Bridge account
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label>Email</Label>

          <div className="relative">
            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />

            <Input
              {...register("email")}
              placeholder="Enter your email"
              className="pl-11 h-12"
            />
          </div>

          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Password</Label>

          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />

            <Input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              placeholder="Enter your password"
              className="pl-11 pr-11 h-12"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          {errors.root?.message && (
            <p className="text-sm text-destructive">{errors.root.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-12 text-white font-semibold cursor-pointer"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              Signing In...
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            </>
          ) : (
            "Login"
          )}
        </Button>
      </form>

      {/* Demo login */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t" />
        </div>

        <div className="relative flex justify-center text-xs uppercase">
          <span className="px-3 text-muted-foreground">
            Demo Accounts Login
          </span>
        </div>
      </div>

      <Animate type="zoom" duration={0.6} className="grid grid-cols-4 gap-1.5">
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={() => handleDemoLogin("admin")}
          className="h-auto flex-col gap-1 py-3 cursor-pointer"
        >
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span className="text-xs">Admin</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={() => handleDemoLogin("donor")}
          className="h-auto flex-col gap-1 py-3 cursor-pointer"
        >
          <BiDonateBlood className="h-4 w-4 text-primary" />
          <span className="text-xs">Donor</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={() => handleDemoLogin("patient")}
          className="h-auto flex-col gap-1 py-3 cursor-pointer"
        >
          <MdOutlineSick className="h-4 w-4 text-primary" />
          <span className="text-xs">Patient</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={() => handleDemoLogin("hospital")}
          className="h-auto flex-col gap-1 py-3 cursor-pointer"
        >
          <Hospital className="h-4 w-4 text-primary" />
          <span className="text-xs">Hospital</span>
        </Button>
      </Animate>

      {/* Register */}
      <div className="text-center text-sm">
        <span className="text-muted-foreground">Do not have an account?</span>

        <button
          type="button"
          onClick={() => setAuthStep("register")}
          className="ml-1 font-semibold text-primary hover:underline cursor-pointer"
        >
          Register
        </button>
      </div>
    </Animate>
  );
}
