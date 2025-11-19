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
import { Label } from "@/components/ui/label"
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { Fragment, useRef, useState, useTransition } from "react";
import { Textarea } from "../ui/textarea";
import { ArrowUp, ArrowUpIcon } from "lucide-react";
import { askAIAboutNotesAction } from "@/app/actions/notes";

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
    }

    const textareRef = useRef<HTMLTextAreaElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setQuestionText(e.target.value);
        const textarea = textareRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = textarea.scrollHeight + "px";
        }
    }

    const handleClickInput = () => {
        textareRef.current?.focus();
    }

    const handleSubmit = async (e: React.FormEvent) => {
        if (!questionText.trim()) return;

        const newQuestions = [...questions, questionText.trim()];
        setQuestions(newQuestions);
        setQuestionText("");
        setTimeout(() => {
            scrollToBottom();
        }, 100);

        startTransition(async () => {
            const response = await askAIAboutNotesAction(newQuestions, responses);
            const newResponses = [...responses, response];
            setResponses(newResponses);
            setTimeout(() => {
                scrollToBottom();
            }, 100);
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
            await handleSubmit(e);
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOnOpenChange}>
            <form>
                <DialogTrigger asChild>
                    <Button variant="outline">Ask AI</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] flex flex-col h-[80vh] max-w-3xl overflow-y-auto" ref={contentRef}>
                    <DialogHeader>
                        <DialogTitle>Ask AI</DialogTitle>
                        <DialogDescription>
                            Ask any question and get an AI-generated response about your written notes.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 mb-4">
                        {questions.map((question, index) => (
                            <Fragment key={index}>
                                <p className="text-muted-foreground bg-muted ml-auto px-2 py-1 text-sm rounded-md max-w-2xl">{question}</p>
                                <p dangerouslySetInnerHTML={{ __html: responses[index] }} />
                            </Fragment>
                        ))}
                        {isPending && (<p className="animate-pulse text-sm">Loading...</p>)}
                    </div>
                    <div className="mt-auto flex flex-col w-full cursor-text bg-accent p-4 rounded-md"
                        onClick={handleClickInput}>
                        <Label htmlFor="question" className="mb-2">Your Question</Label>
                        <Textarea
                            id="question"
                            ref={textareRef}
                            value={questionText}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your question here..."
                            className="w-full overflow-hidden placeholder:text-muted-foreground p-0 resize-none rounded-none border-none
                                focus:ring-0 focus:ring-offset-0 bg-transparent shadow-none"
                            rows={1}
                        />
                        <Button type="submit" className="mt-2 self-end"><ArrowUpIcon className="text-muted" /></Button>
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