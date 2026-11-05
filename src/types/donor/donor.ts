export type BloodGroup =
  | "A_POS"
  | "A_NEG"
  | "B_POS"
  | "B_NEG"
  | "AB_POS"
  | "AB_NEG"
  | "O_POS"
  | "O_NEG";

  const bloodGroupLabels: Record<BloodGroup, string> = {
    A_POS: "A+",
    A_NEG: "A-",
    B_POS: "B+",
    B_NEG: "B-",
    AB_POS: "AB+",
    AB_NEG: "AB-",
    O_POS: "O+",
    O_NEG: "O-",
  };

export const formatBloodGroup = (bloodGroup?: BloodGroup | null): string => {
    if (!bloodGroup) return "N/A";

    return bloodGroupLabels[bloodGroup] ?? "N/A";
  };
 
export interface IDonorProfile {
  bloodGroup: BloodGroup;
  isAvailable: boolean;
  lastDonationDate: Date | null;
  totalDonations: number;
}

export interface ICreateDonorResponse {
  success: boolean;
  message: string;
  data: IDonorProfile | null;
}
