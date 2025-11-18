import { getUser } from "@/app/auth/server";
import { prisma } from "@/app/db/prisma";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"

import { Note } from "@prisma/client";
import Link from "next/link";
import SidebarGroupContent from "./SidebarGroupContent";

async function AppSidebar() {

    const user = await getUser();

    if (!user) {
        return null;
    }

    let notes:Note[] = [];

    if(user){
        notes = await prisma.note.findMany({
            where: {
                authorId: user.id,
            },
            orderBy: {
                updatedAt: 'desc',
            },
            take: 5,
        });
    }

  return (
    <Sidebar>
      <SidebarContent>
        
        <SidebarGroup />
        <SidebarGroupLabel className="my-2 text-lg">
            {user ? (
                notes.length > 0 ? "Recent Notes" : "You have no notes yet"
            ):(
                <p>
                    <Link href="/login" className="underline">Please log in</Link> to see your notes
                </p>
            )}
        </SidebarGroupLabel>
        
        {user && <SidebarGroupContent notes={notes} />}
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}

export default AppSidebar;