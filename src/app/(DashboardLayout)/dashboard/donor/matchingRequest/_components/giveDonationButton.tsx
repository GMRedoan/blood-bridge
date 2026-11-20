"use client";

import { Toast } from "@/components/Reusable/Toast";
import { Button } from "@/components/ui/button";
import { createDonation } from "@/server/donor/donor.service";
import { Heart, ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface GiveDonationButtonProps {
  requestId: string;
}

const GiveDonationButton = ({ requestId }: GiveDonationButtonProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
const handleGiveDonation = async () => {
  try {
    setIsLoading(true);

    const result = await createDonation(requestId);

    if (!result.success) {
      Toast({
        icon: "error",
        title: result.message || "Failed to submit donation request",
      });
      return;
    }

    Toast({
      icon: "success",
      title: result.message || "Donation request submitted successfully",
    });

    router.refresh();
  } catch (error) {
    Toast({
      icon: "error",
      title: "Something went wrong. Please try again.",
    });
  } finally {
    setIsLoading(false);
  }
};
  return (
    <Button
      type="button"
      onClick={handleGiveDonation}
      className="group w-full py-4"
      disabled={isLoading}
    >
      <Heart size={17} className="mr-2" />
      {isLoading ? "Submitting..." : "Give Donation"}
      {!isLoading && (
        <ArrowUpRight
          size={17}
          className="ml-auto transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      )}
    </Button>
  );
};

export default GiveDonationButton;
