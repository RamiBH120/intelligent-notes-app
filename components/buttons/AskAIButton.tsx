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
import { Fragment, useCallback, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "../ui/textarea";
import { ArrowUpIcon, CircleQuestionMarkIcon, FileQuestionMarkIcon, FileXIcon, Loader2, RocketIcon, SettingsIcon, StopCircleIcon } from "lucide-react";
import { askGeminiAboutNotesAction, generateNoteWithGeminiAction } from "@/app/actions/ai";
import "@/app/styles/ai-response.css";
import "@/app/styles/custom-scrollbar.css";
import { handleClickInput, handleKeyDown, scrollToBottom } from "@/lib/utils";
import { toast } from "sonner";
import useNote from "@/hooks/useNote";
import { createNoteForUser } from "@/app/actions/notes";
import { v4 as uuidv4 } from "uuid";

type Props = {
    user: User | null;
    isAskingAI?: boolean;
};

function AskAIButton({ user, isAskingAI }: Props) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [questionText, setQuestionText] = useState("");
    const [questions, setQuestions] = useState<string[]>([]);
    const [responses, setResponses] = useState<string[]>([]);
    /* for generating */
    const [question, setQuestion] = useState("");
    const [response, setResponse] = useState("");

    const [isPending, startTransition] = useTransition();
    const textareRef = useRef<HTMLTextAreaElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const [loading, setLoading] = useState(false);
    const { setNotesList } = useNote() || {};

    const handleOnOpenChange = useCallback((isOpen: boolean) => {
        if (!user) {
            router.push('/login');
        }
        else {

            if (isOpen) {
                setQuestionText("");
                setQuestions([]);
                setResponses([]);
                setQuestion("");
                setResponse("");

            }
            setOpen(isOpen);
        }
    }, [user, router]);


    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setQuestionText(e.target.value);
        const textarea = textareRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = textarea.scrollHeight + "px";
        }
    }
        , []);

    const handleSubmit = useCallback((e: React.FormEvent) => {
        if (!questionText.trim()) return;
        e.preventDefault();

        if (isAskingAI) {
            askAboutNotes();
        } else {
            generateNote();
        }
    }, [questionText, questions, responses]);

    const askAboutNotes = useCallback(async () => {

        const newQuestions = [...questions, questionText.trim()];
        setQuestions(newQuestions);
        setQuestionText("");
        setTimeout(() => scrollToBottom(contentRef), 100);
        startTransition(async () => {
            try {
                const response = await askGeminiAboutNotesAction(newQuestions, responses);
                setResponses((prev) => [...prev, response]);
                setTimeout(() => scrollToBottom(contentRef), 100);
            } catch (error: any) {
                setResponses((prev) => [...prev, `<p class="text-red-500">Error: ${error.message}</p>`]);
                setTimeout(() => scrollToBottom(contentRef), 100);
                toast.error(`Failed to get AI response: ${error.message}`);
            }
        })
    }, [questionText,questions, responses]);

    const generateNote = useCallback(async () => {

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
    }, [questionText]);

    const handleSaveNote = useCallback(async () => {
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
    }, [response, router, setNotesList, user]);

    return (
        <Dialog open={open} onOpenChange={handleOnOpenChange}>
            <form>
                <DialogTrigger asChild>
                    <Button variant={`${isAskingAI ? "secondary" : "default"}`}> {isAskingAI ? <CircleQuestionMarkIcon size={16} /> : <RocketIcon size={16} />} {isAskingAI ? "Ask AI" : "Generate Note"}</Button>
                </DialogTrigger>
                <DialogContent className="custom-scrollbar flex flex-col h-[85vh] max-w-4xl overflow-y-auto" ref={contentRef}>
                    <DialogHeader>
                        <DialogTitle>{isAskingAI ? "Ask about your notes with AI" : "Generate a Note with AI"}</DialogTitle>
                        <DialogDescription>
                            {isAskingAI ? "Ask any question and get an AI-generated response about your written notes." : "Ask AI to generate a note for you based on a topic or prompt."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-8 mt-4">
                        {isAskingAI ? (
                            <>
                                {questions.map((question, index) => (
                                    <Fragment key={index}>
                                        <p className="text-muted-foreground bg-muted ml-auto px-2 py-1 text-sm rounded-md max-w-2xl">{question}</p>
                                        {responses[index] && (
                                            <p className="bot-response max-w-2xl text-muted-foreground px-2 py-1 rounded-md"
                                                dangerouslySetInnerHTML={{ __html: responses[index] }} />
                                        )}
                                    </Fragment>
                                ))}</>

                        ) : (
                            <Fragment>
                                {question && <p className="text-muted-foreground bg-muted ml-auto px-2 py-1 text-sm rounded-md max-w-2xl">{question}</p>}
                                {response && (
                                    <p className="bot-response max-w-2xl text-muted-foreground px-2 py-1 rounded-md"
                                        dangerouslySetInnerHTML={{ __html: response }} />
                                )}
                            </Fragment>
                        )}
                        {isPending && (<p className="animate-pulse text-sm">{isAskingAI ? "Analyzing your notes..." : "Generating your note..."}</p>)}
                    </div>
                    <div
                        className="mt-auto flex cursor-text flex-col rounded-lg border p-4"
                        onClick={() => handleClickInput(textareRef)}
                    >
                        {isAskingAI || !response ? (
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
                                    placeholder="Ask me anything about your past notes..."
                                    className="placeholder:text-muted-foreground p-0 resize-none rounded-none border-none
                                focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
                                    rows={1}
                                />
                                <Button className="ml-auto rounded-full size-8" onClick={handleSubmit}>
                                    <ArrowUpIcon className="text-background" />
                                </Button>
                            </>
                        ) : (<>
                            <div className="flex flex-col items-center justify-center gap-2">
                                <p className="text-muted-foreground inline-flex items-center gap-1"><FileQuestionMarkIcon size={16} /> <span>Do you wish to save this generated note?</span></p>
                                <div className="mt-4 flex flex-row gap-2 justify-between">
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
                                        className="bg-red-500 text-white "
                                    >
                                        <StopCircleIcon size={16} />
                                        Discard
                                    </Button>
                                </div>

                            </div>
                        </>)}


                    </div>
                    {/* <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline"> <FileXIcon size={16} /> Cancel</Button>
                        </DialogClose>
                    </DialogFooter> */}
                </DialogContent>
            </form>
        </Dialog>
    )
}


export default AskAIButton;