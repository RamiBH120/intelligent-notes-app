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
import { ArrowUpIcon, NotebookTabsIcon } from "lucide-react";
import { askGeminiAboutNotesAction } from "@/app/actions/ai";
import "@/app/styles/ai-response.css";
import "@/app/styles/custom-scrollbar.css";
import { handleKeyDown, scrollToBottom } from "@/lib/utils";
import { toast } from "sonner";

type Props = {
    user: User | null;
};

function AskAIButton({ user }: Props) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [questionText, setQuestionText] = useState("");
    const [questions, setQuestions] = useState<string[]>([]);
    const [responses, setResponses] = useState<string[]>([]);

    const [isPending, startTransition] = useTransition();

    const handleOnOpenChange = (isOpen: boolean) => {
        if (!user) {
            router.push('/login');
        }
        else {

            if (isOpen) {
                setQuestionText("");
                setQuestions([]);
                setResponses([]);

            }
            setOpen(isOpen);
        }
    }

    const textareRef = useRef<HTMLTextAreaElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

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
    }

    

    return (
        <Dialog open={open} onOpenChange={handleOnOpenChange}>
            <form>
                <DialogTrigger asChild>
                    <Button variant="secondary"> <NotebookTabsIcon size={16} /> Ask AI</Button>
                </DialogTrigger>
                <DialogContent className="custom-scrollbar flex flex-col h-[85vh] max-w-4xl overflow-y-auto" ref={contentRef}>
                    <DialogHeader>
                        <DialogTitle>Ask about your notes with AI</DialogTitle>
                        <DialogDescription>
                            Ask any question and get an AI-generated response about your written notes.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-8 mt-4">
                        {questions.map((question, index) => (
                            <Fragment key={index}>
                                <p className="text-muted-foreground bg-muted ml-auto px-2 py-1 text-sm rounded-md max-w-2xl">{question}</p>
                                {responses[index] && (
                                    <p className="bot-response max-w-2xl text-muted-foreground px-2 py-1 rounded-md"
                                        dangerouslySetInnerHTML={{ __html: responses[index] }} />
                                )}
                            </Fragment>
                        ))}
                        {isPending && (<p className="animate-pulse text-sm">Thinking...</p>)}
                    </div>
                    <div
                        className="mt-auto flex cursor-text flex-col rounded-lg border p-4"
                        onClick={handleClickInput}
                    >
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
                                focus-visible:ring-0 focus-visible:ring-offset-0 bg-accent-foreground shadow-none"
                            rows={1}
                        />
                        <Button className="ml-auto rounded-full size-8">
                            <ArrowUpIcon className="text-background" />
                        </Button>
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