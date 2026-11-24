"use client";

import Link from "next/link";
import {
  ArrowRight,
  Droplets,
  HandCoins,
  HeartHandshake,
  Siren,
} from "lucide-react";
import Animate from "@/components/Reusable/Animate";

const ACTIONS = [
  {
    icon: Droplets,
    title: "Matched Requests",
    text: "Find blood requests that match your blood type.",
    href: "/dashboard/donor/matchingRequest",
    cta: "Find requests",
  },
  {
    icon: Siren,
    title: "Request blood",
    text: "Post a verified request and reach donors near you.",
    href: "/dashboard/patient/createBloodRequest",
    cta: "Post a request",
  },
  {
    icon: HandCoins,
    title: "Fund a cause",
    text: "Support treatment costs through secure campaigns.",
    href: "/campaign",
    cta: "Explore campaigns",
  },
];

const FinalCta = () => {
  return (
    <section className="py-10 pb-20">
      <Animate
        type="fadeUp"
        className="relative isolate overflow-hidden bg-background text-primary-foreground"
      >
        {/* Background layers */}
        <div className="pointer-events-none absolute -left-16 top-36 -z-10 h-52 w-52 rounded-full bg-white/15 blur-3xl" />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-[0.10] text-primary"
          style={{
            backgroundImage:
              "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />

        {/* Heartbeat line */}
        <svg
          viewBox="0 0 1200 200"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 h-32 w-full -translate-y-1/2 sm:h-40"
        >
          <defs>
            <linearGradient id="traceFill" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#ff4560" />
              <stop offset=".6" stopColor="#ff4560" />
              <stop offset=".78" stopColor="#f5ecea" stopOpacity=".45" />
              <stop offset="1" stopColor="#f5ecea" stopOpacity=".3" />
            </linearGradient>
          </defs>
          <path
            className="trace"
            pathLength={1}
            fill="none"
            stroke="url(#traceFill)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            style={{ filter: "drop-shadow(0 0 6px rgba(255,69,96,.7))" }}
            d="M0 100H100L112 88L124 100H160L168 110L180 20L194 168L204 100H250Q272 70 294 100H400L412 88L424 100H460L468 110L480 20L494 168L504 100H550Q572 70 594 100H700L712 92L724 100H760L768 106L778 60L788 130L796 100H830Q845 88 860 100H1200"
          />
        </svg>

        {/* Floating drop */}
        <Droplets
          aria-hidden
          className="animate-float pointer-events-none absolute right-16 top-6 -z-10 hidden h-40 w-40 text-white/10 md:block"
        />

        <div className="px-6 pt-14 text-center sm:px-12 lg:pt-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold backdrop-blur text-primary">
            <HeartHandshake className="h-3.5 w-3.5" />
            Join the community
          </span>

          <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-foreground">
            One donation can save up to three lives. Start yours today.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-base opacity-90 sm:text-lg text-muted-foreground">
            Whether you give blood, ask for help or back a campaign, you become
            part of someone&apos;s recovery.
          </p>
        </div>

        {/* Action cards */}
        <Animate type="zoom" className="grid gap-4 px-6 pb-8 pt-10 sm:px-22 md:grid-cols-3 lg:pb-12 lg:pt-12">
          {ACTIONS.map(({ icon: Icon, title, text, href, cta }) => (
            <Link
              key={title}
              href={href}
              className="group flex flex-col rounded-2xl border border-primary/20 bg-card p-5 text-left backdrop-blur transition-all hover:-translate-y-1 text-foreground"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-background text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-1 flex-1 text-sm opacity-85">{text}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold">
                {cta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </Animate>
      </Animate>
    </section>
  );
};

export default FinalCta;
