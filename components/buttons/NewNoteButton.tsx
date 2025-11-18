"use client";

import { User } from "@supabase/supabase-js";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { createNewNoteForUser } from "@/app/actions/notes";

type Props = {
    user: User | null;
};

function NewNoteButton({ user }: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleAddNewNoteEvent = async () => {
        try {
        if (!user) {
            console.log("User not authenticated");
            router.push("/login");
            return;
        }
        else {
            setLoading(true);
            const uuid = uuidv4();
            console.log("user id",user.id);
            
            await createNewNoteForUser(uuid,user.id);
            router.push(`/?noteId=${uuid}`);

            toast.success("New note created");
        }
        } catch (error) {
            console.error("Error creating new note:", error);
            toast.error("Failed to create new note");
            setLoading(false);
        }finally {
            setLoading(false);
        }
    }

    return (
        <Button variant="secondary" disabled={loading} onClick={handleAddNewNoteEvent}>
            {loading ? <Loader2 className="animate-spin" /> : "New Note"}
        </Button>
    )
}

export default NewNoteButton;