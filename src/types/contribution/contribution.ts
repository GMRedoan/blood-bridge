import { ICampaign } from "../campaign/campaign"

export interface IContributor {
    name: string
    email: string
    phone: string
}

export interface IContribution {
    id: string
    campaignId: string
    contributorId: string
    amount: number
    status: string
    createdAt: string
    updatedAt: string
    stripeCheckoutSessionId: string
    stripePaymentIntentId: string
    campaign: ICampaign
    contributor?: IContributor
}

export interface ICreateContribution {
    campaignId: string
    amount: number
}

export interface ICreateContributionResponse {
    success: boolean
    message: string
    data: {
        contribution: {
            contributionId: string
            checkoutUrl: string
        }
    }
}

export interface IContributionResponse {
    success: boolean
    message: string
    data: IContribution[]
}