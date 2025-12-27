"use client";

import { User } from "@supabase/supabase-js";
import { Button } from "../ui/button";
import { Loader2, NotebookTabsIcon } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { createNoteForUser } from "@/app/actions/notes";
import useNote from "@/hooks/useNote";

type Props = {
    user: User | null;
};

function NewNoteButton({ user }: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { setNotesList } = useNote() || {};

    const handleAddNewNoteEvent = async () => {
        try {
            if (!user) {
                console.log("User not authenticated");
                router.push("/login");
            }
            else {
                setLoading(true);
                const uuid = uuidv4();

                // Call server action that derives the user from server-side auth.
                await createNoteForUser(uuid, null);
                setNotesList && setNotesList((prevNotes) =>
                    [{ id: uuid, text: "", authorId: user.id, createdAt: new Date(), updatedAt: new Date() }, ...prevNotes]
                );
                router.push(`/?noteId=${uuid}`);
                // let result = await getNotesForUser();
                // if (result instanceof Array) {
                //     setNotesList && setNotesList(result);
                // }
                // else {
                //     toast.error("Error fetching notes: " + result);
                // }

                toast.success("New note created");
                setLoading(false);
            }
        } catch (error) {
            console.error("Error creating new note:", error);
            toast.error("Failed to create new note");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Button variant="outline" className="w-25" disabled={loading} onClick={handleAddNewNoteEvent}>
            {loading ? <Loader2 className="animate-spin" /> : <> <NotebookTabsIcon size={16} /> New Note</>}
        </Button>
    )
}

export default NewNoteButton;