"use server"

import { handleError } from "@/lib/utils";
import { getUser } from "../auth/server";
import { prisma } from "@/lib/prisma";
import { ensureUserExists } from "./users";

export async function getNotesForUser() {
    try {
        const user = await getUser();
        if (!user) {
            throw new Error("You are not authorized to view notes");
        }

        const notes = await prisma.note.findMany({
            where: {
                authorId: user.id,
            },
            orderBy: {
                updatedAt: 'desc',
            },
            take: 10,
        });

        return notes;

    } catch (error) {
        return handleError(error);
    }
}

export async function getNoteById(noteId: string) {
    try {
        const user = await getUser();
        if (!user) {
            throw new Error("You are not authorized to view this note");
        }

        const note = await prisma.note.findFirst({
            where: {
                id: noteId,
                authorId: user.id,
            },
        });

        if (!note) {
            throw new Error("Note not found");
        }

        return note;

    } catch (error) {
        return handleError(error);
    }
}

export async function updateNoteAction(noteId: string, noteText: string) {
    try {
        const user = await getUser();
        if (!user) {
            throw new Error("You are not authorized to update this note");
        }

        await prisma.note.update({
            where: {
                id: noteId,
            },
            data: {
                text: noteText,
            },
        });

        return {
            errorMessage: null,
        };

    } catch (error) {
        return handleError(error);
    }
}


export async function createNoteForUser(noteId: string, noteText: string | null) {
    try {
        // Get the currently authenticated user on the server side.
        const user = await ensureUserExists();
        if (!user) {
            throw new Error("User not found or not authenticated");
        }

        await prisma.note.create({
            data: {
                id: noteId,
                authorId: user.id,
                text: noteText || "",
            }
        });

        return {
            errorMessage: null,
        };
    } catch (error) {
        return handleError(error);
    }
}

export async function deleteNoteAction(noteId: string) {
    try {
        const user = await getUser();
        if (!user) {
            throw new Error("You are not authorized to delete this note");
        }

        await prisma.note.delete({
            where: {
                id: noteId,
                authorId: user.id,
            },
        });

        return {
            errorMessage: null,
        };
    } catch (error) {
        return handleError(error);
    }
}
