"use client";

import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { Toast } from "./Toast";
import { googleLogin } from "@/server/auth/auth.service";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: Record<string, unknown>,
          ) => void;
        };
      };
    };
  }
}

const SCRIPT_ID = "google-identity-services";
let scriptLoadingPromise: Promise<void> | null = null;

function loadGoogleScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.google?.accounts?.id) return Promise.resolve();
  if (scriptLoadingPromise) return scriptLoadingPromise;

  scriptLoadingPromise = new Promise((resolve, reject) => {
    if (document.getElementById(SCRIPT_ID)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google script"));
    document.head.appendChild(script);
  });

  return scriptLoadingPromise;
}

let hasInitialized = false;

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.63h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.81Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.07 7.93-2.92l-3.88-3c-1.08.73-2.45 1.16-4.05 1.16-3.12 0-5.76-2.1-6.7-4.93H1.29v3.1A11.998 11.998 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.3 14.31A7.2 7.2 0 0 1 4.92 12c0-.8.14-1.58.38-2.31v-3.1H1.29A12 12 0 0 0 0 12c0 1.94.46 3.77 1.29 5.41l4.01-3.1Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.94 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.59l4.01 3.1C6.24 6.85 8.88 4.75 12 4.75Z"
      />
    </svg>
  );
}

const SocialLogin = () => {
  const router = useRouter();
  const { refreshUser, closeAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [scriptError, setScriptError] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonContainerRef = useRef<HTMLDivElement>(null);
  const buttonRenderedRef = useRef(false);

  const handleCredential = async (response: { credential?: string }) => {
    if (!response.credential) {
      await Swal.fire({
        title: "Login Failed",
        text: "Something went wrong. Please try again.",
        icon: "error",
        confirmButtonColor: "#11B2ED",
      });
      return;
    }
    try {
      setIsLoading(true);
      const result = await googleLogin({ idToken: response.credential });

      if (!result.success) {
        await Toast({
          icon: "error",
          title: result?.message || "Login failed",
        });
        return;
      }
      closeAuth();
      await refreshUser();
      await Swal.fire({
        title: "Welcome Back!",
        text: "You successfully logged in to your account.",
        icon: "success",
        confirmButtonColor: "#D43333",
      });
      router.push("/");
    } catch (error) {
      console.error("Google login error:", error);
      await Swal.fire({
        title: "Login Failed",
        text: "Something went wrong. Please try again.",
        icon: "error",
        confirmButtonColor: "#D43333",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const setup = async () => {
      try {
        await loadGoogleScript();
      } catch (error) {
        console.error(error);
        if (!cancelled) setScriptError(true);
        return;
      }

      if (cancelled || !window.google?.accounts?.id) return;

      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      if (!clientId) {
        console.error("Google Client ID is not configured");
        setScriptError(true);
        return;
      }

      if (!hasInitialized) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredential,
        });
        hasInitialized = true;
      }
      if (buttonContainerRef.current && !buttonRenderedRef.current) {
        window.google.accounts.id.renderButton(buttonContainerRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          width: wrapperRef.current?.offsetWidth || 320,
        });
        buttonRenderedRef.current = true;
      }
    };

    setup();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div
        className={`relative flex w-full cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-lg border bg-background px-6 py-2.5 text-sm font-medium shadow-sm transition-colors hover:bg-muted ${
          isLoading ? "pointer-events-none opacity-50" : ""
        }`}
      >
        {isLoading ? (
          <>
            <span>Logging in...</span>
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </>
        ) : scriptError ? (
          <span className="text-destructive">Google sign-in unavailable</span>
        ) : (
          <>
            <GoogleIcon />
            <span>Continue with Google</span>
          </>
        )}
        <div
          ref={buttonContainerRef}
          className="absolute inset-0 opacity-[0.01] [&>div]:h-full [&>div]:w-full"
        />
      </div>
    </div>
  );
};

export default SocialLogin;
