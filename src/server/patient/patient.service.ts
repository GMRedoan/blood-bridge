"use server"

import serverFetch from "@/lib/serverFetch";
import { myBloodRequestsResponse } from "@/types/patient/patient";

export const myBloodRequests = async () => {
    try {
        const res =
          await serverFetch.get<myBloodRequestsResponse>("/patient/myRequest");
        if (!res.success) {
            return {
                success: false,
                message: res.message,
                data: null,
            };
        };

        return {
            success: true,
            data: res.data,
        };
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
}