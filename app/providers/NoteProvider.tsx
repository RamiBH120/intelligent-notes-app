"use client"
import { Note } from "@/lib/generated/prisma/client";
import { createContext, useState, useEffect } from "react";
import supabase from "@/lib/supabaseClient";
import { getServerUser } from "@/app/actions/auth";

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
    const [userAuthenticated, setUserAuthenticated] = useState<boolean|null>(null);

    useEffect(() => {
        // Initialize auth status by calling the server-side getUser (so server cookies/session
        // are authoritative) and also subscribe to client-side Supabase auth changes for
        // immediate UI updates.
        let mounted = true;

        const init = async () => {
            try {
                // server-side check (uses getUser())
                const result = await getServerUser();
                if (!mounted) return;
                setUserAuthenticated(Boolean(result?.authenticated));
            } catch (err) {
                console.error("Failed to check server user:", err);
                if (mounted) setUserAuthenticated(false);
            }
        };

        init();

        if (!supabase) return () => { mounted = false };

        const { data: { subscription } } = supabase!.auth.onAuthStateChange((_event, session) => {
            setUserAuthenticated(Boolean(session));
        });

        return () => {
            mounted = false;
            try { subscription.unsubscribe(); } catch { /* ignore */ }
        };
    }, []);

    return <NoteProviderContext.Provider value={{ noteText, setNoteText, notesList, setNotesList, userAuthenticated, setUserAuthenticated }}>{children}</NoteProviderContext.Provider>;
}