"use server"

import serverFetch from "@/lib/serverFetch";
import { ICampaignResponse } from "@/types/campaign/campaign";

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