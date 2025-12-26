import { getUser } from "@/app/auth/server";
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
import { getNotesForUser } from "@/app/actions/notes";
import { toast } from "sonner";

async function AppSidebar() {

  const user = await getUser();

  let notes: Note[] = [];

  if (user) {
    let result = await getNotesForUser();
    if (result instanceof Array)
      notes = result;
    else
      toast.error("Error fetching notes: " + result);
  }

  return (
    <Sidebar>
      <SidebarContent className="custom-scrollbar">

        <SidebarGroup>
          <SidebarGroupLabel className="mb-2 mt-2 text-lg">
            {user ? (
              notes.length > 0 ? `${notes.length} Recent Notes` : "You have no notes yet"
            ) : (
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