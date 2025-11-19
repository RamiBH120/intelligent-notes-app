"use server"

import { handleError } from "@/lib/utils";
import { getUser } from "../auth/server";
import { prisma } from "../db/prisma";

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

export async function createNewNoteForUser(noteId: string, authorId: string) {
    try {
        if (!authorId) {
            throw new Error("You are not authorized to create a new note");
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


export async function askAIAboutNotesAction(questions: string[], responses: string[]) {
    try {
        const user = await getUser();
        if (!user) {
            throw new Error("You are not authorized to ask AI about notes");
        }

        const notes = await prisma.note.findMany({
            where: {
                authorId: user.id,
            },
            orderBy: {
                updatedAt: 'desc',
            },
            select: {
                text: true, createdAt: true, updatedAt: true
            },
        });

        if (notes.length === 0) {
            throw new Error("You have no notes to ask AI about");
        }

        const formattedNotes = notes.map((note, index) => `Note ${index + 1} (Last updated: ${note.updatedAt.toDateString()}): ${note.text}`).join("\n");

        const prompt = `
You are an AI assistant that helps users by answering their questions based on their notes.
Here are the user's notes:
${formattedNotes}

Using the above notes, answer the following question:
${questions[questions.length - 1]}

If the answer cannot be found in the notes, respond with "I don't know".
Provide a concise and clear answer.
        `;

        // Call to AI service (e.g., OpenAI)
        const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 500,
            }),
        });

        if (!aiResponse.ok) {
            throw new Error("Failed to get response from AI service");
        }

        const aiData = await aiResponse.json();
        const aiAnswer = aiData.choices[0].message.content.trim();

        responses.push(aiAnswer);
        return aiAnswer;
    } catch (error) {
        return handleError(error);
    }
}