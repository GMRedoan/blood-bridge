"use client";

import { useState } from "react";
import { HeartHandshake, Loader2, ShieldCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createContribution } from "@/server/contribution/contribution.service";
import { Toast } from "@/components/Reusable/Toast"; // your path
import { ICreateContributionResponse } from "@/types/contribution/contribution";

interface ContributeDialogProps {
  campaignId: string;
  campaignTitle: string;
  isLoggedIn: boolean;
  disabled?: boolean;
}
const QUICK_AMOUNTS = [500, 1000, 2000, 5000];
const MIN_AMOUNT = 10;

const ContributeDialog = ({
  campaignId,
  campaignTitle,
  isLoggedIn,
  disabled = false,
}: ContributeDialogProps) => {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTrigger = () => {
    if (!isLoggedIn) {
      Toast({ icon: "info", title: "Please log in to contribute" });
      return;
    }
    setOpen(true);
  };

  const handleSubmit = async () => {
    const value = Number(amount);
    if (!amount || Number.isNaN(value) || value < MIN_AMOUNT) {
      setError(`Minimum contribution is ৳${MIN_AMOUNT}`);
      return;
    }
    try {
      setError("");
      setLoading(true);

      const result = await createContribution({ campaignId, amount: value });
      const data = result as unknown as Partial<ICreateContributionResponse>;
      const checkoutUrl = data?.data?.contribution?.checkoutUrl;

      if (!checkoutUrl) throw new Error("Checkout URL not found");

      window.location.href = checkoutUrl;
    } catch (err) {
      console.error("Failed to create contribution:", err);
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        onClick={handleTrigger}
        disabled={disabled}
        className="w-full gap-2"
      >
        <HeartHandshake className="h-4 w-4" />
        {disabled ? "Goal reached" : "Contribute Now"}
      </Button>

      <Dialog
        open={open}
        onOpenChange={(value) => {
          if (loading) return;
          setOpen(value);
          if (!value) {
            setAmount("");
            setError("");
          }
        }}
      >
        <DialogContent className="sm:max-w-md p-6">
          <DialogHeader>
            <DialogTitle>Make a contribution</DialogTitle>
            <DialogDescription className="line-clamp-2">
              You are supporting &quot;{campaignTitle}&quot;.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-2">
              {QUICK_AMOUNTS.map((value) => (
                <button
                  key={value}
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    setAmount(String(value));
                    setError("");
                  }}
                  className={`rounded-lg border px-2 py-2 text-sm font-semibold transition-colors ${
                    Number(amount) === value
                      ? "border-primary bg-primary/10 text-primary"
                      : "hover:border-primary/50 hover:bg-secondary"
                  }`}
                >
                  ৳{value.toLocaleString("en-BD")}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Or enter a custom amount (৳)</Label>
              <Input
                id="amount"
                type="number"
                min={MIN_AMOUNT}
                placeholder="e.g. 1500"
                value={amount}
                disabled={loading}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError("");
                }}
              />
              {error && <p className="text-xs text-destructive">{error}</p>}
            </div>

            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              You will be redirected to Stripe for a secure payment.
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => setOpen(false)}
            >
              Go back
            </Button>
            <Button
              type="button"
              disabled={loading}
              onClick={handleSubmit}
              className="gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Redirecting..." : "Continue to payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContributeDialog;
