import { IDonorProfile } from "../donor/donor";

export interface IGetUserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  area: string;
  profilePhoto: string | null;
  role: string;
  isDeleted: boolean;
  isEmailVerified?: boolean;
  authProvider?: string;
  donorProfile?: IDonorProfile | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetUserResponse {
  success: boolean;
  message: string;
  data: { profile: IGetUserProfile };
}

export interface IUpdateUser {
  name?: string;
  phone?: string;
  city?: string;
  area?: string;
  profilePhoto?: string | null;
}