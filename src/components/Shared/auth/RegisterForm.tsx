"use client";

import Animate from "@/components/Reusable/Animate";
import { Toast } from "@/components/Reusable/Toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { z } from "zod";
import DistrictCombobox from "../DistrictCombobox";

type FormData = z.infer<typeof createUserSchema>;

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    setAuthStep,
    refreshUser,
    setVerificationEmail,
    setPendingVerificationEmail,
  } = useAuth();

  const form = useForm<FormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      city: "",
      password: "",
      role: "PATIENT",
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (payload: FormData) => {
    try {
      const result = await registerUser({
        ...payload,
        phone: payload.phone ?? "",
        city: payload.city ?? "",
        password: payload.password ?? "",
        role: payload.role ?? "PATIENT",
      });

      if (result.success) {
        Toast({
          icon: "info",
          title: result.message,
        });

        await refreshUser();

        setVerificationEmail(payload.email);
        setPendingVerificationEmail(payload.email);
        setAuthStep("verify-email");
      } else {
        Toast({
          icon: "error",
          title: result.message,
        });
      }
    } catch (error) {
      console.error("Registration error:", error);

      Toast({
        icon: "error",
        title: "Something went wrong. Please try again.",
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

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>

                <FormControl>
                  <div className="relative">
                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      {...field}
                      className="h-10 pl-11"
                      placeholder="John Doe"
                    />
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>

                <FormControl>
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      {...field}
                      type="email"
                      className="h-10 pl-11"
                      placeholder="john@email.com"
                    />
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone */}
          <FormField
            control={control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>

                <FormControl>
                  <div className="relative">
                    <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      {...field}
                      type="tel"
                      className="h-10 pl-11"
                      placeholder="+8801XXXXXXXXX"
                    />
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* City / District */}
          <FormField
            control={control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>

                <FormControl>
                  <DistrictCombobox
                    value={field.value ?? ""}
                    onChange={field.onChange}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>

                <FormControl>
                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="h-10 pl-11 pr-11"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Role */}
          <FormField
            control={control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary/70">Register As</FormLabel>

                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    <SelectItem value="PATIENT">Patient</SelectItem>
                    <SelectItem value="DONOR">Donor</SelectItem>
                    <SelectItem value="HOSPITAL">Hospital</SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit */}
          <Button
            type="submit"
            className="mt-4 h-10 w-full cursor-pointer text-md text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                Creating Account...
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </Form>

      {/* Login */}
      <div className="text-center text-sm">
        <span className="text-muted-foreground">Already have an account?</span>

        <button
          type="button"
          onClick={() => setAuthStep("login")}
          className="ml-1 cursor-pointer font-semibold text-primary hover:underline"
        >
          Login
        </button>
      </div>
    </Animate>
  );
}
