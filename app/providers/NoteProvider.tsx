"use client"
import { Note } from "@/lib/generated/prisma/client";
import { createContext, useState } from "react";

type NoteProviderContextType = {
    noteText: string;
    setNoteText: React.Dispatch<React.SetStateAction<string>>;
    notesList?: Note[];
    setNotesList?: React.Dispatch<React.SetStateAction<Note[]>>;
    userAuthenticated?: boolean | null;
    setUserAuthenticated?: React.Dispatch<React.SetStateAction<boolean | null>>;
};


export const NoteProviderContext = createContext<NoteProviderContextType | undefined>({
    noteText: "",
    setNoteText: () => {},
    notesList: [],
    setNotesList: () => {},
    userAuthenticated: null,
    setUserAuthenticated: () => {},
});

export function NoteProvider({ children }: { children: React.ReactNode }) {
    const [noteText, setNoteText] = useState("");
    const [notesList, setNotesList] = useState<Note[]>([]);
    const [userAuthenticated, setUserAuthenticated] = useState<boolean | null>(null);
    return <NoteProviderContext.Provider value={{ noteText, setNoteText, notesList, setNotesList, userAuthenticated, setUserAuthenticated }}>{children}</NoteProviderContext.Provider>;
}