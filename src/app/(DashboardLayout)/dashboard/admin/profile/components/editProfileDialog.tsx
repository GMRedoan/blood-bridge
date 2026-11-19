/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Separator } from "@/components/ui/separator";

import {
  UserRound,
  Lock,
  Droplet,
  Loader2,
  AlertCircle,
  Camera,
} from "lucide-react";

import { BloodGroup, bloodGroups, formatBloodGroup } from "@/types/donor/donor";

import { IGetUserProfile, IUpdateUser } from "@/types/user/user";

import { Toast } from "@/components/Reusable/Toast";
import { updateUser } from "@/server/user/user.service";
import { updateDonorProfile } from "@/server/donor/donor.service";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { uploadImage } from "@/lib/uploadImage";

import Image from "next/image";
import { useAuth } from "@/providers/AuthProvider";
import DistrictCombobox from "@/components/Shared/DistrictCombobox";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: IGetUserProfile;
}

export default function EditProfileDialog({
  open,
  onOpenChange,
  profile,
}: EditProfileDialogProps) {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const isDonor = profile.role?.toLowerCase() === "donor";
  const hasDonorProfile = !!profile.donorProfile;
  const hasBloodGroup = Boolean(profile.donorProfile?.bloodGroup);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(profile?.profilePhoto ?? "");
  const [loading, setLoading] = useState(false);

  const [bloodGroup, setBloodGroup] = useState<BloodGroup | "">(
    profile.donorProfile?.bloodGroup || "",
  );

  // React Hook Form
  const form = useForm<IUpdateUser>({
    defaultValues: {
      name: profile.name || "",
      phone: profile.phone || "",
      city: profile.city || "",
      area: profile.area || "",
      profilePhoto: profile.profilePhoto || "",
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;

  // Reset form whenever the dialog opens or profile changes
  useEffect(() => {
    if (open) {
      reset({
        name: profile.name || "",
        phone: profile.phone || "",
        city: profile.city || "",
        area: profile.area || "",
        profilePhoto: profile.profilePhoto || "",
      });

      setBloodGroup(profile.donorProfile?.bloodGroup || "");
      setPreview(profile.profilePhoto ?? "");
      setSelectedFile(null);
    }
  }, [open, profile, reset]);

  // Handle profile image selection
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // Submit profile update
  const onSubmit = async (formValues: IUpdateUser) => {
    if (loading) return;

    let imageUrl = profile?.profilePhoto;

    setLoading(true);

    try {
      // Upload image if a new image is selected
      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
      }

      const payload: IUpdateUser = {
        ...formValues,
        profilePhoto: imageUrl,
      };

      // Update user information
      const userResult = await updateUser(payload);

      if (!userResult.success) {
        Toast({
          title: userResult.message || "Unable to update your profile.",
          icon: "error",
        });

        console.error("PROFILE UPDATE ERROR:", userResult.message);
        return;
      }

      // Update donor blood group only when applicable
      if (
        isDonor &&
        hasDonorProfile &&
        hasBloodGroup &&
        bloodGroup &&
        bloodGroup !== profile.donorProfile?.bloodGroup
      ) {
        const donorResult = await updateDonorProfile(bloodGroup);

        if (!donorResult.success) {
          Toast({
            title:
              donorResult.message || "Unable to update your donor information.",
            icon: "error",
          });

          return;
        }
      }

      await refreshUser();
      router.refresh();

      Toast({
        title: "Your profile has been updated successfully.",
        icon: "success",
      });

      onOpenChange(false);
    } catch (error) {
      console.error("PROFILE UPDATE ERROR:", error);

      Toast({
        title: "Something went wrong while updating your profile.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl sm:max-w-180">
        {/* Header */}
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-3">
              <UserRound className="h-6 w-6 text-primary" />
            </div>

            <div>
              <DialogTitle className="text-xl">Edit Your Profile</DialogTitle>

              <DialogDescription>
                Update your personal and donor information.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-3">
            {/* Profile Image */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-primary/20">
                {preview ? (
                  <Image
                    src={preview}
                    alt="Profile preview"
                    fill
                    className="object-cover"
                    unoptimized={preview.startsWith("blob:")}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-muted text-3xl font-bold">
                    {profile.name.charAt(0)}
                  </div>
                )}
              </div>

              <Label htmlFor="photo" className="cursor-pointer">
                <div className="flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-muted">
                  <Camera className="h-4 w-4" />
                  Change Photo
                </div>
              </Label>

              <Input
                id="photo"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImage}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>

              <div className="relative">
                <Input
                  id="email"
                  value={profile.email}
                  readOnly
                  className="bg-muted pr-10"
                />

                <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>

              <p className="text-xs text-muted-foreground">
                Your email address cannot be changed.
              </p>
            </div>

            <Separator />

            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="font-semibold">Personal Information</h3>

              {/* Full Name */}
              <FormField
                control={control}
                name="name"
                rules={{
                  required: "Full name is required",
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>

                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        placeholder="Enter your full name"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={control}
                name="phone"
                rules={{
                  required: "Phone number is required",
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>

                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        type="tel"
                        placeholder="Enter phone number"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* City */}
              <FormField
                control={control}
                name="city"
                rules={{
                  required: "City is required",
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>

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

              {/* Area */}
              <FormField
                control={control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Area</FormLabel>

                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        placeholder="Enter your area"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Donor Information */}
            {isDonor && hasDonorProfile !== null && (
              <>
                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Droplet className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Donor Information</h3>
                  </div>

                  {hasBloodGroup ? (
                    <div className="space-y-2">
                      <Label>Blood Group</Label>

                      <Select
                        value={bloodGroup}
                        onValueChange={(value) =>
                          setBloodGroup(value as BloodGroup)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select blood group" />
                        </SelectTrigger>

                        <SelectContent>
                          {bloodGroups.map((group) => (
                            <SelectItem key={group.value} value={group.value}>
                              {group.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <p className="text-xs text-muted-foreground">
                        Current blood group:{" "}
                        {formatBloodGroup(profile.donorProfile?.bloodGroup)}
                      </p>
                    </div>
                  ) : (
                    <Alert className="border-amber-500/30 bg-amber-500/5">
                      <AlertCircle className="h-4 w-4 text-amber-600" />

                      <AlertDescription className="text-sm">
                        Please set your blood group first before updating your
                        donor information. You can set it from your Donor
                        Membership section.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                disabled={loading}
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={loading || isSubmitting}>
                {(loading || isSubmitting) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}

                {loading || isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
