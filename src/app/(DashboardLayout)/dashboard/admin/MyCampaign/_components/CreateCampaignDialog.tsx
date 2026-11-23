"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Loader2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createCampaign } from "@/server/campaign/campaign.service";
import { ICreateCampaign } from "@/types/campaign/campaign";
import { Toast } from "@/components/Reusable/Toast"; 

const CreateCampaignDialog = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ICreateCampaign>({
    defaultValues: { title: "", description: "", targetAmount: undefined },
  });

  const onSubmit = async (values: ICreateCampaign) => {
    try {
      await createCampaign(values);

      Toast({
        icon: "success",
        title: "Campaign created. It will be visible after approval.",
      });

      reset();
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to create campaign:", error);
      Toast({ icon: "error", title: "Failed to create campaign" });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (isSubmitting) return;
        setOpen(value);
        if (!value) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Campaign
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Campaign</DialogTitle>
          <DialogDescription>
            Start a fundraising campaign. An admin will review it before it goes
            live.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g. Help newborn babies"
              {...register("title", {
                required: "Title is required",
                minLength: { value: 5, message: "At least 5 characters" },
                maxLength: { value: 100, message: "Max 100 characters" },
              })}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={5}
              placeholder="Explain why you are raising funds and how they will be used..."
              {...register("description", {
                required: "Description is required",
                minLength: { value: 20, message: "At least 20 characters" },
              })}
            />
            {errors.description && (
              <p className="text-xs text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Target amount */}
          <div className="space-y-2">
            <Label htmlFor="targetAmount">Target amount (৳)</Label>
            <Input
              id="targetAmount"
              type="number"
              min={1}
              placeholder="100000"
              {...register("targetAmount", {
                required: "Target amount is required",
                valueAsNumber: true,
                min: { value: 1, message: "Must be greater than 0" },
                validate: (v) => !Number.isNaN(v) || "Enter a valid number",
              })}
            />
            {errors.targetAmount && (
              <p className="text-xs text-destructive">
                {errors.targetAmount.message}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => {
                setOpen(false);
                reset();
              }}
            >
              Go back
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? "Creating..." : "Create Campaign"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCampaignDialog;
