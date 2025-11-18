import type { Metadata } from "next";
import "./styles/globals.css";
import { ThemeProvider } from "./providers/ThemeProvider";
import { Toaster } from "sonner";
import Header from "@/components/Header";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import { NoteProvider } from "./providers/NoteProvider";

export const metadata: Metadata = {
  title: "Intelligent Notes App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning
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
            <div className="fixed min-h-screen w-full bg-white dark:bg-black flex flex-col" >
              <Header />
              <main className="flex flex-1 flex-col px-4 pt-4 xl:px-8 w-full h-full overflow-auto">

                {children}
              </main>
            </div></SidebarProvider>

          <Toaster /></NoteProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
