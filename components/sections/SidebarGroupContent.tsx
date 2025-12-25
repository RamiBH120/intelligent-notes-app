"use client";

import { Note } from "@/lib/generated/prisma/client";
import { SidebarGroupContent as SidebarGroupContentShad, SidebarMenu } from "../ui/sidebar";
import { Loader2, SearchIcon } from "lucide-react";
import { Input } from "../ui/input";
import { useEffect, useMemo, useState } from "react";
import Fuse from "fuse.js";
import SelectNoteButton from "../buttons/SelectNoteButton";
import DeleteNoteButton from "../buttons/DeleteNoteButton";

type Props = {
    notes: Note[];
};

function SidebarGroupContent({notes}: Props) {
    const [searchText, setSearchText] = useState("");
    const [localNotes, setLocalNotes] = useState<Note[]>(notes);

    useEffect(() => {
        setLocalNotes(notes);
    }, [notes]);

    const fuse = useMemo(() => {
        // Initialize Fuse.js or any other search library here if needed
        return new Fuse(localNotes || [], {
            keys: ['text'],
            threshold: 0.3,
        });
    }, [localNotes]);

    const filteredNotes = searchText
        ? fuse.search(searchText).map(result => result.item)
        : localNotes;


    const handleSearchText = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    }

    const deleteNoteLocally = (noteId: string) => {
        setLocalNotes((prevNotes) => prevNotes ? prevNotes.filter(note => note.id !== noteId) : []);
    }
    return (
    <SidebarGroupContentShad>
        <div className="relative flex items-center">
            <SearchIcon className="absolute left-2 size-4" />
            <Input className="bg-muted pl-8" placeholder="Search notes..." value={searchText} onChange={handleSearchText} />
        </div>
        <SidebarMenu className="mt-4">
            {notes.length === 0 ? (<Loader2 className="animate-spin" />) : (filteredNotes?.map((note: Note) => (
                <SidebarMenu key={note.id} className="group/item">
                    {/* <Link href={`/?noteId=${note.id}`} className="w-full">
                    {note?.text?.slice(0, 30) || "Untitled Note"}
                    </Link> */}
                    <SelectNoteButton note={note} />
                    <DeleteNoteButton noteId={note?.id} deleteNoteLocally={deleteNoteLocally} />
                </SidebarMenu>
            )))}
        </SidebarMenu>
    </SidebarGroupContentShad>);
}

export default SidebarGroupContent;