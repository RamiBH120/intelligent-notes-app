import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import DarkModeToggle from "./DarkModeToggle";
import { LogoutButton } from "./buttons/LogoutButton";
import { getUser } from "@/app/auth/server";
import { SidebarTrigger } from "./ui/sidebar";


 const Header = async() => {
  const user = await getUser();
  return (
    <header className="relative flex h-24 w-full px-3 sm:px-8 items-center justify-between bg-popover shadow-sm">
                <SidebarTrigger className="absolute left-1 top-1" />
        <Link href="/" className="flex items-end gap-2" >
        <Image src="/next.svg" alt="Logo" width={32} height={32} className="rounded-full" priority />
      <h1 className="flex flex-col pb-4 text-2xl font-semibold">Intelligent <span className="text-blue-500">Notes App</span></h1>
        </Link>
        <div className="flex gap-4 items-center">
            <Link href="/about" className="hover:underline">About</Link>
            <Link href="/contact" className="hover:underline">Contact</Link>
            {user ? (
                <>
                <LogoutButton />
                </>
            ) : (
              <>
                <Button variant="default" asChild>
                <Link href="/login">Login</Link>
                </Button>
                <Button variant="outline" asChild>
                <Link href="/sign-up">Sign Up</Link>
                </Button>
                </>
            )}
            <DarkModeToggle />
        </div>
    </header>
  );
};

export default Header;
