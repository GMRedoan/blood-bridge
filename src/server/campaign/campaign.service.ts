"use server"

import serverFetch from "@/lib/serverFetch";
import { ICampaignResponse, ICreateCampaign } from "@/types/campaign/campaign";

export const createCampaign = async (payload: ICreateCampaign) => {
    try {
        const res = await serverFetch.post<ICampaignResponse>(
          "/campaign",
          payload,
        );
        return {
            success: true,
            data: res.data,
        };
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
}

export const myCampaign = async () => {
    try {
        const res = await serverFetch.get<ICampaignResponse>("/campaign/myCampaign");
        return {
            success: true,
            data: res.data,
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
}

export const getPendingCampaigns = async () => {
    try {
        const res = await serverFetch.get<ICampaignResponse>(
          "/campaign/pendingCampaigns",
        );
        return {
            success: true,
            data: res.data,
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
}

export const verifyCampaign = async (id: string, status: "ACTIVE" | "CANCELLED") => {
  try {
    const res = await serverFetch.patch<ICampaignResponse>(
      `/admin/campaign/verify/${id}`,
      {status}
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