import z from "zod";

const userRoleEnum = z.enum(["PATIENT", "DONOR", "HOSPITAL"]);

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  phone: z
    .string()
    .regex(/^[0-9+\-\s]{7,15}$/, "Invalid phone number")
    .optional(),
  password: z
    .string()
    .min(6, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).*$/,
      "Password must contain uppercase, lowercase, number, and special character",
    ),
  city: z.string().min(1, "City is required"),
  role: userRoleEnum.optional(),
});

export const loginSchema = z.object({
  email: z
    .email("Please enter a valid email address")
    .min(1, "Email is required"),

  password: z.string().min(1, "Password is required"),
});

export const resetPasswordSchema = z.object({
  email: z
    .email("Please enter a valid email address")
    .min(1, "Email is required"),

  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must be numeric"),

  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).*$/,
      "Password must contain uppercase, lowercase, number, and special character",
    ),
}); 
