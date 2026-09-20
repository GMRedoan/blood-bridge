import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Provider from "@/providers/Provider";
import { AuthProvider } from "@/providers/AuthProvider";
import { getUser } from "@/server/user/user.service";
import AuthDialog from "@/components/Shared/auth/AuthDialog";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: {
    default: "Blood Bridge",
    template: "%s | Blood Bridge",
  },
  description: "An app for blood donation",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const user = await getUser();
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        jakarta.variable,
        inter.variable,
        "font-sans",
        geist.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <Provider>
          <AuthProvider initialUser={user.success ? user.data : null}>
            {children}
            <AuthDialog/>
          </AuthProvider>
        </Provider>
      </body>
    </html>
  );
}
