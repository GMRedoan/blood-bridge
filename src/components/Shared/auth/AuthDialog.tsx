"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAuth } from "@/providers/AuthProvider";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { VerifyEmailForm } from "./VerifyEmail";


export default function AuthDialog() {
  const { authOpen, authStep, closeAuth } = useAuth();

  return (
    <Dialog
      open={authOpen}
      onOpenChange={(open) => {
        if (!open) {
          closeAuth();
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        {authStep === "login" && <LoginForm />}

        {authStep === "register" && <RegisterForm />}

        {authStep === "verify-email" && <VerifyEmailForm />}
      </DialogContent>
    </Dialog>
  );
}
