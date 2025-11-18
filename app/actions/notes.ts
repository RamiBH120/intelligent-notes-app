"use server"

import { handleError } from "@/lib/utils";
import { getUser } from "../auth/server";
import { prisma } from "../db/prisma";

export async function updateNoteAction(noteId: string, noteText: string) {
    try {
        const user = await getUser();
        if (!user) {
            throw new Error("User not authenticated");
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

export async function createNewNoteForUser( noteId: string, authorId: string) {
    try {
        if (!authorId) {
            throw new Error("User not authenticated");
        }
        
        await prisma.note.create({
            data: {
                id: noteId,
                authorId: authorId,
                text: "",
            },
        })

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
            throw new Error("User not authenticated");
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