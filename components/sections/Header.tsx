import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import DarkModeToggle from "../buttons/DarkModeToggle";
import { LogoutButton } from "../buttons/LogoutButton";
import { getUser } from "@/app/auth/server";
import { SidebarTrigger } from "../ui/sidebar";
import { NotebookPenIcon, UserCircleIcon } from "lucide-react";


const Header = async () => {
  const user = await getUser();
  return (
    <header className="relative flex h-24 w-full px-3 sm:px-8 items-center justify-between bg-popover shadow-sm">
      <SidebarTrigger className=" absolute left-1 top-0 bottom-0 my-auto active:bg-muted" />
      <Link href="/" className="flex items-center gap-2 my-auto w-2xl ml-3" >
        <NotebookPenIcon size={32} className="text-blue-500 hover:text-blue-200 mx-5 transition-all duration-150" />
        <h1 className="flex flex-col text-2xl font-semibold">Intelligent <span className="text-blue-500">Notes App</span></h1>
      </Link>
      <div className="flex gap-4 items-center">
        <Link href="https://rami-benhamouda.tech/#about" className="hover:underline">About</Link>
        <Link href="https://rami-benhamouda.tech/#contact" className="hover:underline">Contact</Link>
        {user ? (
          <>
            <LogoutButton />
            <UserCircleIcon size={32} className="text-muted-foreground" />
          </>
        ) : (
          <>
            <Button variant="default" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/sign-up" className="hidden sm:block">Sign Up</Link>
            </Button>
          </>
        )}
        <DarkModeToggle />
      </div>
    </header>
  );
};

export default Header;
