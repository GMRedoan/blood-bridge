"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";

const AuthDialogTrigger = () => {
  const { openLogin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("login") === "1") {
      openLogin();

      // clean the URL so refreshing doesn't reopen it
      const params = new URLSearchParams(searchParams.toString());
      params.delete("login");
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname);
    }
  }, [searchParams, openLogin, router, pathname]);

  return null;
};

export default AuthDialogTrigger;
