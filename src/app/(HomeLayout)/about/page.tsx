import Link from "next/link";
import {
  BadgeCheck,
  Building2,
  Droplets,
  HandCoins,
  HeartHandshake,
  Lock,
  MapPin,
  ScanSearch,
  Search,
  ShieldCheck,
  Siren,
  Sparkles,
  Target,
  UserRound,
  Users,
} from "lucide-react";
import Animate from "@/components/Reusable/Animate";
import { Button } from "@/components/ui/button";

const APP_NAME = "Blood Bridge";

const STATS = [
  { value: "5,000+", label: "Registered donors" },
  { value: "1,200+", label: "Requests fulfilled" },
  { value: "150+", label: "Partner hospitals" },
  { value: "64", label: "Districts covered" },
];

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const STEPS = [
  {
    icon: Siren,
    title: "Post a request",
    text: "Patients and hospitals share the blood group, units needed, urgency and location.",
  },
  {
    icon: BadgeCheck,
    title: "Admin verification",
    text: "Every request is reviewed by an administrator before it reaches donors.",
  },
  {
    icon: Search,
    title: "Match with donors",
    text: "Nearby donors with the right blood group can see the request and respond.",
  },
  {
    icon: HeartHandshake,
    title: "Save a life",
    text: "The donor reaches the hospital and the patient gets the blood in time.",
  },
];

const FEATURES = [
  {
    icon: Droplets,
    title: "Blood requests",
    text: "Create requests with urgency levels so critical cases are seen first.",
  },
  {
    icon: MapPin,
    title: "Location based",
    text: "Find donors and requests by city and area, so help is always close.",
  },
  {
    icon: HandCoins,
    title: "Fundraising campaigns",
    text: "Raise money for treatment costs and track progress in real time.",
  },
  {
    icon: Lock,
    title: "Secure payments",
    text: "Contributions are processed through Stripe. We never store card details.",
  },
  {
    icon: ShieldCheck,
    title: "Verified content",
    text: "Requests and campaigns go live only after an admin approves them.",
  },
  {
    icon: Users,
    title: "Role based access",
    text: "Donors, patients, hospitals and admins each get tools built for them.",
  },
];

const ROLES = [
  {
    icon: UserRound,
    title: "Donors",
    text: "Register your blood group, see verified requests near you, and donate when it matters.",
  },
  {
    icon: Users,
    title: "Patients",
    text: "Request blood for yourself or your family and start a campaign for treatment costs.",
  },
  {
    icon: Building2,
    title: "Hospitals",
    text: "Post urgent requests for your patients and run fundraising campaigns.",
  },
  {
    icon: ShieldCheck,
    title: "Admins",
    text: "Verify requests and campaigns, and keep the platform safe and trustworthy.",
  },
];

const About = () => {
  return (
    <div className="pb-20">
      {/* Hero */}
      <Animate className="relative isolate overflow-hidden   bg-linear-to-br from-primary/5 via-background to-background pt-10">
        <div className="pointer-events-none absolute -right-24 bottom-24 -z-10 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
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

        <div className="relative mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:py-28">
          <Animate type="fadeUp" className="mx-auto max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              About {APP_NAME}
            </span>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              Connecting <span className="text-primary">donors</span> with those
              who need them most
            </h1>

            <p className="mt-5 text-base text-muted-foreground sm:text-lg">
              {APP_NAME} is a community platform that brings together blood
              donors, patients and hospitals, and helps families fund the
              treatment they cannot afford alone.
            </p>

            <div className="mt-8">
              <Button size="lg">
                <Link href="/campaign" className="px-3 flex items-center gap-2">
                  <ScanSearch />
                  Explore campaigns
                </Link>
              </Button>
            </div>
          </Animate>

          {/* Blood group chips */}
          <div className="mx-auto mt-12 flex max-w-xl flex-wrap justify-center gap-2">
            {BLOOD_GROUPS.map((group) => (
              <span
                key={group}
                className="inline-flex h-10 min-w-12 items-center justify-center rounded-full border border-primary/30 bg-card/70 px-3 text-sm font-bold text-primary backdrop-blur"
              >
                {group}
              </span>
            ))}
          </div>
        </div>
      </Animate>

      <div className="mx-auto max-w-7xl space-y-24 px-4 sm:px-6">
        {/* Stats */}
        <Animate className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map(({ value, label }) => (
            <Animate
              key={label}
              type="fadeUp"
              className="rounded-2xl border bg-card p-6 text-center shadow-sm"
            >
              <p className="text-3xl font-bold text-primary sm:text-4xl">
                {value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{label}</p>
            </Animate>
          ))}
        </Animate>

        {/* Mission */}
        <Animate className="grid items-center gap-10 lg:grid-cols-2">
          <Animate type="fadeUp">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              Our mission
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              No one should lose a life for lack of blood
            </h2>
            <p className="mt-4 text-muted-foreground">
              Every day, families search desperately for a matching donor
              through phone calls and social media posts. {APP_NAME} replaces
              that scramble with one trusted place where verified requests meet
              willing donors.
            </p>
            <p className="mt-3 text-muted-foreground">
              Beyond blood, we help patients raise funds for surgery and
              treatment, with transparent progress and secure payments.
            </p>
          </Animate>

          <div className="grid gap-4 sm:grid-cols-2">
            <Animate type="fadeUp" className="rounded-2xl border bg-card p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Target className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold text-foreground">Our vision</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                A country where every patient can find blood within minutes.
              </p>
            </Animate>

            <Animate type="fadeUp" className="rounded-2xl border bg-card p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <HeartHandshake className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold text-foreground">Our values</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Trust, speed and compassion guide every feature we build.
              </p>
            </Animate>
          </div>
        </Animate>

        {/* How it works */}
        <section>
          <Animate type="fadeUp" className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              How it works
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              From request to rescue in four steps
            </h2>
          </Animate>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(({ icon: Icon, title, text }, index) => (
              <Animate
                key={title}
                type="fadeUp"
                className="relative rounded-2xl border bg-card p-6"
              >
                <span className="absolute right-5 top-4 text-5xl font-black text-primary/70">
                  {index + 1}
                </span>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-semibold text-foreground">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{text}</p>
              </Animate>
            ))}
          </div>
        </section>

        {/* Features */}
        <section>
          <Animate type="fadeUp" className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              Features
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Built for speed, trust and care
            </h2>
          </Animate>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <Animate
                key={title}
                type="fadeUp"
                className="group rounded-2xl border bg-background p-6 transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold text-foreground">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{text}</p>
              </Animate>
            ))}
          </div>
        </section>

        {/* Who it's for */}
        <section className="rounded-3xl border bg-linear-to-br from-primary/10 via-card to-card p-8 sm:p-12">
          <Animate type="fadeUp" className="max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              Who it&apos;s for
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              One platform, four roles
            </h2>
          </Animate>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {ROLES.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-2xl border bg-background/70 p-5 backdrop-blur"
              >
                <Icon className="h-6 w-6 text-primary" />
                <h3 className="mt-3 font-semibold text-foreground">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
