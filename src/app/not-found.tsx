"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NotFound() {
    const router = useRouter();
  return (
    <main className="relative isolate flex min-h-[85vh] items-center overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(55% 60% at 20% 30%, rgba(150,14,34,.35), transparent 70%), radial-gradient(45% 50% at 95% 90%, rgba(90,8,22,.3), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.07] mix-blend-overlay"
      />

      <div className="mx-auto w-full max-w-7xl px-6 py-16">
        <p className="text-[clamp(6rem,22vw,12rem)] leading-[0.8] tracking-tight text-[#f5ecea]/90">
          404
        </p>

        <div className="mt-8 max-w-xl">
          <h1 className="text-3xl leading-tight sm:text-4xl">
            This page has no pulse.
          </h1>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            The link may be broken, or the page was moved. Donors and urgent
            requests are still a search away.
          </p>
        </div>

        {/* monitor line: three beats, then flat */}
        <div
          className="relative mt-12"
          role="img"
          aria-label="A heartbeat line that fades into a flat line"
        >
          <svg
            viewBox="0 0 1200 200"
            preserveAspectRatio="none"
            className="h-32 w-full sm:h-40"
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
          <span className="blip absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-[#ff4560] shadow-[0_0_14px_3px_rgba(255,69,96,.7)]" />
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button onClick={router.back} className="h-12 px-8 text-md">
            Go Back
          </Button>
          <Button asChild variant="outline" className="h-12 px-8 text-md">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}