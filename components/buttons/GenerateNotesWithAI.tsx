"use client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Fragment, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "../ui/textarea";
import { ArrowUpIcon, FileQuestionMarkIcon, FileXIcon, Loader2, RocketIcon } from "lucide-react";
import { generateNoteWithGeminiAction } from "@/app/actions/ai";
import "@/app/styles/ai-response.css";
import "@/app/styles/custom-scrollbar.css";
import { handleKeyDown, scrollToBottom } from "@/lib/utils";
import { toast } from "sonner";
import { createNoteForUser } from "@/app/actions/notes";
import { v4 as uuidv4 } from "uuid";
import useNote from "@/hooks/useNote";

type Props = {
    user: User | null;
};


function generateNoteWithAIComponent({ user }: Props) {
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [questionText, setQuestionText] = useState("");
    const [question, setQuestion] = useState("");
    const [response, setResponse] = useState("");
    const textareRef = useRef<HTMLTextAreaElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(false);

    const {setNotesList } = useNote() || {};

    const handleOnOpenChange = (isOpen: boolean) => {
        if (!user) {
            router.push('/login');
        }
        else {

            if (isOpen) {
                setQuestionText("");
                setQuestion("");
                setResponse("");

            }
            setOpen(isOpen);
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const textarea = textareRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = textarea.scrollHeight + "px";
        }
    }

    const handleClickInput = () => {
        textareRef.current?.focus();
    }


    const handleSubmit = (e: React.FormEvent) => {
        if (!questionText.trim()) return;
        e.preventDefault();
        setQuestion(questionText.trim());
        setQuestionText("");
        setTimeout(() => scrollToBottom(contentRef), 100);

        startTransition(async () => {
            try {
                const response = await generateNoteWithGeminiAction(questionText.trim());
                setResponse(response);
                setTimeout(() => scrollToBottom(contentRef), 100);
            } catch (error: any) {
                setResponse(`<p class="text-red-500">Error: ${error.message}</p>`);
                setTimeout(() => scrollToBottom(contentRef), 100);
                toast.error(`Failed to generate notes: ${error.message}`);
            }
        })
    }

    const handleSaveNote = async () => {
        try {
            setLoading(true);
            const uuid = uuidv4();

            // Call server action that derives the user from server-side auth.
            await createNoteForUser(uuid, response);
            setNotesList && user && setNotesList((prevNotes) =>
                    [{ id: uuid, text: response, authorId: user.id, createdAt: new Date(), updatedAt: new Date() }, ...prevNotes]
                );
            router.push(`/?noteId=${uuid}`);

            // let result = await getNotesForUser();

            // if (result instanceof Array) {
            //     setNotesList && setNotesList(result);
            // } else {
            //     toast.error("Error fetching notes: " + result);
            // }

            setLoading(false);
            toast.success("Note saved successfully!");
            setOpen(false);
        } catch (error) {
            console.error("Error saving generated note:", error);
            toast.error("Failed to save generated note");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOnOpenChange}>
            <form>
                <DialogTrigger asChild>
                    <Button variant="default"><RocketIcon size={16} /> Generate notes</Button>
                </DialogTrigger>
                <DialogContent className="custom-scrollbar flex flex-col h-[85vh] max-w-4xl overflow-y-auto" ref={contentRef}>
                    <DialogHeader>
                        <DialogTitle>Generate Notes with AI</DialogTitle>
                        <DialogDescription>
                            Ask AI to generate notes for you based on a topic or prompt.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-8 mt-4">
                        <Fragment>
                            {question && <p className="text-muted-foreground bg-muted ml-auto px-2 py-1 text-sm rounded-md max-w-2xl">{question}</p>}
                            {response && (
                                <p className="bot-response max-w-2xl text-muted-foreground px-2 py-1 rounded-md"
                                    dangerouslySetInnerHTML={{ __html: response }} />
                            )}
                        </Fragment>
                        {isPending && (<p className="animate-pulse text-sm">Thinking...</p>)}
                    </div>
                    <div
                        className="mt-auto flex cursor-text flex-col rounded-lg border p-4"
                        onClick={handleClickInput}
                    >
                        {!response ? (
                            <>
                                <Textarea
                                    ref={textareRef}
                                    value={questionText}
                                    onChange={(e) => setQuestionText(e.target.value)}
                                    onInput={handleInputChange}
                                    onKeyDown={(e) => handleKeyDown(e, handleSubmit)}
                                    style={{
                                        minHeight: "0",
                                        lineHeight: "normal"
                                    }}
                                    placeholder="Ask me about your goals and wishes..."
                                    className="placeholder:text-muted-foreground p-0 resize-none rounded-none border-none
                                focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent shadow-none"
                                    rows={1}
                                />
                                <Button className="ml-auto rounded-full size-8">
                                    <ArrowUpIcon className="text-background" />
                                </Button>
                            </>
                        ) : (<>
                        <div className="flex items-center justify-center gap-2">
                            <p className="text-muted-foreground"><FileQuestionMarkIcon size={16} /> Do you wish to save this generated note?</p>
                            <div className="mt-4 flex gap-2 justify-around">
                                <Button
                                    variant="default"
                                    onClick={handleSaveNote}
                                    className="w-25"

                                >
                                    {loading ? <Loader2 className="animate-spin" /> : <> <RocketIcon size={16} /> Save Note</>}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        // Just close the dialog without saving
                                        setOpen(false);
                                    }}
                                >
                                    <FileXIcon size={16} />
                                    Discard
                                </Button>
                            </div>

                        </div>
                        </>)}
                    </div>
                </DialogContent>
            </form>
        </Dialog>
    )
}

export default generateNoteWithAIComponent;