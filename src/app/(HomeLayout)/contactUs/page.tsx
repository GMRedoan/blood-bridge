import {
  AlertTriangle,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import Animate from "@/components/Reusable/Animate";
import ContactForm from "./_components/contactForm";

export const metadata = {
  title: "Contact Us",
  description:
    "Questions about donating blood, requesting help or supporting a campaign? Get in touch with our team.",
};

const INFO = [
  {
    icon: Mail,
    title: "Email us",
    value: "support@bloodbridge.com",
    hint: "We reply within 24 hours",
    href: "mailto:support@bloodbridge.com",
  },
  {
    icon: Phone,
    title: "Call us",
    value: "+880 1764108600",
    hint: "Sat to Thu, 9am to 6pm",
    href: "tel:+8801764108600",
  },
  {
    icon: MapPin,
    title: "Visit us",
    value: "Uttara House Building, City",
    hint: "By appointment only",
  },
  {
    icon: Clock,
    title: "Support hours",
    value: "9:00 AM to 6:00 PM",
    hint: "Closed on Fridays",
  },
];

const page = () => {
  return (
    <div className="py-15">
      {/* Hero */}
      <section className="relative isolate overflow-hidden border-b bg-linear-to-br from-primary/15 via-background to-background">
        <div className="pointer-events-none absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/4 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-[0.05] mask-[radial-gradient(70%_70%_at_50%_45%,black,transparent)]"
          style={{
            backgroundImage:
              "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />

        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:py-28">
          <Animate type="fadeUp" className="mx-auto max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <MessageCircle className="h-3.5 w-3.5" />
              Contact us
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              We&apos;d love to{" "}
              <span className="text-primary">hear from you</span>
            </h1>
            <p className="mt-5 text-base text-muted-foreground sm:text-lg">
              Questions about donating, requesting blood or running a campaign?
              Send us a message and our team will get back to you.
            </p>
          </Animate>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6">
        {/* Info cards (overlap the hero) */}
        <section className="-mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {INFO.map(({ icon: Icon, title, value, hint, href }) => {
            const body = (
              <>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-sm text-muted-foreground">{title}</h3>
                <p className="mt-1 wrap-break-words font-semibold text-foreground">
                  {value}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
              </>
            );

            const cardClass =
              "group block h-full rounded-2xl border bg-card p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg";

            return (
              <Animate key={title} type="fadeUp">
                {href ? (
                  <a href={href} className={cardClass}>
                    {body}
                  </a>
                ) : (
                  <div className={cardClass}>{body}</div>
                )}
              </Animate>
            );
          })}
        </section>

        {/* Form + side */}
        <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <Animate
            type="fadeUp"
            className="rounded-3xl border bg-card p-6 sm:p-8"
          >
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Send us a message
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Fill in the form and we will reply by email.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </Animate>

          <div className="space-y-6">
            {/* Emergency */}
            <Animate
              type="fadeUp"
              className="relative overflow-hidden rounded-3xl border border-destructive/30 bg-destructive/5 p-6"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                Need blood urgently?
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                This form is not monitored around the clock. For an emergency,
                call the hospital directly and post a blood request so verified
                donors can see it.
              </p>
            </Animate>

            {/* Map placeholder */}
            <Animate
              type="fadeUp"
              className="relative flex h-64 items-center justify-center overflow-hidden rounded-3xl border bg-linear-to-br from-primary/10 via-card to-card"
            >
              <div
                aria-hidden
                className="absolute inset-0 opacity-[0.07]"
                style={{
                  backgroundImage:
                    "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />
              <div className="relative text-center">
                <span className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <span className="absolute inset-0 animate-ping rounded-full bg-primary/40" />
                  <MapPin className="relative h-6 w-6" />
                </span>
                <p className="mt-3 font-semibold text-foreground">
                  Find us here
                </p>
                <p className="text-xs text-muted-foreground">
                  Replace this card with a Google Maps embed
                </p>
              </div>
            </Animate>
          </div>
        </section>
      </div>
    </div>
  );
};

export default page;
