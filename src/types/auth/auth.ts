export interface ICreateUser {
  name: string;
  email: string;
  phone: string;
  password: string;
  city: string;
  role?: "PATIENT" | "DONOR" | "HOSPITAL";
  profilePhoto?: string;
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