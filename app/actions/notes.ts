"use server"

import { handleError } from "@/lib/utils";
import { getUser } from "../auth/server";
import { prisma } from "@/lib/prisma";
import { ensureUserExists } from "./users";

import openai from "@/openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

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

export async function createNewNoteForUser(noteId: string) {
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
                text: "",
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
                createdAt: 'desc',
            },
            select: {
                text: true, createdAt: true, updatedAt: true
            },
        });

        if (notes.length === 0) {
            throw new Error("You have no notes to ask AI about");
        }

        const formattedNotes = notes
            .map((note) =>
                `
      Text: ${note.text}
      Created at: ${note.createdAt}
      Last updated: ${note.updatedAt}
      `.trim(),
            )
            .join("\n");


        //         const messages: [] = [`
        // You are a helpful assistant that answers questions about a user's notes. 
        //           Assume all questions are related to the user's notes. 
        //           Make sure that your answers are not too verbose and you speak succinctly. 
        //           Your responses MUST be formatted in clean, valid HTML with proper structure. 
        //           Use tags like <p>, <strong>, <em>, <ul>, <ol>, <li>, <h1> to <h6>, and <br> when appropriate. 
        //           Do NOT wrap the entire response in a single <p> tag unless it's a single paragraph. 
        //           Avoid inline styles, JavaScript, or custom attributes.

        //           Rendered like this in JSX:
        //           <p dangerouslySetInnerHTML={{ __html: YOUR_RESPONSE }} />

        //           Here are the user's notes:
        //           ${formattedNotes}
        //         `]

        const messages: ChatCompletionMessageParam[] = [
            {
                role: "developer",
                content: `
          You are a helpful assistant that answers questions about a user's notes. 
          Assume all questions are related to the user's notes. 
          Make sure that your answers are not too verbose and you speak succinctly. 
          Your responses MUST be formatted in clean, valid HTML with proper structure. 
          Use tags like <p>, <strong>, <em>, <ul>, <ol>, <li>, <h1> to <h6>, and <br> when appropriate. 
          Do NOT wrap the entire response in a single <p> tag unless it's a single paragraph. 
          Avoid inline styles, JavaScript, or custom attributes.
          
          Rendered like this in JSX:
          <p dangerouslySetInnerHTML={{ __html: YOUR_RESPONSE }} />
    
          Here are the user's notes:
          ${formattedNotes}
          `,
            },
        ];

        for (let i = 0; i < questions.length; i++) {
            messages.push({ role: "user", content: questions[i] });
            if (responses.length > i) {
                messages.push({ role: "assistant", content: responses[i] });
            }
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages,
        });

        return completion.choices[0].message.content?.trim() || "I'm sorry, I couldn't generate a response.";

        // Call to AI service (e.g., OpenAI)
        // const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        //     },
        //     body: JSON.stringify({
        //         model: 'gpt-3.5-turbo',
        //         messages: [{ role: 'user', content: prompt }],
        //         max_tokens: 500,
        //     }),
        // });

        // if (!aiResponse.ok) {
        //     throw new Error("Failed to get response from AI service");
        // }

        // const aiData = await aiResponse.json();
        // const aiAnswer = aiData.choices[0].message.content.trim() || "I'm sorry, I couldn't generate a response.";

        // responses.push(aiAnswer);
        // return aiAnswer;
    } catch (error) {
        throw handleError(error);
    }
}