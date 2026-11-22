import { BloodGroup } from "../donor/donor";

export interface requestMatches {
  id: string;
  status: string;
  notifiedAt: string | null;
  respondedAt: string | null;
  createdAt: string;
  donor: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  donation?: {
    id: string;
    status: string;
    scheduledAt: string | null;
    completedAt: string | null;
  } | null;
}

export interface myBloodRequests {
  id: string;
  creatorId: string;
  requesterType: string;
  patientName: string;
  bloodGroup: string;
  unitsNeeded: number;
  hospitalName: string | null;
  city: string;
  area: string;
  urgency: string;
  status: string;
  verifiedById: string | null;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  reason: string;
  matches?: requestMatches[];
} 

export interface myBloodRequestsResponse {
  success: boolean;
  message: string;
  data: myBloodRequests[];
}

export interface deleteRequestsResponse {
  success: boolean;
  message: string;
  data?: null;
}

export interface ICreateRequestPayload {
  requesterType: "INDIVIDUAL" | "HOSPITAL";
  patientName: string;
  bloodGroup: BloodGroup;
  unitsNeeded: number;
  hospitalName?: string;
  reason: string;
  city: string;
  area: string;
  urgency: string;
}

export interface IEditRequestPayload {
  requesterType?: "INDIVIDUAL" | "HOSPITAL";
  patientName?: string;
  bloodGroup?: BloodGroup;
  unitsNeeded?: number;
  hospitalName?: string;
  reason?: string;
  city?: string;
  area?: string;
  urgency?: string;
}

export interface IAcceptRequest {
  match: {
    id: string;
    requestId: string;
    donorId: string;
    status: string;
    notifiedAt: string | null;
    respondedAt: string | null;
    createdAt: string;
  };
  donation: {
    id: string;
    requestId: string;
    donorId: string;
    status: string;
    scheduledAt: string;
    completedAt: string | null;
    createdAt: string;
    deletedAt: string | null;
  };
}

export interface IAcceptRequestResponse {
  success: boolean;
  message: string;
  data: IAcceptRequest;
}

 export interface ICompleteDonation {
    id: string;
    requestId: string;
    donorId: string;
    status: string;
    scheduledAt: string;
    completedAt: string | null;
    createdAt: string;
    deletedAt: string | null;
}

export interface ICompleteDonationResponse {
  success: boolean;
  message: string;
  data: ICompleteDonation;
}