"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const DISTRICTS = [
  "Barishal",
  "Bhola",
  "Patuakhali",
  "Dhaka",
  "Chattogram",
  "Khulna",
  "Rajshahi",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
];

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='.5'/></svg>\")";

export function Banner() {
  const router = useRouter();
  const [group, setGroup] = useState<string>("O+");
  const [district, setDistrict] = useState<string>("");

  function search() {
    const params = new URLSearchParams({ group });
    if (district) params.set("district", district);
    router.push(`/donors?${params.toString()}`);
  }

  return (
    <section className="relative isolate overflow-hidden bg-[#0c0709] text-[#f5ecea]">
      {/* keyframes: one heartbeat line + slow breathing glow */}
      <style>{`
        @keyframes ecg { to { stroke-dashoffset: 0; } }
        @keyframes breathe { 0%,100% { opacity:.55; transform:scale(1);} 50% { opacity:.9; transform:scale(1.06);} }
        .ecg-line { stroke-dasharray: 700; stroke-dashoffset: 700; animation: ecg 2.6s cubic-bezier(.6,0,.2,1) .4s forwards; }
        .drop-glow { animation: breathe 4.8s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .ecg-line { animation: none; stroke-dashoffset: 0; }
          .drop-glow { animation: none; }
        }
      `}</style>

      {/* background layers */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 70% at 78% 45%, rgba(170,18,38,.38) 0%, rgba(80,8,20,.18) 45%, transparent 75%), radial-gradient(40% 50% at 8% 100%, rgba(120,12,30,.25), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.07] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.06] [mask-image:radial-gradient(70%_70%_at_75%_45%,black,transparent)]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:py-28 lg:grid-cols-[1.1fr_0.9fr] lg:py-32">
        {/* left: message + search */}
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-5xl leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            Someone near you
            <br />
            needs your blood
            <br />
            group today.
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-[#f5ecea]/60">
            Search verified donors by blood group and district, or register to
            be found when it matters.
          </p>

          {/* search panel */}
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-[0_30px_80px_-30px_rgba(190,20,45,.55)] backdrop-blur-xl sm:p-5">
            <div
              role="radiogroup"
              aria-label="Blood group"
              className="grid grid-cols-4 gap-2 sm:grid-cols-8"
            >
              {GROUPS.map((g) => {
                const active = g === group;
                return (
                  <button
                    key={g}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setGroup(g)}
                    className={[
                      "h-11 rounded-xl border text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff5a6e]",
                      active
                        ? "border-transparent bg-[#d3162f] text-white shadow-[0_0_24px_-4px_rgba(230,30,60,.8)]"
                        : "border-white/10 bg-white/[0.03] text-[#f5ecea]/75 hover:border-white/25 hover:bg-white/[0.07]",
                    ].join(" ")}
                  >
                    {g}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <Select value={district} onValueChange={setDistrict}>
                <SelectTrigger
                  aria-label="District"
                  className="h-12 flex-1 rounded-xl border-white/10 bg-white/[0.03] px-4 text-[#f5ecea] data-[placeholder]:text-[#f5ecea]/50"
                >
                  <SelectValue placeholder="Any district" />
                </SelectTrigger>
                <SelectContent>
                  {DISTRICTS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={search}
                className="h-12 rounded-xl bg-[#d3162f] px-8 text-base text-white hover:bg-[#e01c37]"
              >
                Find {group} donors
              </Button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            <Button
              asChild
              variant="outline"
              className="h-11 rounded-xl border-white/20 bg-transparent px-6 text-[#f5ecea] hover:bg-white/10 hover:text-white"
            >
              <a href="/register">Register as a donor</a>
            </Button>
            <span className="text-[#f5ecea]/50">
              Free to search. No account needed.
            </span>
          </div>
        </div>

        {/* right: the drop */}
        <div className="relative mx-auto aspect-[4/5] w-full max-w-[420px]">
          <div
            aria-hidden
            className="drop-glow absolute inset-[-12%] rounded-full bg-[radial-gradient(circle,rgba(220,25,50,.5),transparent_65%)] blur-2xl"
          />
          <svg
            viewBox="0 0 400 500"
            role="img"
            aria-label="A blood drop with a heartbeat line"
            className="relative h-full w-full"
          >
            <defs>
              <linearGradient id="dropFill" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#ff4560" stopOpacity=".95" />
                <stop offset=".55" stopColor="#9d0f27" stopOpacity=".92" />
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
              stroke="rgba(255,255,255,.18)"
              strokeWidth="1.5"
            />

            <g clipPath="url(#dropClip)">
              {/* gloss */}
              <ellipse
                cx="130"
                cy="290"
                rx="34"
                ry="110"
                transform="rotate(14 130 290)"
                fill="url(#gloss)"
                opacity=".55"
              />
              {/* heartbeat */}
              <polyline
                className="ecg-line"
                points="0,335 110,335 140,335 158,272 184,398 208,300 226,335 400,335"
                fill="none"
                stroke="#fff"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,.8))" }}
              />
            </g>
          </svg>

          {/* floating blood group tag */}
          <div className="absolute -left-2 bottom-10 rounded-xl border border-white/10 bg-black/40 px-4 py-3 backdrop-blur-md sm:-left-8">
            <p className="font-[family-name:var(--font-display)] text-3xl leading-none">
              {group}
            </p>
            <p className="mt-1 text-xs text-[#f5ecea]/60">
              {district || "Anywhere in Bangladesh"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
