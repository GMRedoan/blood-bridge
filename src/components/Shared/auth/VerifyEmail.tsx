"use client";

import { useAuth } from "@/providers/AuthProvider";


export function VerifyEmailForm() {
  const { closeAuth } = useAuth();

  const handleVerify = async () => {
    // API call
    // verify email code

    const verified = true;

    if (verified) {
      closeAuth();
    }

  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Verify Your Email</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Enter the verification code sent to your email.
        </p>
      </div>

      {/* OTP Input */}
      <div>{/* OTP component */}</div>

      <button onClick={handleVerify} className="w-full">
        Verify Email
      </button>

      <button
        type="button"
        className="w-full text-sm text-muted-foreground hover:text-primary"
      >
        Resend Code
      </button>
    </div>
  );
}
