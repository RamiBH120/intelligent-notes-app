import type { Metadata } from "next";
import "./styles/globals.css";
import { ThemeProvider } from "./providers/ThemeProvider";
import { Toaster } from "sonner";
import Header from "@/components/sections/Header";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/sections/AppSidebar";
import { NoteProvider } from "./providers/NoteProvider";
import Footer from "@/components/sections/Footer";
import { appName } from "@/lib/constants";

export const metadata: Metadata = {
  title: `${appName}`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NoteProvider>
            <SidebarProvider>
              <AppSidebar />
              <div className="flex min-h-screen w-full flex-col">
                <Header />

                <main className="flex flex-1 flex-col px-4 pt-10 xl:px-8">
                  {children}
                </main>
                <Footer />
              </div>
            </SidebarProvider>

            <Toaster /></NoteProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
