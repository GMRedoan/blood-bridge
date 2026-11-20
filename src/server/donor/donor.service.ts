"use server";

import serverFetch from "@/lib/serverFetch";
import { BloodGroup, ICreateDonationResponse, ICreateDonorResponse } from "@/types/donor/donor";
import { myBloodRequestsResponse } from "@/types/patient/patient";

export const createDonorProfile = async ( bloodGroup: BloodGroup) => {
        try {   
            const result = await serverFetch.post<ICreateDonorResponse>(
              "/donor/donor-profile",
              {bloodGroup: bloodGroup},
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
            {bloodGroup},
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

export const getMatchingRequest = async () => {
    try {
        const result = await serverFetch.get<myBloodRequestsResponse>(
          "/donor/matching-requests",
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
        console.error("MATCHING REQUEST ERROR:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Something went wrong",
        };
    }
}

export const createDonation = async (requestId: string) => {
  try {
    const result = await serverFetch.post<ICreateDonationResponse>(
      "/donor/create-donation",
      { requestId },
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
    };
  } catch (error) {
    console.error("CREATE DONATION ERROR:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    };
  }
};