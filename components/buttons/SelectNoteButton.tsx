"use client";
import useNote from "@/hooks/useNote";
import { Note } from "@/lib/generated/prisma/client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SidebarMenuButton } from "../ui/sidebar";
import Link from "next/link";

type SelectNoteButtonProps = {
    note: Note;
};

function SelectNoteButton({ note }: SelectNoteButtonProps) {

    const noteId = useSearchParams().get("noteId") || "";

    const { noteText: selectedNoteText } = useNote();

    const [shouldUseGlobalNoteText, setShouldUseGlobalNoteText] = useState(noteId === note.id);
    const [localNoteText, setLocalNoteText] = useState(note.text);

    useEffect(() => {
        setShouldUseGlobalNoteText(noteId === note.id);
    }, [noteId, note.id]);

    useEffect(() => {
        if (shouldUseGlobalNoteText) {
            setLocalNoteText(selectedNoteText);
        }
    }, [selectedNoteText, shouldUseGlobalNoteText]);
    const blankNoteText = "Empty Note";
    
    let noteTextToDisplay = localNoteText || blankNoteText;
    if(shouldUseGlobalNoteText){
        noteTextToDisplay = selectedNoteText || blankNoteText;
    }

    return (
        <SidebarMenuButton asChild className={`items-start gap-2 pr-12 ${noteId === note.id && "bg-sidebar-accent/50 text-primary"}`}>
            <Link href={`/?noteId=${note.id}`} className="flex flex-col w-full h-fit py-2">
                <p className="w-full overflow-hidden truncate text-ellipsis whitespace-nowrap">{noteTextToDisplay !== "" ? noteTextToDisplay : "Untitled Note"}</p>
                <p className="text-muted-foreground text-xs">{note.createdAt.toLocaleDateString()}</p>
            </Link>
        </SidebarMenuButton>
    );
}
export default SelectNoteButton;