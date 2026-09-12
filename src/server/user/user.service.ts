"use server";

import serverFetch from "@/lib/serverFetch";
import { GetUserResponse } from "@/types/auth/auth";

export const getUser = async () => {
  const res = await serverFetch.get<GetUserResponse>("/auth/me");
  if (!res.success || !res.data.profile) {
    return {
      success: false,
      message: res.message,
      data: null,
    };
  }

  return {
    success: true,
    data: res.data.profile,
  };
};
