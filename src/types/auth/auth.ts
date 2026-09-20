export interface ICreateUser {
  name: string;
  email: string;
  phone: string;
  password: string;
  city: string;
  role?: "PATIENT" | "DONOR" | "HOSPITAL";
}

export interface CreateUserResponse {
  success: boolean;
  message: string;
}

export interface IVerifyEmailPayload {
  email: string;
  otp: string;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface Response {
  success: boolean;
  message: string;
  data?: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface IUserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  profilePhoto: string | null;
  bio: string | null;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetUserResponse {
  success: boolean;
  message: string;
  data: { profile: IUserProfile };
}