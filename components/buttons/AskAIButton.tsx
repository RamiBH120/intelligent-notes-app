"use client";
import { User } from "@supabase/supabase-js";
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
import { Fragment, useRef, useState, useTransition } from "react";
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation";
import { Textarea } from "../ui/textarea";
import { ArrowUpIcon } from "lucide-react";
import { askAIAboutNotesAction } from "@/app/actions/notes";
import "@/app/styles/ai-response.css";
import "@/app/styles/custom-scrollbar.css";

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
        setTimeout(scrollToBottom, 100);

        startTransition(async () => {
            const response = await askAIAboutNotesAction(newQuestions, responses);
            setResponses((prev) => [...prev, response]);
            setTimeout(scrollToBottom, 100);
        })
    }

    const scrollToBottom = () => {
        contentRef.current?.scrollTo({
            top: contentRef.current.scrollHeight,
            behavior: "smooth"
        });
    }

    const handleKeyDown = async (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOnOpenChange}>
            <form>
                <DialogTrigger asChild>
                    <Button variant="default">Ask AI</Button>
                </DialogTrigger>
                <DialogContent className="custom-scrollbar sm:max-w-106.25 flex flex-col h-[80vh] max-w-3xl overflow-y-auto" ref={contentRef}>
                    <DialogHeader>
                        <DialogTitle>Ask AI</DialogTitle>
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
                        <Label htmlFor="question" className="mb-2">Your Question</Label>
                        <Textarea
                            ref={textareRef}
                            value={questionText}
                            onChange={(e) => setQuestionText(e.target.value)}
                            onInput={handleInputChange}
                            onKeyDown={handleKeyDown}
                            style={{
                                minHeight: "0",
                                lineHeight: "normal"
                            }}
                            placeholder="Type your question here..."
                            className="w-full overflow-hidden placeholder:text-muted-foreground p-0 resize-none rounded-none border-none
                                focus:ring-0 focus:ring-offset-0 bg-transparent shadow-none"
                            rows={1}
                        />
                        <Button className="mt-2 self-end ml-auto rounded-full size-8">
                            <ArrowUpIcon className="text-background" />
                        </Button>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}


export default AskAIButton;