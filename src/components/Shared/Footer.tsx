"use client";

import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Animate from "../Reusable/Animate";
import Logo from "../Reusable/Logo";

const exploreLinks = [
  {
    label: "Browse Properties",
    href: "/properties",
  },
  {
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    label: "Home",
    href: "/#home",
  },
  {
    label: "Become a Landlord",
    href: "/register",
  },
];

const companyLinks = [
  {
    label: "About Us",
    href: "/#about",
  },
  {
    label: "Contact",
    href: "/#contact",
  },
  {
    label: "FAQ",
    href: "/#faq",
  },
  {
    label: "Services",
    href: "#/services",
  },
];

const socials = [
  {
    icon: FaFacebook,
    href: "https://www.facebook.com/gm.redoan",
  },
  {
    icon: FaLinkedin,
    href: "https://www.linkedin.com/in/gm-redoan",
  },
  {
    icon: FaXTwitter,
    href: "https://x.com/gm_redoan",
  },
];

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <Animate className="container mx-auto px-6 py-10">
        <div className="grid gap-12 grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-5">
            <Link
              href="/"
              className="flex items-center gap-2 text-2xl font-bold"
            >
              <Logo />
               Blood Bridge
            </Link>

            <p className="max-w-sm leading-7 text-muted-foreground">
              Blood Bridge connects Patient and Donors through a secure, modern,
              and easy-to-use blood donation platform. Find your donor now.
            </p>

            <div className="flex gap-3">
              {socials.map(({ icon: Icon, href }, index) => (
                <Link
                  key={index}
                  href={href}
                  className="rounded-full border p-2.5 transition-all duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <Icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="mb-5 text-lg font-semibold">Explore</h3>

            <ul className="space-y-3">
              {exploreLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-5 text-lg font-semibold">Company</h3>

            <ul className="space-y-3">
              {companyLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 text-lg font-semibold">Contact</h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 text-primary" />
                <p className="text-muted-foreground">Dhaka, Bangladesh</p>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <p className="text-muted-foreground">dev.gmredoan@gmail.com</p>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <p className="text-muted-foreground">+880 1764-108600</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 border-t pt-6 text-sm text-muted-foreground text-center">
          <p>© {new Date().getFullYear()} Blood Bridge. All rights reserved.</p>
        </div>
      </Animate>
    </footer>
  );
}
