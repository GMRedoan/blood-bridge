"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import {
  AlertCircle,
  Droplets,
  HeartPulse,
  Loader2,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createBloodRequest } from "@/server/patient/patient.service";
import { getCanonicalDistrict } from "@/components/Reusable/bangladesh-districts";
import {
  CreateBloodRequestInput,
  createRequestFormSchema,
} from "@/validation/request.schema";
import Animate from "@/components/Reusable/Animate";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import DistrictCombobox from "@/components/Shared/DistrictCombobox";
import { Toast } from "@/components/Reusable/Toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";

interface CreateBloodRequestFormProps {
  profileCity?: string | null;
  profileArea?: string | null;
}

const CreateBloodRequestForm = ({
  profileCity,
  profileArea,
}: CreateBloodRequestFormProps) => {
  const { user } = useAuth();
  const router = useRouter();
  const form = useForm<
    CreateBloodRequestInput,
    unknown,
    CreateBloodRequestInput
  >({
    resolver: zodResolver(createRequestFormSchema),
    defaultValues: {
      requesterType: user?.role === "PATIENT" ? "INDIVIDUAL" : "HOSPITAL",
      patientName: "",
      bloodGroup: undefined,
      unitsNeeded: 1,
      hospitalName: "",
      reason: "",
      city: getCanonicalDistrict(profileCity),
      area: profileArea ?? "",
      urgency: "normal",
    },
  });
  const requesterType = useWatch({
    control: form.control,
    name: "requesterType",
  });

  const onSubmit = async (payload: CreateBloodRequestInput) => {
    try {
      const response = await createBloodRequest(payload);
      if (!response?.success) {
        Toast({
          icon: "error",
          title:
            response.message ?? "Something went wrong. Please try again later.",
        });
        return;
      }
      router.push(`/dashboard/${user?.role.toLocaleLowerCase()}/myBloodRequests`);
      Toast({
        icon: "success",
        title: "Your blood request has been submitted successfully.",
      });
      form.reset({
        requesterType: "INDIVIDUAL",
        patientName: "",
        bloodGroup: undefined,
        unitsNeeded: 0,
        hospitalName: "",
        reason: "",
        city: getCanonicalDistrict(profileCity),
        area: "",
        urgency: "normal",
      });
    } catch {
      form.setError("root.server", {
        message: "Something went wrong. Please try again later.",
      });
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-7 px-4 py-8">
      {/* Heading */}
      <Animate type="fadeDown">
        <div className="relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
          <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <HeartPulse className="h-7 w-7" />
            </div>

            <div>
              <p className="text-sm font-semibold text-primary">BLOOD BRIDGE</p>
              <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                Create blood request
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Every request can help save a life. Provide accurate information
                to find matching donors.
              </p>
            </div>
          </div>
        </div>
      </Animate>

      {/* Form */}
      <Animate type="fadeUp" delay={0.1}>
        <div className="relative overflow-hidden rounded-2xl border bg-card p-5 shadow-sm sm:p-8">
          <div className="pointer-events-none absolute -right-20 -top-20 opacity-10">
            <HeartPulse className="h-100 w-100 text-primary" />
          </div>

          <div className="mb-7">
            <h2 className="text-lg font-bold">
              Request <span className="text-primary">information</span>
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Fill in the details below to find compatible donors.
            </p>
          </div>
 
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Requester type */}
              <FormField
                control={form.control}
                name="requesterType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Requesting as</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select requester type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="INDIVIDUAL">
                          Individual / Patient
                        </SelectItem>
                        <SelectItem value="HOSPITAL">Hospital</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Patient name and hospital */}
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="patientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter patient name"
                          className="h-11"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {requesterType === "HOSPITAL" && (
                  <FormField
                    control={form.control}
                    name="hospitalName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hospital name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter hospital name"
                            className="h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              {/* Blood group and units */}
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="bloodGroup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blood group</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select blood group" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[
                            ["A_POS", "A+"],
                            ["A_NEG", "A-"],
                            ["B_POS", "B+"],
                            ["B_NEG", "B-"],
                            ["AB_POS", "AB+"],
                            ["AB_NEG", "AB-"],
                            ["O_POS", "O+"],
                            ["O_NEG", "O-"],
                          ].map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="unitsNeeded"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Units required</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={20}
                          className="h-11"
                          value={field.value}
                          onChange={(event) =>
                            field.onChange(
                              event.target.value === ""
                                ? undefined
                                : Number(event.target.value),
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Location */}
              <div className="space-y-4 rounded-xl border bg-muted/20 p-4 sm:p-5">
                <div>
                  <h3 className="flex items-center gap-2 font-semibold">
                    <MapPin className="h-4 w-4 text-primary" />
                    Request location
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Select the district where the patient needs blood.
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>District</FormLabel>
                      <FormControl>
                        <DistrictCombobox
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormDescription>
                        Your profile district is preselected when available.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Area / Upazila / Thana</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Mirpur, Dhanmondi, Savar"
                          className="h-11"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Urgency */}
              <FormField
                control={form.control}
                name="urgency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Request urgency</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select urgency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Reason */}
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for blood request</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Briefly explain why blood is needed..."
                        className="min-h-28 resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide relevant information to help donors understand the
                      request.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Server error */}
              {form.formState.errors.root?.server && (
                <div className="flex items-start gap-2 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  {form.formState.errors.root.server.message}
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="h-12 w-full gap-2 text-sm font-semibold"
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting request...
                  </>
                ) : (
                  <>
                    <Droplets className="h-4 w-4" />
                    Submit blood request
                  </>
                )}
              </Button>

              <p className="text-center text-xs leading-5 text-muted-foreground">
                Please ensure all information is accurate. Your request may be
                reviewed before donors are notified.
              </p>
            </form>
          </Form>
        </div>
      </Animate>
    </div>
  );
};

export default CreateBloodRequestForm;
