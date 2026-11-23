export interface ICreateCampaign{
    title: string;
    description: string;
    targetAmount: number;
}

export interface ICampaign {
  id: string;
  requestId: string | null;
  createdById: string;
  title: string;
  description: string;
  targetAmount: number;
  raisedAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  createdBy?: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface ICampaignResponse {
    success: boolean
    message: string
    data: ICampaign
}