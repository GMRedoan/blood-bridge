/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { BloodGroup, bloodGroups } from "@/types/donor/donor";
import Logo from "@/components/Reusable/Logo";
 
interface SetBloodGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (bloodGroup: BloodGroup) => Promise<unknown>;
}

export default function SetBloodGroupDialog({
  open,
  onOpenChange,
  onSave,
}: SetBloodGroupDialogProps) {
  const [bloodGroup, setBloodGroup] = useState<BloodGroup | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setBloodGroup("");
      setError("");
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!bloodGroup) {
      setError("Please select your blood group.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await onSave(bloodGroup);

      onOpenChange(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update blood group.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader className="items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Logo/>
          </div>

          <DialogTitle className="text-xl">Set Your Blood Group</DialogTitle>

          <DialogDescription>
            Select your correct blood group to complete your donor profile.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-3">
          <div className="space-y-2">
            <Label htmlFor="bloodGroup">Blood Group</Label>

            <Select
              value={bloodGroup}
              onValueChange={(value) => setBloodGroup(value as BloodGroup)}
            >
              <SelectTrigger id="bloodGroup" className="h-11">
                <SelectValue placeholder="Choose your blood group" />
              </SelectTrigger>

              <SelectContent>
                {bloodGroups.map((group) => (
                  <SelectItem key={group.value} value={group.value}>
                    {group.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={loading || !bloodGroup}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Saving..." : "Save Blood Group"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
