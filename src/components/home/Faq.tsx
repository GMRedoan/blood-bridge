"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Droplets,
  HandCoins,
  HelpCircle,
  MessageCircle,
  Plus,
  ShieldCheck,
} from "lucide-react";
import Animate from "@/components/Reusable/Animate";
import { FAQS } from "@/lib/data";

type Category = "all" | "donors" | "requests" | "campaigns";

const CATEGORIES: { key: Category; label: string }[] = [
  { key: "all", label: "All" },
  { key: "donors", label: "Donors" },
  { key: "requests", label: "Requests" },
  { key: "campaigns", label: "Campaigns" },
];

const Faq = () => {
  const [category, setCategory] = useState<Category>("all");
  const [openId, setOpenId] = useState<string | null>(FAQS[0].id);

  const visible =
    category === "all" ? FAQS : FAQS.filter((f) => f.category === category);

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        {/* Left: intro + help card */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Animate type="fadeUp">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <HelpCircle className="h-3.5 w-3.5" />
              FAQ
            </span>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Questions? <span className="text-primary">We have answers.</span>
            </h2>

            <p className="mt-4 text-muted-foreground">
              Everything you need to know about donating blood, requesting help
              and supporting campaigns.
            </p>
          </Animate>

          <Animate type="fadeUp" className="mt-8">
            <div className="relative overflow-hidden rounded-2xl border bg-card p-6">
              <Droplets className="animate-float pointer-events-none absolute -right-3 -top-3 h-24 w-24 text-primary/10" />

              <div className="relative">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold text-foreground">
                  Still have questions?
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Our team is happy to help you with anything that is not
                  covered here.
                </p>
                <Link
                  href="/contact"
                  className="group mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary"
                >
                  Contact us
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </Animate>
        </div>

        {/* Right: filters + accordion */}
        <Animate type="fadeUp">
          {/* Category pills */}
          <div
            role="tablist"
            aria-label="FAQ categories"
            className="flex flex-wrap gap-2"
          >
            {CATEGORIES.map(({ key, label }) => {
              const active = category === key;
              return (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setCategory(key);
                    setOpenId(null);
                  }}
                  className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-all ${
                    active
                      ? "border-transparent bg-primary text-primary-foreground shadow-md shadow-primary/25"
                      : "bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Accordion (key restarts the entrance animation on filter change) */}
          <div key={category} className="mt-6 space-y-3">
            {visible.map((item, index) => {
              const isOpen = openId === item.id;

              return (
                <div
                  key={item.id}
                  className={`faq-item group relative overflow-hidden rounded-2xl border bg-card transition-all duration-300 ${
                    isOpen
                      ? "border-primary/40 shadow-lg shadow-primary/5"
                      : "hover:border-primary/30"
                  }`}
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  {/* accent bar */}
                  <span
                    aria-hidden
                    className={`absolute left-0 top-0 h-full w-1 origin-top bg-primary transition-transform duration-300 ${
                      isOpen ? "scale-y-100" : "scale-y-0"
                    }`}
                  />

                  <h3>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${item.id}`}
                      id={`faq-button-${item.id}`}
                      onClick={() => setOpenId(isOpen ? null : item.id)}
                      className="flex w-full items-center gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
                    >
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors duration-300 ${
                          isOpen
                            ? "bg-primary text-primary-foreground"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className="flex-1 font-semibold text-foreground">
                        {item.q}
                      </span>

                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                          isOpen
                            ? "rotate-45 border-primary bg-primary text-primary-foreground"
                            : "text-muted-foreground group-hover:border-primary/40 group-hover:text-primary"
                        }`}
                      >
                        <Plus className="h-4 w-4" />
                      </span>
                    </button>
                  </h3>

                  {/* smooth height animation */}
                  <div
                    id={`faq-panel-${item.id}`}
                    role="region"
                    aria-labelledby={`faq-button-${item.id}`}
                    className={`grid transition-all duration-300 ease-out ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <p className="px-5 pb-5 pl-17 text-sm leading-relaxed text-muted-foreground sm:px-6 sm:pb-6 sm:pl-18">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Trust strip */}
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Admin-verified content
            </span>
            <span className="flex items-center gap-2">
              <HandCoins className="h-4 w-4 text-primary" />
              Secure Stripe payments
            </span>
          </div>
        </Animate>
      </div>
    </section>
  );
};

export default Faq;
