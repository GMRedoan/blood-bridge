"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { forgotPassword, resetPassword } from "@/server/auth/auth.service";
import {
  ForgotPasswordFormValues,
  IResetPasswordPayload,
} from "@/types/auth/auth";
import { Toast } from "@/components/Reusable/Toast";
import Animate from "@/components/Reusable/Animate";
import { FormError } from "@/components/Reusable/FormError";
import { useAuth } from "@/providers/AuthProvider";

const ForgotPasswordDialog = () => {
  const { openLogin } = useAuth();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  const emailForm = useForm<ForgotPasswordFormValues>({
    defaultValues: {
      email: "",
    },
  });

  const resetForm = useForm<IResetPasswordPayload>({
    defaultValues: {
      newPassword: "",
      otp: "",
    },
    mode: "onTouched",
  });

  const resetDialog = () => {
    setStep("email");
    setEmail("");
    emailForm.reset();
    resetForm.reset();
    setShowNewPassword(false);
  };

  const handleForgotPassword = async ({ email }: ForgotPasswordFormValues) => {
    try {
      const userEmail = email.trim();
      const result = await forgotPassword(userEmail);

      if (!result.success) {
        Toast({
          icon: "error",
          title: result.message || "Unable to process request.",
        });
        return;
      }

      setEmail(userEmail);
      resetForm.reset();
      setStep("reset");

      Toast({
        icon: "info",
        title: result.message || "Verification OTP sent to your email.",
      });
    } catch (error) {
      console.error("FORGOT PASSWORD ERROR:", error);

      Toast({
        icon: "error",
        title: "Something went wrong. Please try again.",
      });
    }
  };

  const handleResetPassword = async (values: IResetPasswordPayload) => {
    try {
      const result = await resetPassword({
        email,
        newPassword: values.newPassword,
        otp: values.otp,
      });
      if (!result.success) {
        Toast({
          icon: "error",
          title: result.message || "Password reset failed.",
        });
        return;
      }
      Toast({
        icon: "success",
        title: "Password reset successfully, please login.",
      });

      setOpen(false);
      resetDialog();
      openLogin();
    } catch (error) {
      console.error("RESET PASSWORD ERROR:", error);

      Toast({
        icon: "error",
        title: "Something went wrong. Please try again.",
      });
    }
  };

  const handleOpenChange = (value: boolean) => {
    if (emailForm.formState.isSubmitting || resetForm.formState.isSubmitting) {
      return;
    }

    setOpen(value);
    if (!value) {
      resetDialog();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="px-0 text-sm text-primary hover:underline -mt-4 cursor-pointer"
        >
          Forgot password?
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-116 p-6">
        {/* STEP 1: EMAIL */}
        {step === "email" && (
          <Animate type="fadeUp">
            <DialogHeader>
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Mail size={25} />
              </div>

              <DialogTitle className="text-xl">
                Forgot your password?
              </DialogTitle>

              <DialogDescription>
                Enter your registered email address. We will send you an OTP to
                reset your password.
              </DialogDescription>
            </DialogHeader>

            <form
              onSubmit={emailForm.handleSubmit(handleForgotPassword)}
              className="space-y-5 pt-3"
            >
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="forgot-email">Email address</Label>

                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="example@email.com"
                  {...emailForm.register("email", {
                    required: "Email address is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Please enter a valid email address",
                    },
                  })}
                />

                {emailForm.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {emailForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full"
                disabled={emailForm.formState.isSubmitting}
              >
                {emailForm.formState.isSubmitting
                  ? "Sending OTP..."
                  : "Send verification OTP"}
              </Button>
            </form>
          </Animate>
        )}

        {/* STEP 2: RESET PASSWORD */}
        {step === "reset" && (
          <Animate type="fadeUp" duration={0.2}>
            <DialogHeader>
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <LockKeyhole size={25} />
              </div>

              <DialogTitle className="text-xl">Reset your password</DialogTitle>

              <DialogDescription>
                Enter the OTP sent to your email and create a new password.
              </DialogDescription>
            </DialogHeader>

            <form
              onSubmit={resetForm.handleSubmit(handleResetPassword)}
              className="space-y-4 pt-3"
            >
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email address</Label>

                <Input
                  id="reset-email"
                  type="email"
                  value={email}
                  readOnly
                  className="bg-muted"
                />
              </div>

              {/* OTP */}
              <div className="space-y-2">
                <Label htmlFor="reset-otp">Verification OTP</Label>

                <Input
                  id="reset-otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="Enter 6-digit OTP"
                  {...resetForm.register("otp", {
                    required: "OTP is required",
                    onChange: (e) => {
                      const value = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 6);

                      resetForm.setValue("otp", value, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    },
                  })}
                />
                <FormError error={resetForm.formState.errors.otp} />
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="new-password">New password</Label>

                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    {...resetForm.register("newPassword", {
                      required: "New password is required",
                    })}
                  />

                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
                    aria-label={
                      showNewPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showNewPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>

                <FormError error={resetForm.formState.errors.newPassword} />
              </div>

              {/* Reset Password */}
              <Button
                type="submit"
                className="w-full"
                disabled={resetForm.formState.isSubmitting}
              >
                {resetForm.formState.isSubmitting
                  ? "Resetting password..."
                  : "Reset Password"}
              </Button>

              {/* Back */}
              <Button
                type="button"
                variant="outline"
                className="w-full cursor-pointer"
                disabled={resetForm.formState.isSubmitting}
                onClick={() => {
                  setStep("email");
                  resetForm.reset();
                }}
              >
                Back
              </Button>
            </form>
          </Animate>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordDialog;
