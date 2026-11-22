/* eslint-disable react-hooks/incompatible-library */
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MapPin, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { editRequest } from "@/server/patient/patient.service";
import { myBloodRequests } from "@/types/patient/patient";
import {
  editRequestValidationSchema,
  IEditRequestPayload,
} from "@/validation/request.schema";
import { Toast } from "@/components/Reusable/Toast";
import { BloodGroup } from "@/types/donor/donor";
import DistrictCombobox from "@/components/Shared/DistrictCombobox";

interface EditRequestDialogProps {
  request: myBloodRequests;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditRequestDialog({
  request,
  open,
  onOpenChange,
}: EditRequestDialogProps) {
  const router = useRouter();
  const form = useForm<IEditRequestPayload>({
    resolver: zodResolver(editRequestValidationSchema),
    defaultValues: {
      requesterType: request.requesterType as "INDIVIDUAL" | "HOSPITAL",
      patientName: request.patientName,
      bloodGroup: request.bloodGroup as BloodGroup,
      unitsNeeded: request.unitsNeeded,
      hospitalName: request.hospitalName ?? "",
      reason: request.reason,
      city: request.city,
      area: request.area,
      urgency: request.urgency as "normal" | "urgent",
    },
  });
  const requesterType = form.watch("requesterType");
  const { isSubmitting } = form.formState;

  useEffect(() => {
    if (!open) return;

    form.reset({
      requesterType: request.requesterType as "INDIVIDUAL" | "HOSPITAL",
      patientName: request.patientName,
      bloodGroup: request.bloodGroup as BloodGroup,
      unitsNeeded: request.unitsNeeded,
      hospitalName: request.hospitalName ?? "",
      reason: request.reason,
      city: request.city,
      area: request.area,
      urgency: request.urgency as "normal" | "urgent",
    });
  }, [request, open, form, form.reset]);

  const onSubmit = async (payload: IEditRequestPayload) => {
    try {
      const response = await editRequest(request.id, payload);
      if (!response.success) {
        Toast({
          icon: "error",
          title: response.message ?? "Failed to update request",
        });
        return;
      }

      Toast({
        icon: "success",
        title: "Request updated successfully",
      });

      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error("Edit request error:", error);

      Toast({
        icon: "error",
        title: "Failed to update request",
      });
    }
  };
  const inputClass = "h-11";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl p-8">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Pencil className="h-5 w-5 text-primary" />
            Edit Blood Request
          </DialogTitle>

          <DialogDescription>
            Update your blood request information below.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Requester type */}

            <FormField
              control={form.control}
              name="requesterType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Requesting as</FormLabel>

                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);

                      if (value === "INDIVIDUAL") {
                        form.setValue("hospitalName", "", {
                          shouldValidate: false,
                          shouldDirty: true,
                        });

                        form.clearErrors("hospitalName");
                      }
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className={inputClass}>
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
                        className={inputClass}
                        {...field}
                        value={field.value ?? ""}
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
                          className={inputClass}
                          {...field}
                          value={field.value ?? ""}
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

                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className={inputClass}>
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
                        className={inputClass}
                        value={field.value ?? ""}
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
                  Update the district and area where the patient needs blood.
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
                        value={field.value ?? ""}
                        onChange={field.onChange}
                      />
                    </FormControl>

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
                        className={inputClass}
                        {...field}
                        value={field.value ?? ""}
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
                      <SelectTrigger className={inputClass}>
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
                      value={field.value ?? ""}
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

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={isSubmitting} className="gap-2">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Updating request...
                  </>
                ) : (
                  <>
                    <Pencil className="h-4 w-4" />
                    Save changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
