import { getUser } from "@/app/auth/server";
import { prisma } from "@/lib/prisma";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import Link from "next/link";
import SidebarGroupContent from "./SidebarGroupContent";
import { Note } from "@/lib/generated/prisma/client";
import "@/app/styles/custom-scrollbar.css";

async function AppSidebar() {

    const user = await getUser();

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
      <SidebarContent className="custom-scrollbar">
        
        <SidebarGroup>
        <SidebarGroupLabel className="mb-2 mt-2 text-lg">
            {user ? (
                notes.length > 0 ? "Recent Notes" : "You have no notes yet"
            ):(
                <p className="text-sm text-justify mt-2">
                    <Link href="/login" className="underline">Please log in</Link> to see your notes
                </p>
            )}
        </SidebarGroupLabel>
        
        {user && <SidebarGroupContent notes={notes} />}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}

export default AppSidebar;