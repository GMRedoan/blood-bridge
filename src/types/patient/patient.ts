export interface requestMatches {
    id : string;
    requestId: string;
    donorId: string;
    status: string;
    notifiedAt: string | null;
    respondedAt: string | null;
    createdAt: string;
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