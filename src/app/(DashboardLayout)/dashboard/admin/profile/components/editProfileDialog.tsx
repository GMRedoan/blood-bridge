/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
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
  const [formData, setFormData] = useState({
    name: profile.name || "",
    phone: profile.phone || "",
    city: profile.city || "",
    area: profile.area || "",
    profilePhoto: profile.profilePhoto || "",
  });

  const [bloodGroup, setBloodGroup] = useState<BloodGroup | "">(
    profile.donorProfile?.bloodGroup || "",
  );

  useEffect(() => {
    if (open) {
      setFormData({
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
  }, [open, profile]);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    let imageUrl = profile?.profilePhoto;
    setLoading(true);

    try {
      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
      }

      const payload: IUpdateUser = {
        ...formData,
        profilePhoto: imageUrl,
      };
      const userResult = await updateUser(payload);
      if (!userResult.success) {
        Toast({
          title: userResult.message || "Unable to update your profile.",
          icon: "error",
        });
        console.error("PROFILE UPDATE ERROR:", userResult.message);
        return;
      }
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

        <form onSubmit={handleSubmit} className="space-y-5 pt-3">
          <div className="flex flex-col items-center gap-3">
            <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-primary/20">
              {preview ? (
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  className="object-cover"
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

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>

              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>

              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>

              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter your city"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Area</Label>

              <Input
                id="area"
                name="area"
                value={formData.area}
                onChange={handleChange}
                placeholder="Enter your area"
              />
            </div>
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

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
