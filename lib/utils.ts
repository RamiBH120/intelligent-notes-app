import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const handleError = (error: unknown) => {
    console.error("Error occurred:", error);
    let errorMessage = "An unknown error occurred.";

    if (error instanceof Error) {
        errorMessage = error.message;
    }
    else if (typeof error === "string") {
        errorMessage = error;
    }

    return {
        errorMessage,
    };
}