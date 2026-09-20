/* eslint-disable react-hooks/incompatible-library */
"use client";

import Animate from "@/components/Reusable/Animate";
import { Toast } from "@/components/Reusable/Toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/providers/AuthProvider";
import { registerUser } from "@/server/auth/auth.service";
import { createUserSchema } from "@/validation/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEnvelope, FaLock, FaPhone, FaUser } from "react-icons/fa";
import { MdAddLocation } from "react-icons/md";
import z from "zod";

type FormData = z.infer<typeof createUserSchema>;

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { setAuthStep, refreshUser } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      role: "PATIENT",
    },
  });

  const role = watch("role");

  const onSubmit = async (payload: FormData) => {
    const result = await registerUser({
      ...payload,
      phone: payload.phone ?? "",
      city: payload.city ?? "",
      password: payload.password ?? "",
      role: payload.role ?? "PATIENT",
    });
    if(result.success) {
          Toast({
            icon: "info",
            title: result.message,
          });
          await refreshUser();
          setAuthStep("verify-email");
    } else {
      Toast({
        icon: "error",
        title: result.message,
      });
    }
  };

  return (
    <Animate type="fadeRight" duration={0.2} className="space-y-6 px-3 py-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Create Account</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Join Blood Bridge today
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        {/* Name */}
        <div className="space-y-2">
          <Label>Name</Label>

          <div className="relative">
            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />

            <Input
              {...register("name")}
              className="pl-11 h-10"
              placeholder="John Doe"
            />
          </div>

          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label>Email</Label>

          <div className="relative">
            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />

            <Input
              {...register("email")}
              className="pl-11 h-10"
              placeholder="john@email.com"
            />
          </div>

          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label>Phone</Label>

          <div className="relative">
            <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />

            <Input
              type="number"
              {...register("phone")}
              className="pl-11 h-10"
              placeholder="+8801XXXXXXXXX"
            />
          </div>

          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone.message}</p>
          )}
        </div>

        {/* City */}
        <div className="space-y-2">
          <Label>City</Label>

          <div className="relative">
            <MdAddLocation className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-xl" />

            <Input
              {...register("city")}
              className="pl-11 h-10"
              placeholder="Enter your city"
            />
          </div>

          {errors.city && (
            <p className="text-sm text-destructive">{errors.city.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label>Password</Label>

          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />

            <Input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              placeholder="Enter your password"
              className="pl-11 pr-11 h-10"
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

          {errors.password && (
            <p className="text-sm text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Role */}
        <div className="space-y-2">
          <Label className="text-primary/70">Register As</Label>

          <Select
            value={role}
            onValueChange={(value) =>
              setValue("role", value as "PATIENT" | "DONOR" | "HOSPITAL")
            }
          >
            <SelectTrigger className="h-12">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="PATIENT">Patient</SelectItem>
              <SelectItem value="DONOR">Donor</SelectItem>
              <SelectItem value="HOSPITAL">Hospital</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          className="h-10 mt-4 w-full text-white text-md cursor-pointer"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              Creating Account...{" "}
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>

      {/* Login */}
      <div className="text-center text-sm">
        <span className="text-muted-foreground">Already have an account?</span>

        <button
          type="button"
          onClick={() => setAuthStep("login")}
          className="ml-1 font-semibold text-primary hover:underline cursor-pointer"
        >
          Login
        </button>
      </div>
    </Animate>
  );
}
