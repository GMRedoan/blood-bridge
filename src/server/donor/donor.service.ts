"use server";

import serverFetch from "@/lib/serverFetch";
import { BloodGroup, ICreateDonorResponse } from "@/types/donor/donor";

export const createDonorProfile = async ( bloodGroup: BloodGroup) => {
        try {   
            const result = await serverFetch.post<ICreateDonorResponse>(
              "/donor/donor-profile",
              bloodGroup,
            );
    
            if (!result.success) {
                return {
                    success: false,
                    message: result.message,
                };
            }
            return {
                success: true,
                message: result.message,
                data: result.data,
            };
    
        } catch (error) {
            console.error("CREATE DONOR ERROR:", error);
            return {
                success: false,
                message: error instanceof Error ? error.message : "Something went wrong",
            };
        }
}

export const updateDonorProfile = async (bloodGroup?: BloodGroup) => {
    try {
        const result = await serverFetch.patch<ICreateDonorResponse>(
            "/donor/donor-profile/me",
            bloodGroup,
        );

        if (!result.success) {
            return {
                success: false,
                message: result.message,
            };
        }
        return {
            success: true,
            message: result.message,
            data: result.data,
        };

    } catch (error) {
        console.error("UPDATE DONOR ERROR:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Something went wrong",
        };
    }
}