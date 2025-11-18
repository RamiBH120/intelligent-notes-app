"use client";
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
    user: User | null;
};

function AskAIButton({ user }: Props) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [questionText, setQuestionText] = useState("");
    const [questions, setQuestions] = useState<string[]>([]);
    const [responses, setResponses] = useState<string[]>([]);

    const handleOnOpenChange = (isOpen: boolean) => {
        if (!user) {
            router.push('/login');
            return;
        }
        else {

            if (isOpen) {
                setQuestionText("");
                setQuestions([]);
                setResponses([]);

            }
            setOpen(isOpen);
        }

        return (
            <Dialog open={open} onOpenChange={handleOnOpenChange}>
                <form>
                    <DialogTrigger asChild>
                        <Button variant="outline">Ask AI</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Edit profile</DialogTitle>
                            <DialogDescription>
                                Make changes to your profile here. Click save when you&apos;re
                                done.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4">
                            <div className="grid gap-3">
                                <Label htmlFor="name-1">Name</Label>
                                <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="username-1">Username</Label>
                                <Input id="username-1" name="username" defaultValue="@peduarte" />
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Save changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </form>
            </Dialog>
        )
    }
}

    export default AskAIButton;