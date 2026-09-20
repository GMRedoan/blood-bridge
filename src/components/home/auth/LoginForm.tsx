"use client";

import { useAuth } from "@/providers/AuthProvider";
import z from "zod";
import { loginSchema } from "../../../../validation/auth.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import { Toast } from "@/components/Reusable/Toast";
import { demoCredentials } from "./_components/demoCredentials";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Home, Loader2, ShieldCheck, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { login } from "@/server/auth/auth.service";

type LoginData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { setAuthStep, closeAuth } = useAuth();
      const { refreshUser } = useAuth();
      const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
      } = useForm<LoginData>({
        resolver: zodResolver(loginSchema),
      });

      const onSubmit = async (payload: LoginData) => {
        try {
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
            Toast({
              icon: "error",
              title: result?.message || "Login failed",
            });
          }
        } catch (error) {
          console.error("LOGIN ERROR:", error);
          return error;
        }
      };

      const handleDemoLogin = async (role: "admin" | "donor" | "patient") => {
        const credentials = demoCredentials[role];

        reset({
          email: credentials.email,
          password: credentials.password,
        });

        await onSubmit(credentials);
      };

  return (
    <div className="space-y-6">
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
              type="password"
              {...register("password")}
              placeholder="Enter your password"
              className="pl-11 h-12"
            />
          </div>

          {errors.password && (
            <p className="text-sm text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-12 text-white font-semibold"
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
          <span className="bg-background px-3 text-muted-foreground">
            Demo Accounts Login
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={() => handleDemoLogin("admin")}
          className="h-auto flex-col gap-1 py-3"
        >
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span className="text-xs">Admin</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={() => handleDemoLogin("donor")}
          className="h-auto flex-col gap-1 py-3"
        >
          <Home className="h-4 w-4 text-primary" />
          <span className="text-xs">Donor</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={() => handleDemoLogin("patient")}
          className="h-auto flex-col gap-1 py-3"
        >
          <UserRound className="h-4 w-4 text-primary" />
          <span className="text-xs">Patient</span>
        </Button>
      </div>

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
