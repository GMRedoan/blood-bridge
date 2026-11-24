"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Animate from "@/components/Reusable/Animate";
import { IContribution } from "@/types/contribution/contribution";
import ContributionHistoryTable from "@/components/Reusable/ContributionHistoryTable";

interface ContributionHistoryProps {
  isAdmin: boolean;
  myContributions: IContribution[];
  allContributions?: IContribution[];
}

const ContributionHistory = ({
  isAdmin,
  myContributions,
  allContributions = [],
}: ContributionHistoryProps) => {
  return (
    <div className="space-y-6 p-6">
      <Animate>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Contribution History
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {isAdmin
            ? "Review every contribution on the platform, or just your own."
            : "Track the contributions you have made."}
        </p>
      </Animate>

      {isAdmin ? (
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">
              All Contributions ({allContributions.length})
            </TabsTrigger>
            <TabsTrigger value="mine">
              My Contributions ({myContributions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <ContributionHistoryTable
              contributions={allContributions}
              showContributor
            />
          </TabsContent>

          <TabsContent value="mine">
            <ContributionHistoryTable contributions={myContributions} />
          </TabsContent>
        </Tabs>
      ) : (
        <ContributionHistoryTable contributions={myContributions} />
      )}
    </div>
  );
};

export default ContributionHistory;
