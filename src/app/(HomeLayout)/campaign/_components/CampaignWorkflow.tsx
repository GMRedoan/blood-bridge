import Animate from "@/components/Reusable/Animate";
import { HandCoins, Search, TrendingUp } from "lucide-react";

const STEPS = [
  {
    icon: Search,
    title: "Choose a cause",
    text: "Browse verified campaigns created by hospitals and admins.",
  },
  {
    icon: HandCoins,
    title: "Contribute securely",
    text: "Pick an amount and pay safely through Stripe.",
  },
  {
    icon: TrendingUp,
    title: "Watch the impact",
    text: "Track funding progress as the community comes together.",
  },
];

const CampaignWorkflow = () => {
  return (
    <Animate type="fadeUp" className="grid gap-4 md:grid-cols-3">
      {STEPS.map(({ icon: Icon, title, text }, index) => (
        <div key={title} className="flex gap-4 rounded-2xl border p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            {index + 1}
          </div>
          <div>
            <h3 className="flex items-center gap-2 font-semibold text-foreground">
              <Icon className="h-4 w-4 text-primary" />
              {title}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{text}</p>
          </div>
        </div>
      ))}
    </Animate>
  );
};

export default CampaignWorkflow;