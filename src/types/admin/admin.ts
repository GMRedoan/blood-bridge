import { IGetUserProfile } from "../user/user";

export interface IDeleteUser {
  id: string;
  status: "ACTIVE" | "BANNED";
  isDeleted: boolean;
  deletedAt: string | null;
  isEmailVerified: boolean;
  role: "PATIENT" | "DONOR" | "HOSPITAL" | "ADMIN";
  name: string;
  email: string;
  phone: string;
  city: string;
  area: string | null;
  profilePhoto: string | null;
  createdAt: string;
  updatedAt: string;

}

export interface IDeleteUserResponse {
  success: boolean;
  message: string;
  data: IDeleteUser;
}

export interface GetUsersResponse {
  success: boolean;
  message: string;
  data: IGetUserProfile;
}
