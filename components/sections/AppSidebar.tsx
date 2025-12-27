"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import Link from "next/link";
import SidebarGroupContent from "./SidebarGroupContent";
import "@/app/styles/custom-scrollbar.css";
import { getNotesForUser } from "@/app/actions/notes";
import { toast } from "sonner";
import useNote from "@/hooks/useNote";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

function AppSidebar() {

  const { notesList, setNotesList, userAuthenticated, setUserAuthenticated } = useNote();

  useEffect(() => {
    const fetchNotes = async () => {
      let result = await getNotesForUser();
      if (result instanceof Array) {
        setNotesList && setNotesList(result);
        setUserAuthenticated?.(true);
      } else {
        // If fetching notes failed, assume unauthenticated or error.
        setNotesList && setNotesList([]);
        setUserAuthenticated?.(false);
        toast.error("Error fetching notes: " + result);
      }
    };
    fetchNotes();
    // we intentionally run this once on mount; setNotesList is stable from context
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAuthenticated]);

  return (
    <Sidebar>
      <SidebarContent className="custom-scrollbar">

        <SidebarGroup>
          <SidebarGroupLabel className="mb-2 mt-2 text-lg">
            {userAuthenticated === true ? (
              notesList && notesList.length > 0 ? `(${notesList.length}) Recent Notes` : "You have no notes yet"
            ) : userAuthenticated === false ? (
              <p className="text-sm text-justify mt-2">
                <Link href="/login" className="underline">Please log in</Link> to see your notes
              </p>
            ) : (
              <div className="flex items-center gap-2"><Loader2 className="animate-spin" /> <span>Loading...</span></div>
            )}
          </SidebarGroupLabel>

          {userAuthenticated === true && <SidebarGroupContent />}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}

export default AppSidebar;