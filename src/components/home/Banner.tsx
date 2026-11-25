"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  HeartHandshake,
  Lock,
  ScanSearch,
  Sparkles,
} from "lucide-react";
import { BLOOD_GROUPS } from "@/app/(HomeLayout)/about/page";
import { Button } from "../ui/button";
import Animate from "../Reusable/Animate";
import { useAuth } from "@/providers/AuthProvider";

const TRUST = [
  { icon: BadgeCheck, text: "Admin-verified requests" },
  { icon: Lock, text: "Secure Stripe payments" },
  { icon: HeartHandshake, text: "Free to join" },
];

export function Banner() {
  const {openRegister} = useAuth();
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % BLOOD_GROUPS.length),
      1800,
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="relative isolate overflow-hidden bg-linear-to-tr from-primary/5 via-background to-background mt-10">
      {/* background */}
      <div className="pointer-events-none absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-22 left-1/4 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.05] mask-[radial-gradient(70%_70%_at_75%_45%,black,transparent)]"
        style={{
          backgroundImage:
            "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
        {/* Left */}
        <Animate type="fadeLeft">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Every donation counts
          </span>

          <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Someone near you needs your{" "}
            <span className="text-primary">blood group</span> today.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Connect with verified donors, post urgent blood requests, and
            support fundraising campaigns for patients who cannot afford
            treatment.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button onClick={openRegister} size="lg">
              Become a donor
              <ArrowRight className="h-4 w-4" />
            </Button>

            <Button
              className="flex items-center gap-2 px-4"
              size="lg"
              variant="outline"
            >
              <ScanSearch className="h-4 w-4" />
              <Link href="/campaign">Explore campaigns</Link>
            </Button>
          </div>

          {/* Blood group chips */}
          <div className="mt-8 flex flex-wrap gap-2">
            {BLOOD_GROUPS.map((group, i) => (
              <span
                key={group}
                className={`inline-flex h-9 min-w-11 items-center justify-center rounded-full border px-3 text-sm font-bold transition-all ${
                  i === index
                    ? "border-transparent bg-primary text-primary-foreground shadow-md shadow-primary/30"
                    : "border-primary/30 bg-card/70 text-primary"
                }`}
              >
                {group}
              </span>
            ))}
          </div>

          {/* Trust */}
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {TRUST.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-primary" />
                {text}
              </li>
            ))}
          </ul>
        </Animate>

        {/* Right: the drop */}
        <Animate
          type="fadeRight"
          className="relative mx-auto aspect-4/5 w-full max-w-100"
        >
          <div
            aria-hidden
            className="drop-glow absolute inset-[-12%] rounded-full bg-[radial-gradient(circle,rgba(220,25,50,.45),transparent_65%)] blur-2xl"
          />
          <svg
            viewBox="0 0 400 500"
            role="img"
            aria-label="A blood drop with a heartbeat line"
            className="relative h-full w-full drop-shadow-2xl"
          >
            <defs>
              <linearGradient id="dropFill" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#ff4560" stopOpacity=".95" />
                <stop offset=".55" stopColor="#9d0f27" stopOpacity=".95" />
                <stop offset="1" stopColor="#3a0612" stopOpacity=".98" />
              </linearGradient>
              <linearGradient id="gloss" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#fff" stopOpacity=".5" />
                <stop offset="1" stopColor="#fff" stopOpacity="0" />
              </linearGradient>
              <clipPath id="dropClip">
                <path d="M200 20C200 20 40 220 40 320c0 90 72 160 160 160s160-70 160-160C360 220 200 20 200 20Z" />
              </clipPath>
            </defs>

            <path
              d="M200 20C200 20 40 220 40 320c0 90 72 160 160 160s160-70 160-160C360 220 200 20 200 20Z"
              fill="url(#dropFill)"
              stroke="rgba(255,255,255,.2)"
              strokeWidth="1.5"
            />

            <g clipPath="url(#dropClip)">
              <ellipse
                cx="130"
                cy="290"
                rx="34"
                ry="110"
                transform="rotate(14 130 290)"
                fill="url(#gloss)"
                opacity=".55"
              />
              <polyline
                className="trace"
                pathLength={1}
                points="0,335 110,335 140,335 158,272 184,398 208,300 226,335 400,335"
                fill="none"
                stroke="#fff"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  filter: "drop-shadow(0 0 6px rgba(255,255,255,.8))",
                }}
              />
            </g>
          </svg>

          {/* Floating cards */}
          <div className="animate-float absolute -left-2 bottom-12 rounded-xl border bg-card/80 px-4 py-3 shadow-lg backdrop-blur-md sm:-left-8">
            <p className="text-3xl font-bold leading-none text-primary">
              {BLOOD_GROUPS[index]}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Donors always needed
            </p>
          </div>

          <div
            className="animate-float absolute -right-2 top-16 flex items-center gap-2 rounded-xl border bg-card/80 px-3 py-2 shadow-lg backdrop-blur-md sm:-right-6"
            style={{ animationDelay: "1.2s" }}
          >
            <BadgeCheck className="h-5 w-5 text-chart-2" />
            <div>
              <p className="text-xs font-semibold text-foreground">
                Request verified
              </p>
              <p className="text-[10px] text-muted-foreground">
                Reviewed by admin
              </p>
            </div>
          </div>
        </Animate>
      </div>
    </section>
  );
}
