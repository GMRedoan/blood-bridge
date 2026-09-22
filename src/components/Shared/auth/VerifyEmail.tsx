/* eslint-disable react-hooks/incompatible-library */
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, MailCheck, RotateCcw } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { verifyEmail } from "@/server/auth/auth.service";
import Swal from "sweetalert2";
import { Toast } from "@/components/Reusable/Toast";
import { IVerifyEmailPayload } from "@/types/auth/auth";
import Animate from "@/components/Reusable/Animate";

export function VerifyEmailForm() {
  const {
    setAuthStep,
    closeAuth,
    refreshUser,
    verificationEmail,
    setPendingVerificationEmail,
  } = useAuth();
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(30);

  const {
    handleSubmit,
    setValue,
    clearErrors,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<IVerifyEmailPayload>({
    defaultValues: {
      email: verificationEmail,
      otp: "",
    },
  });

  const code = watch("otp");

  // Countdown after resend
  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  const onSubmit = async (payload: IVerifyEmailPayload) => {
    try {
      clearErrors();
      const result = await verifyEmail(payload);

      if (result.success) {
        await refreshUser();
        setPendingVerificationEmail(null);
        closeAuth();
        Swal.fire({
          icon: "success",
          title: "Email Verified",
          text: "Welcome to the Blood Bridge!",
          confirmButtonColor: "#D43333",
        })
      } else {
         Toast({
           icon: "error",
           title: result?.message || "Verification failed",
         })
      }
    } catch (error) {
      console.error("VERIFY EMAIL ERROR:", error);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0 || resendLoading) return;

    try {
      setResendLoading(true);

      setResendCooldown(60);
    } catch (error) {
      console.error("RESEND CODE ERROR:", error);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <Animate type="fadeRight" duration={0.2} className="space-y-6 px-3 py-6">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <MailCheck className="h-7 w-7" />
        </div>

        <h2 className="text-2xl font-bold tracking-tight">Verify Your Email</h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          We&apos;ve sent a 6-digit verification code to
        </p>

        {verificationEmail && (
          <p className="mt-1 font-semibold text-foreground">
            {verificationEmail}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* OTP */}
        <div className="space-y-3">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={code}
              onChange={(value) => {
                setValue("otp", value, {
                  shouldValidate: true,
                  shouldDirty: true,
                });

                if (errors.root) {
                  clearErrors("root");
                }
              }}
              disabled={isSubmitting}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {errors.root?.message && (
            <p className="text-center text-sm text-destructive">
              {errors.root.message}
            </p>
          )}

          {errors.otp?.message && (
            <p className="text-center text-sm text-destructive">
              {errors.otp.message}
            </p>
          )}
        </div>

        {/* Verify */}
        <Button
          type="submit"
          disabled={isSubmitting || code?.length !== 6}
          className="h-12 w-full font-semibold cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify Email"
          )}
        </Button>
      </form>

      {/* Resend */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Didn&apos;t receive the code?
        </p>

        <button
          type="button"
          onClick={handleResendCode}
          disabled={resendCooldown > 0 || resendLoading}
          className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {resendLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : resendCooldown > 0 ? (
            <>
              <RotateCcw className="h-4 w-4" />
              Resend code in {resendCooldown}s
            </>
          ) : (
            <>
              <RotateCcw className="h-4 w-4" />
              Resend Code
            </>
          )}
        </button>
      </div>

      {/* Back */}
      <div className="border-t pt-5 text-center">
        <button
          type="button"
          onClick={() => setAuthStep("register")}
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary cursor-pointer"
        >
          Back to Register
        </button>
      </div>
    </Animate>
  );
}
