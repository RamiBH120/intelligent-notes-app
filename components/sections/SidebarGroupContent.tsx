"use client";

import { Note } from "@/lib/generated/prisma/client";
import { SidebarGroupContent as SidebarGroupContentShad, SidebarMenu, SidebarMenuItem } from "../ui/sidebar";
import { Loader2, SearchIcon } from "lucide-react";
import { Input } from "../ui/input";
import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import SelectNoteButton from "../buttons/SelectNoteButton";
import DeleteNoteButton from "../buttons/DeleteNoteButton";
import useNote from "@/hooks/useNote";


function SidebarGroupContent() {
    const [searchText, setSearchText] = useState("");
    //const [localNotes, setLocalNotes] = useState<Note[]>(notes);

    const {notesList} = useNote() || {};

    const fuse = useMemo(() => {
        // Initialize Fuse.js or any other search library here if needed
        return new Fuse(notesList || [], {
            keys: ['text'],
            threshold: 0.3,
        });
    }, [notesList]);
    const filteredNotes = searchText
        ? fuse.search(searchText).map(result => result.item)
        : notesList;


    const handleSearchText = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    }

    return (
    <SidebarGroupContentShad>
        <div className="relative flex items-center">
            <SearchIcon className="absolute left-2 size-4" />
            <Input className="bg-muted pl-8" placeholder="Search notes..." value={searchText} onChange={handleSearchText} />
        </div>
        <SidebarMenu className="mt-4">
            {notesList && notesList.length > 0 && (filteredNotes?.map((note: Note,index) => (

                <SidebarMenuItem key={note.id} className="group/item">
                    {/* <Link href={`/?noteId=${note.id}`} className="w-full">
                    {note?.text?.slice(0, 30) || "Untitled Note"}
                    </Link> */}
                    <SelectNoteButton note={note} index={index + 1} />
                    <DeleteNoteButton noteId={note?.id}/>
                </SidebarMenuItem>
            )))}
        </SidebarMenu>
    </SidebarGroupContentShad>);
}

export default SidebarGroupContent;