import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const handleError = (error: unknown) => {
    console.error("Error occurred:", error);
    let errorMessage = "An unknown error occurred.";

    if (error instanceof Error) {
        errorMessage = (error as any).code === "P2002"
            ? "A record with this value already exists."
            : error.message;
    }
    else if (typeof error === "string") {
        errorMessage = error;
    }

    return {
        errorMessage,
    };
}

export const scrollToBottom = (contentRef: React.RefObject<HTMLDivElement | null>) => {
    contentRef?.current?.scrollTo({
        top: contentRef.current.scrollHeight,
        behavior: "smooth"
    });
}

export const handleKeyDown = async (e: React.KeyboardEvent, handleSubmit: (e: React.FormEvent) => void) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
    }
}