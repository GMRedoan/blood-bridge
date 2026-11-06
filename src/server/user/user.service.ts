"use server";

import serverFetch from "@/lib/serverFetch";
import { GetUserResponse, IUpdateUser } from "@/types/user/user";

export const getUser = async () => {
  try {
      const res = await serverFetch.get<GetUserResponse>("/auth/me");
      if (!res.success || !res.data.profile) {
        return {
          success: false,
          message: res.message,
          data: null,
        };
      };

      return {
        success: true,
        data: res.data.profile,
      };
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const updateUser = async (payload: IUpdateUser) => {
  try {
    const res = await serverFetch.patch<GetUserResponse>("/auth/me", payload);
    if (!res.success) {
      return {
        success: false,
        message: res.message,
        data: null,
      };
    }

    return {
      success: true,
      message: res.message,
      data: res.data.profile,
    };
  } catch (error) {
    console.error("Error updating user data:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
      data: null,
    };
  }
};
 