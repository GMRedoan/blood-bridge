"use client";

import { ThemeProvider } from "@/components/Shared/theme/ThemeProvider";


const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={true}>
      {children}
    </ThemeProvider>
  );
};

export default Provider;
