"use client";

import { useState } from "react";
import {
  Activity,
  BadgeCheck,
  CalendarDays,
  Droplet,
  Edit3,
  HeartPulse,
  Mail,
  MapPin,
  Phone,
  User,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Animate from "@/components/Reusable/Animate";
import { Badge } from "@/components/ui/badge";
import { IGetUserProfile } from "@/types/user/user";
import Image from "next/image";
import { DonorStat, ProfileInfo } from "@/components/Reusable/profile";
import InfoDialog from "./infoDialog";
import { BloodGroup, formatBloodGroup } from "@/types/donor/donor";
import EditProfileDialog from "./editProfileDialog";
import SetBloodGroupDialog from "./setBloodGroupDialog";
import { useRouter } from "next/navigation";
import { createDonorProfile } from "@/server/donor/donor.service";
import { Toast } from "@/components/Reusable/Toast";

const formatDate = (date: Date | string | null) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

interface viewProfileProps {
  profile: IGetUserProfile;
}

export default function ViewProfile({ profile }: viewProfileProps) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [showDonorDetails, setShowDonorDetails] = useState(true);
  const [bloodGroupOpen, setBloodGroupOpen] = useState(false);

  const donor = profile?.donorProfile;
  const isDonor = profile.role?.toLowerCase() === "donor";
  const hasBloodGroup = Boolean(donor?.bloodGroup);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-rose-500/10 blur-[100px]" />
      </div>

      <main className="relative space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <Animate type="fadeDown">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
                <HeartPulse className="h-4 w-4 animate-pulse" />
                Blood Bridge Community
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                My Profile
              </h1>

              <p className="mt-2 text-sm text-muted-foreground">
                Manage your personal information and donor identity.
              </p>
            </div>

            <Button
              onClick={() => setEditOpen(true)}
              className="gap-2 shadow-lg shadow-primary/20"
            >
              <Edit3 className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </Animate>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          {/* Personal Information */}
          <Animate type="fadeUp" delay={0.1}>
            <Card className="overflow-hidden border-border/60 shadow-sm">
              <div className="h-1.5 bg-linear-to-r from-red-600 via-rose-500 to-red-400" />

              <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="relative h-22 w-22 shrink-0 overflow-hidden rounded-2xl border border-primary/40 bg-base-200">
                    <Image
                      src={profile?.profilePhoto || "/placeholder.svg"}
                      alt={profile?.name || "Profile photo"}
                      fill
                      sizes="128px"
                      className="object-cover object-center border border-primary/40 hover:border-primary/60"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-bold">{profile?.name}</h2>

                      {profile?.isEmailVerified && (
                        <Badge
                          variant="secondary"
                          className="gap-1 bg-emerald-500/10 text-emerald-600"
                        >
                          <BadgeCheck className="h-3.5 w-3.5" />
                          Verified
                        </Badge>
                      )}
                    </div>

                    <p className="mt-1 break-all text-sm text-muted-foreground">
                      {profile?.email}
                    </p>

                    <Badge variant="outline" className="mt-2">
                      {profile?.role}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <Separator />

              <CardContent className="space-y-4 pt-3">
                <h3 className="font-semibold">Personal Information</h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <ProfileInfo
                    icon={<User />}
                    label="Full Name"
                    value={profile.name}
                  />

                  <ProfileInfo
                    icon={<Mail />}
                    label="Email Address"
                    value={profile?.email}
                  />

                  <ProfileInfo
                    icon={<Phone />}
                    label="Phone Number"
                    value={profile?.phone ? profile.phone : "Not provided"}
                  />

                  <ProfileInfo
                    icon={<MapPin />}
                    label="City"
                    value={profile?.city ? profile.city : "Not provided"}
                  />

                  <ProfileInfo
                    icon={<MapPin />}
                    label="Area"
                    value={profile?.area || "Not provided"}
                  />

                  <ProfileInfo
                    icon={<CalendarDays />}
                    label="Joined On"
                    value={formatDate(profile?.createdAt)}
                  />
                </div>
              </CardContent>
            </Card>
          </Animate>

          <Animate type="fadeUp" delay={0.2}>
            <div>
              {/* Donor Membership */}
              <Card className="relative overflow-hidden border-primary/20 bg-linear-to-br from-primary/10 via-card to-card">
                <div className="pointer-events-none absolute -right-8 -top-8 opacity-10">
                  <HeartPulse className="h-40 w-40 text-primary" />
                </div>

                <CardContent className="relative space-y-5.75 p-6">
                  <div className="flex items-center gap-2 text-primary">
                    <HeartPulse className="h-5 w-5" />
                    <span className="text-2xl font-semibold">
                      Donor Membership
                    </span>
                  </div>

                  {isDonor ? (
                    <>
                      {/* Blood Group */}
                      <div>
                        <p className="text-md text-muted-foreground">
                          Your blood group
                        </p>

                        <div className="mt-2 flex items-center gap-3">
                          {hasBloodGroup ? (
                            <>
                              <span className="text-3xl font-bold text-primary">
                                {formatBloodGroup(donor?.bloodGroup)}
                              </span>

                              <Droplet className="h-8 w-8 fill-primary/20 text-primary" />
                            </>
                          ) : (
                            <div className="space-y-2">
                              <p className="text-sm text-muted-foreground">
                                You have not added your blood group yet.
                              </p>

                              <Button
                                size="sm"
                                onClick={() => setBloodGroupOpen(true)}
                                className="gap-2"
                              >
                                <Droplet className="h-4 w-4" />
                                Set Blood Group
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>

                      {hasBloodGroup && (
                        <>
                          <Badge
                            className={
                              donor?.isAvailable
                                ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10"
                                : "bg-amber-500/10 text-amber-600 hover:bg-amber-500/10"
                            }
                          >
                            <span
                              className={`mr-1.5 h-2 w-2 rounded-full ${
                                donor?.isAvailable
                                  ? "bg-emerald-500"
                                  : "bg-amber-500"
                              }`}
                            />

                            {donor?.isAvailable
                              ? "Available to donate"
                              : "Currently unavailable"}
                          </Badge>

                          <Separator className="bg-primary/10" />

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Total Donations
                              </p>
                              <p className="mt-1 text-lg font-bold">
                                {donor?.totalDonations ?? 0}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-muted-foreground">
                                Last Donation
                              </p>
                              <p className="mt-1 text-lg font-semibold">
                                {donor?.lastDonationDate
                                  ? formatDate(donor.lastDonationDate)
                                  : "No donation yet"}
                              </p>
                            </div>
                          </div>
                        </>
                      )}

                      <Button
                        variant="outline"
                        className="w-full gap-2 border-primary/20 hover:bg-primary/10"
                        onClick={() => setShowDonorDetails(!showDonorDetails)}
                      >
                        {showDonorDetails
                          ? "Hide Donor Details"
                          : "View Donor Details"}

                        {showDonorDetails ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </>
                  ) : (
                    <div className="space-y-3">
                      <h3 className="text-lg font-bold">Become a lifesaver!</h3>

                      <p className="text-sm text-muted-foreground">
                        You are not registered as a blood donor yet. Join our
                        donor community and help save lives.
                      </p>

                      <Button
                        onClick={() => setInfoOpen(true)}
                        className="w-full gap-2"
                      >
                        <HeartPulse className="h-4 w-4" />
                        Become a Donor
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </Animate>
        </div>

        {/* Additional Donor Information */}
        {donor && showDonorDetails && (
          <Animate type="fadeUp">
            <Card className="border-border/60 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Donor Profile Details
                </CardTitle>

                <p className="text-sm text-muted-foreground">
                  Your blood donation information and history.
                </p>
              </CardHeader>

              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <DonorStat
                    label="Blood Group"
                    value={formatBloodGroup(donor?.bloodGroup)}
                    icon={<Droplet />}
                  />

                  <DonorStat
                    label="Availability"
                    value={donor.isAvailable ? "Available" : "Unavailable"}
                    icon={<HeartPulse />}
                  />

                  <DonorStat
                    label="Total Donations"
                    value={String(donor.totalDonations)}
                    icon={<Activity />}
                  />

                  <DonorStat
                    label="Last Donation"
                    value={formatDate(donor.lastDonationDate ?? null) || "N/A"}
                    icon={<CalendarDays />}
                  />
                </div>
              </CardContent>
            </Card>
          </Animate>
        )}
      </main>

      <EditProfileDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        profile={profile}
      />

      <InfoDialog onOpenChange={setInfoOpen} open={infoOpen} />

      <SetBloodGroupDialog
        open={bloodGroupOpen}
        onOpenChange={setBloodGroupOpen}
        onSave={async (bloodGroup: BloodGroup) => {
          const result = await createDonorProfile(bloodGroup);
          Toast({
            title: result.success
              ? "Blood Group Added Successfully"
              : "Something went wrong",
            icon: result.success ? "success" : "error",
          });
          router.refresh();
          return result;
        }}
      />
    </div>
  );
}
