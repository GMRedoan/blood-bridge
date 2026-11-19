import { bangladeshDistricts } from "@/components/Reusable/bangladesh-districts";
import z from "zod";

export const createRequestFormSchema = z.object({
  requesterType: z.enum(["INDIVIDUAL", "HOSPITAL"]),
  patientName: z.string().trim().min(1, "Patient name is required"),
  bloodGroup: z.enum([
    "A_POS",
    "A_NEG",
    "B_POS",
    "B_NEG",
    "AB_POS",
    "AB_NEG",
    "O_POS",
    "O_NEG",
  ]),
  unitsNeeded: z
    .number()
    .int("Units must be a whole number")
    .positive("Units needed must be positive"),
  city: z
    .string()
    .refine(
      (value) => bangladeshDistricts.some((district) => district === value),
      "Please select a valid Bangladesh district",
    ),

  area: z.string().trim().min(1, "Area is required"),
  urgency: z.enum(["normal", "urgent"], {
    error: "Please select an urgency level",
  }),
  hospitalName: z.string().optional(),
  reason: z.string().trim().min(1, "Reason is required"),
});

export type CreateBloodRequestInput = z.infer<typeof createRequestFormSchema>;

export const createRequestValidationSchema = z.object({
  body: createRequestFormSchema,
});


export const editRequestValidationSchema = z
  .object({
    requesterType: z.enum(["INDIVIDUAL", "HOSPITAL"]).optional(),

    patientName: z
      .string()
      .trim()
      .min(1, "Patient name is required")
      .optional(),

    bloodGroup: z
      .enum([
        "A_POS",
        "A_NEG",
        "B_POS",
        "B_NEG",
        "AB_POS",
        "AB_NEG",
        "O_POS",
        "O_NEG",
      ])
      .optional(),

    unitsNeeded: z
      .number()
      .int("Units must be a whole number")
      .positive("Units needed must be positive")
      .optional(),

    hospitalName: z.string().trim().optional(),

    reason: z.string().trim().min(1, "Reason is required").optional(),

    city: z
      .string()
      .refine(
        (value) => bangladeshDistricts.some((district) => district === value),
        "Please select a valid Bangladesh district",
      )
      .optional(),

    area: z.string().trim().min(1, "Area is required").optional(),

    urgency: z.enum(["normal", "urgent", "emergency"]).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.requesterType === "HOSPITAL" && !data.hospitalName?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["hospitalName"],
        message: "Hospital name is required",
      });
    }

    if (Object.keys(data).length === 0) {
      ctx.addIssue({
        code: "custom",
        message: "At least one field must be provided",
      });
    }
  });

export type IEditRequestPayload = z.infer<typeof editRequestValidationSchema>;
