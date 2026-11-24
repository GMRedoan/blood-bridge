"use server"

import serverFetch from "@/lib/serverFetch";
import { IContributionResponse } from "@/types/contribution/contribution";

export const getAllContributionHistory = async () => {
    try {
        const res = await serverFetch.get<IContributionResponse>(
          "/contribution/history",
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

export const getMyContributionHistory = async () => {
    try {
        const res = await serverFetch.get<IContributionResponse>(
          "/contribution/history/me",
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