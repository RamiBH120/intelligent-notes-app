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
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

function AppSidebar() {

  const { notesList, setNotesList, userAuthenticated } = useNote();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      // Only attempt to fetch notes when we know the user is authenticated.
      // If the user is explicitly unauthenticated, clear notes silently.
      console.log("notes list",notesList);
      
      
      if (userAuthenticated !== true) {
        if (userAuthenticated === false) {
          setNotesList && setNotesList([]);
        }
        return;
      }

      try {
        setLoading(true);
        const result = await getNotesForUser();
        setLoading(false);

        if (result instanceof Array) {
          setNotesList && setNotesList(result);
        } else {
          // When authenticated but the server returned an error structure,
          // surface a single, informative toast.
          setNotesList && setNotesList([]);
          const errMsg = (result && (result as any).errorMessage) || String(result);
          toast.error("Error fetching notes: " + errMsg);
        }
      } catch (err) {
        // Unexpected client-side errors (should be rare) — show a toast.
        console.error("Unexpected error fetching notes:", err);
        setNotesList && setNotesList([]);
        toast.error("Error fetching notes");
      }
    };

    fetchNotes();
    // we intentionally run this once when authentication status changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAuthenticated]);

  return (
    <Sidebar>
      <SidebarContent className="custom-scrollbar">

        <SidebarGroup>
          <SidebarGroupLabel className="mb-2 mt-2 text-lg">
            {userAuthenticated === true && !loading ? (
              notesList && notesList.length > 0 ? `(${notesList.length}) Recent Notes` : "You have no notes yet"
            ) : userAuthenticated === false ? (
              <p className="text-sm text-justify mt-2">
                <Link href="/login" className="underline">Please log in</Link> to see your notes
              </p>
            ) : (
              <div className="flex items-center gap-2 text-center mx-auto"><Loader2 className="animate-spin" /> <span>Loading...</span></div>
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