"use server"

import serverFetch from "@/lib/serverFetch";
import { GetUsersResponse, IDeleteUserResponse } from "@/types/admin/admin";

export const getAllUsers = async () => {
    try {
        const res = await serverFetch.get<GetUsersResponse>("/admin/users");
        return {
            success: true,
            data: res.data,
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
}

export const deleteUser = async (id: string) => {
    try {
        const res = await serverFetch.delete<IDeleteUserResponse>(`/admin/user/${id}/delete`);
        return {
            success: true,
            data: res.data,
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
}

export const restoreUser = async (id: string) => {
  try {
    const res = await serverFetch.patch<IDeleteUserResponse>(
      `/admin/user/${id}/restore`,
    );
    return {
      success: true,
      data: res.data,
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const updateUserStatus = async (id: string, status: "ACTIVE" | "BANNED") => {
  try {
    const res = await serverFetch.patch<IDeleteUserResponse>(
      `/admin/user/${id}/status`,{status}
    );
    return {
      success: true,
      data: res.data,
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const getDeletedUsers = async () => {
    try {
        const res =
          await serverFetch.get<GetUsersResponse>("/admin/deletedUser");
        return {
            success: true,
            data: res.data,
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
}
