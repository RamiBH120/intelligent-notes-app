"use client";

import { useSearchParams } from "next/navigation";
import { Textarea } from "../ui/textarea";
import { useEffect } from "react";
import { debounceDelay } from "@/lib/constants";
import useNote from "@/hooks/useNote";
import { updateNoteAction } from "@/app/actions/notes";
import "@/app/styles/custom-scrollbar.css";
import { filterHtmlTags } from "@/lib/utils";

type Props = {
    noteId: string | string[] | undefined | null;
    startingNoteText?: string | null;
};

let updateTimeout: NodeJS.Timeout;

function NoteTextInput({ noteId, startingNoteText }: Props) {
    const noteIdParam = useSearchParams().get("noteId") || "";

    const { noteText, setNoteText } = useNote();

    useEffect(() => {

        if (noteIdParam === noteId) {
            setNoteText(filterHtmlTags(startingNoteText || ""));
        }
    }, [startingNoteText, noteId, noteIdParam, setNoteText]);

    const handleChangeNoteText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = e.target.value;

        setNoteText(newText);

        clearTimeout(updateTimeout);

        updateTimeout = setTimeout(async () => {
            updateNoteAction(noteId as string, newText);
        }, debounceDelay); // Delay of 500ms after the user stops typing

    }
    return <Textarea
        value={noteText}
        onChange={handleChangeNoteText}
        placeholder="Type your note text here..."
        className="custom-scrollbar placeholder:text-muted-foreground mb-4 h-full max-w-4xl resize-none border p-4 focus-visible:ring-0 focus-visible:ring-offset-0" />;

}

export default NoteTextInput;