"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Droplets, HeartHandshake, Info } from "lucide-react";
import Animate from "@/components/Reusable/Animate";
import { BLOOD_GROUPS } from "@/app/(HomeLayout)/about/page";
import { Button } from "../ui/button";
import { useAuth } from "@/providers/AuthProvider";

type Group = (typeof BLOOD_GROUPS)[number];

const DONATE_TO: Record<Group, Group[]> = {
  "O-": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
  "O+": ["O+", "A+", "B+", "AB+"],
  "A-": ["A-", "A+", "AB-", "AB+"],
  "A+": ["A+", "AB+"],
  "B-": ["B-", "B+", "AB-", "AB+"],
  "B+": ["B+", "AB+"],
  "AB-": ["AB-", "AB+"],
  "AB+": ["AB+"],
};

const RECEIVE_FROM = BLOOD_GROUPS.reduce(
  (acc, group) => {
    acc[group] = BLOOD_GROUPS.filter((other) =>
      DONATE_TO[other].includes(group),
    );
    return acc;
  },
  {} as Record<Group, Group[]>,
);

const BADGES: Partial<Record<Group, string>> = {
  "O-": "Universal donor",
  "AB+": "Universal recipient",
};

const BloodCompatibility = () => {
  const { openRegister } = useAuth();
  const [selected, setSelected] = useState<Group>("O+");
  const donateTo = DONATE_TO[selected];
  const receiveFrom = RECEIVE_FROM[selected];
  const percent = useMemo(
    () => Math.round((donateTo.length / BLOOD_GROUPS.length) * 100),
    [donateTo],
  );

  return (
    <section id="blood" className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
      {/* Heading */}
      <Animate type="fadeUp" className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-semibold uppercase tracking-wider text-primary">
          Know your blood
        </span>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Who can you <span className="text-primary">help?</span>
        </h2>
        <p className="mt-4 text-muted-foreground">
          Pick a blood group to see who it can donate to and who it can receive
          from.
        </p>
      </Animate>

      <Animate
        type="fadeUp"
        className="mt-12 overflow-hidden rounded-3xl border bg-card"
      >
        {/* Group selector */}
        <div
          role="radiogroup"
          aria-label="Blood group"
          className="grid grid-cols-4 gap-2 border-b p-4 sm:grid-cols-8 sm:p-6"
        >
          {BLOOD_GROUPS.map((group) => {
            const active = group === selected;
            return (
              <Button
                variant={`${active ? "default" : "outline"}`}
                key={group}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setSelected(group)}
              >
                {group}
              </Button>
            );
          })}
        </div>

        {/* Result */}
        <div className="grid items-center gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto_1fr] lg:gap-10">
          {/* Can receive from */}
          <div key={`receive-${selected}`}>
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-accent" />
              Can receive from
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {receiveFrom.map((group, index) => (
                <span
                  key={group}
                  className="bc-chip inline-flex h-10 min-w-12 items-center justify-center rounded-full border border-accent/30 bg-accent/10 px-3 text-sm font-bold text-accent"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {group}
                </span>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              {receiveFrom.length} of {BLOOD_GROUPS.length} groups
            </p>
          </div>

          {/* Center drop */}
          <div className="relative mx-auto flex h-44 w-44 items-center justify-center">
            <div
              aria-hidden
              className="absolute inset-0 rounded-full bg-primary/25 blur-2xl"
            />
            <div className="animate-float relative flex h-36 w-36 flex-col items-center justify-center">
              <Droplets
                aria-hidden
                className="absolute inset-0 h-full w-full text-primary"
                strokeWidth={1.2}
              />
              <span
                key={selected}
                className="relative mt-5 text-4xl font-black"
              >
                {selected}
              </span>
            </div>
          </div>

          {/* Can donate to */}
          <div key={`donate-${selected}`} className="lg:text-right">
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground lg:justify-end">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Can donate to
            </h3>
            <div className="mt-4 flex flex-wrap gap-2 lg:justify-end">
              {donateTo.map((group, index) => (
                <span
                  key={group}
                  className="bc-chip inline-flex h-10 min-w-12 items-center justify-center rounded-full border border-primary/30 bg-primary/10 px-3 text-sm font-bold text-primary"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {group}
                </span>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              {donateTo.length} of {BLOOD_GROUPS.length} groups
            </p>
          </div>
        </div>

        {/* Impact bar */}
        <div className="border-t bg-secondary/40 px-6 py-5 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-foreground">
                  {selected} can help {percent}% of blood groups
                </span>
                {BADGES[selected] && (
                  <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-primary-foreground">
                    {BADGES[selected]}
                  </span>
                )}
              </div>
              <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>

            <Button onClick={openRegister}>
              <HeartHandshake className="h-4 w-4" />
              Register as donor
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </Animate>

      <p className="mt-4 flex items-start justify-center gap-2 text-center text-xs text-muted-foreground">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        Based on red blood cell compatibility. Hospitals always run their own
        tests before a transfusion.
      </p>
    </section>
  );
};

export default BloodCompatibility;
