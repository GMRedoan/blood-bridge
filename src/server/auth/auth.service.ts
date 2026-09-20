"use server";

import { CreateUserResponse, ICreateUser, ILoginPayload, IVerifyEmailPayload, Response } from "@/types/auth/auth";
import { cookies } from "next/headers";
import { createUserSchema, loginSchema } from "@/validation/auth.schema";
import serverFetch from "@/lib/serverFetch";

// register
export const registerUser = async (payload: ICreateUser) => {
    try {
        const validatedPayload = await createUserSchema.safeParseAsync(payload);

        if (!validatedPayload.success) {
            return {
                success: false,
                message: validatedPayload.error.message,
            };
        }
        const result = await serverFetch.post<CreateUserResponse>("/auth/register", validatedPayload.data);

        if (!result.success) {
            return {
                success: false,
                message: result.message,
            };
        }
        return {
            success: true,
            message: result.message,
        };

    } catch (error) {
        console.error("REGISTER ERROR:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Something went wrong",
        };
    }
}

// verify-email
export const verifyEmail = async (payload: IVerifyEmailPayload) => {
  try {
    const result = await serverFetch.post<Response>("/auth/verify-email", payload);
        if (!result.success || !result.data) {
          return {
            success: false,
            message: result.message,
          };
        }

        const { accessToken, refreshToken } = result.data;

        const cookieStore = await cookies();

        // store token
        cookieStore.set("accessToken", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 7 * 24 * 60 * 60,
        });
        cookieStore.set("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 7 * 24 * 60 * 60 * 30,
        });

        return {
          success: true,
          message: result.message,
          accessToken,
          refreshToken,
        };
     
  } catch (error) {
        console.error("Verification Error:", error);
        return {
          success: false,
          message: "Verification failed. Please try again.",
        };
  }
}

// login
export const login = async (payload: ILoginPayload) => {
  try {
    const validatedPayload = await loginSchema.safeParseAsync(payload);

    if (!validatedPayload.success) {
      return {
        success: false,
        message: validatedPayload.error.message,
      };
    }
    const result = await serverFetch.post<Response>(
      "/auth/login",
      validatedPayload.data,
    );

    if (!result.success || !result.data) {
      return {
        success: false,
        message: result.message,
      };
    }

    const { accessToken, refreshToken } = result.data;

    const cookieStore = await cookies();

    // store token
    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 30,
    });

    return {
      success: true,
      message: result.message,
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return {
      success: false,
      message: "Login failed. Please try again.",
    };
  }
};

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
