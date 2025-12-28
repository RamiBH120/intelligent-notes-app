import Link from "next/link";
import { Button } from "../ui/button";
import DarkModeToggle from "../buttons/DarkModeToggle";
import { LogoutButton } from "../buttons/LogoutButton";
import { getUser } from "@/app/auth/server";
import { SidebarTrigger } from "../ui/sidebar";
import { DoorOpenIcon, InfoIcon, LogInIcon, NotebookPenIcon, PhoneCallIcon, UserCircleIcon } from "lucide-react";


const Header = async () => {
  const user = await getUser();
  return (
    <header className="relative flex h-24 w-full px-3 sm:px-8 items-center justify-between bg-popover shadow-sm">
      <SidebarTrigger variant={"default"} size={"icon-lg"} className=" absolute left-1 top-0 bottom-0 my-auto active:bg-muted" />
      <Link href="/" className="flex items-center gap-2 px-2.5 md:px-3 mx-1 md:mx-2 my-auto w-2xl ml-3" >
        <NotebookPenIcon size={32} className="text-blue-500 hover:text-blue-200 ml-3 transition-all duration-150" />
        <h1 className="flex flex-col text-amber-50 md:text-2xl font-semibold">Intelligent <span className="text-blue-500">Notes App</span></h1>
      </Link>
      <div className="flex gap-4 items-center">
        <span className="hidden md:flex gap-4">
          <Link href="https://rami-benhamouda.tech/#about" target="_blank" className="hover:underline inline-flex items-center mx-1 gap-1"><InfoIcon size={16} /> <span>About</span></Link>
        <Link href="https://rami-benhamouda.tech/#contact" target="_blank" className="hover:underline inline-flex items-center mx-1 gap-1"> <PhoneCallIcon size={16} /> <span>Contact</span></Link>
        
        </span>
        {user ? (
          <>
            <LogoutButton />
            <UserCircleIcon size={32} className="text-lime-600" />
          </>
        ) : (
          <>
            <Button variant="default" asChild>
              <Link href="/login"><LogInIcon size={16} />Login</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/sign-up"><DoorOpenIcon size={16} /> Sign Up</Link>
            </Button>
          </>
        )}
        <DarkModeToggle />
      </div>
    </header>
  );
};

export default Header;
