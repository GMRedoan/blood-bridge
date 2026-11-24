"use server"

import serverFetch from "@/lib/serverFetch";
import { IContributionResponse, ICreateContribution, ICreateContributionResponse } from "@/types/contribution/contribution";
import { redirect } from "next/navigation";

export const createContribution = async (payload: ICreateContribution) => {
    try {
        const res = await serverFetch.post<ICreateContributionResponse>(
          "/contribution/create",
          payload,
        );
        if (!res.success) {
            return {
                success: false,
                message: res.message,
                data: null,
            };
        };
        redirect(res.data.contribution.checkoutUrl);
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
}

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

export const getCampaignContributionHistory = async (id: string) => {
    try {
        const res = await serverFetch.get<IContributionResponse>(
          `/campaign/contribution/history/${id}`,
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