import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart, Droplet, UserPlus } from "lucide-react";
import Logo from "@/components/Reusable/Logo";

interface InfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const InfoDialog = ({ open, onOpenChange }: InfoDialogProps) => {

   return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader className="items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <Logo/>
          </div>

          <DialogTitle className="mt-3 text-2xl font-bold">
            Become a Blood Donor
          </DialogTitle>

          <DialogDescription className="text-center">
            Your one step can save someones life. Join our donor community and help people in need.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-3">
          <h3 className="font-semibold text-primary/80">
            How to become a donor?
          </h3>

          <div className="flex items-start gap-3">
            <div className="rounded-full bg-red-50 p-2">
              <UserPlus className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="font-medium">1. Register as a donor</p>
              <p className="text-sm text-muted-foreground">
                Create an account on our platform to join our donor community.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="rounded-full bg-red-50 p-2">
              <Droplet className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="font-medium">2. Set your blood group</p>
              <p className="text-sm text-muted-foreground">
                Add your blood group and other necessary information to your
                profile.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="rounded-full bg-red-50 p-2">
              <Heart className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="font-medium">3. Help save lives</p>
              <p className="text-sm text-muted-foreground">
                Once registered, you can connect with people who need blood
                donations.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            Maybe Later
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Be a hero. Donate blood. Save lives.
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default InfoDialog;
