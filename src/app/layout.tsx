import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, Geist } from 'next/font/google';
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-heading' });
const inter = Inter({ subsets: ['latin'], variable: '--font-body' });

export const metadata: Metadata = {
  title: "Blood Bridge",
  description: "A bridge for blood donation",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", jakarta.variable, inter.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
