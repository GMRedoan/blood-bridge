"use server";

import { cookies } from "next/headers";

// log out
export async function logout() {
  try {
    const cookieStore = await cookies();

    // remove token from cookies
    cookieStore.delete("accessToken");
    return {
      success: true,
      message: "Logged out successfully",
    };
  } catch (err) {
    console.error("LOGOUT ERROR:", err);
    return {
      success: false,
      message: "Logout failed. Please try again.",
    };
  }
}
