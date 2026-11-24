import Animate from '@/components/Reusable/Animate';
import { formatMoney } from '@/lib/formatMoney';
import { ICampaign } from '@/types/campaign/campaign';
import { HandCoins, HeartHandshake, Target } from 'lucide-react';
import { useMemo } from 'react';

interface CampaignsProps {
  campaigns: ICampaign[];
}

const Stats = ({campaigns}: CampaignsProps) => {
      const stats = useMemo(() => {
      const raised = campaigns.reduce((s, c) => s + c.raisedAmount, 0);
        const goal = campaigns.reduce((s, c) => s + c.targetAmount, 0);
        return { raised, goal, count: campaigns.length };
      }, [campaigns]);
    
    return (
      <Animate type="zoom" className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          {
            icon: HeartHandshake,
            label: "Active campaigns",
            value: stats.count.toLocaleString("en-BD"),
          },
          {
            icon: HandCoins,
            label: "Total raised",
            value: formatMoney(stats.raised),
          },
          {
            icon: Target,
            label: "Combined goal",
            value: formatMoney(stats.goal),
          },
        ].map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="flex items-center gap-4 rounded-2xl border bg-card/70 p-4 backdrop-blur"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-2xl font-bold text-foreground">{value}</p>
            </div>
          </div>
        ))}
      </Animate>
    );
};

export default Stats;