"use server"

import serverFetch from "@/lib/serverFetch";
import { ICreateRequestPayload, myBloodRequestsResponse } from "@/types/patient/patient";
import { createRequestFormSchema } from "@/validation/request.schema";

export const createBloodRequest = async (
    payload: ICreateRequestPayload,
) => {
    try {
        const validation =
          await createRequestFormSchema.safeParseAsync(payload);
        if (!validation.success) {
          return {
            success: false,
            message: "Validation failed",
            data: null,
            errors: validation.error.flatten().fieldErrors,
          };
        }
          
        const res = await serverFetch.post<myBloodRequestsResponse>(
          "/patient/request",
          validation.data,
        );
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
};

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