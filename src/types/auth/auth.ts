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

