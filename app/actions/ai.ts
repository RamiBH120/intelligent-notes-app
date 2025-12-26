"use server"

import { handleError } from "@/lib/utils";
import { getUser } from "../auth/server";
import { prisma } from "@/lib/prisma";

import openai from "@/openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { GoogleGenAI } from "@google/genai";

// The SDK automatically uses the GEMINI_API_KEY environment variable
const ai = new GoogleGenAI({});


export async function askOpenAIAboutNotesAction(questions: string[], responses: string[]) {
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
            model: "gpt-3.5-turbo",
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

export async function askGeminiAboutNotesAction(questions: string[], responses: string[]) {
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

        const prompt = `
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
        `;

        const fullPrompt = questions.reduce((acc, question, index) => {
            acc += `\nUser: ${question}\n`;
            if (responses[index]) {
                acc += `AI: ${responses[index]}\n`;
            }
            return acc;
        }, prompt);

        const model = "gemini-2.5-flash"; // Use the free tier flash model

        const response = await ai.models.generateContent({
            model: model,
            contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
        });
        // if (!response || !response.text) {
        //     throw new Error("Failed to get response from Gemini AI service");
        // }

        const noteText = response.text || "I'm sorry, I couldn't generate a response. Try again.";
        return noteText;
    } catch (error) {
        throw handleError(error);
    }
}

// Generate a note on a given topic using OpenAI
export async function generateNoteWithOpenAIAction(topic: string) {
    try {
        const user = await getUser();
        if (!user) {
            throw new Error("You are not authorized to generate a note");
        }

        const prompt = `Please generate a detailed note on the following topic: ${topic}. The note should be well-structured and informative.`;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "user", content: prompt }
            ],
        });

        const noteText = completion.choices[0].message.content?.trim() || "I'm sorry, I couldn't generate a note.";

        // Save the generated note to the database
        const newNote = await prisma.note.create({
            data: {
                authorId: user.id,
                text: noteText,
            },
        });

        return newNote;
    } catch (error) {
        throw handleError(error);
    }
}

// Generate a note on a given topic using Gemini AI
export async function generateNoteWithGeminiAction(topic: string) {
    try {
        const user = await getUser();
        if (!user) {
            throw new Error("You are not authorized to generate a note");
        }

        const prompt = `You are a helpful assistant that generate a concise and simple note about a user's desired topic. 
          Assume the topic is related to the user's goals and ambitions. 
        The note should be brief and straight to the point in a todo checklist of tasks format without going into much details.
        Make sure that your answer is not too verbose and you speak succinctly. 
          Your response MUST be formatted in clean, valid HTML with proper structure. 
          Use tags like <p>, <strong>, <em>, <ul>, <ol>, <li>, <h1> to <h6>, and <br> when appropriate. 
          Do NOT wrap the entire response in a single <p> tag unless it's a single paragraph. 
          Avoid inline styles, JavaScript, or custom attributes.
          
          Rendered like this in JSX:
          <p dangerouslySetInnerHTML={{ __html: YOUR_RESPONSE }} />

          Here is the user's desired topic: ${topic}
        `;

        // const response = await fetch('https://api.gemini.com/v1/chat/completions', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`,
        //     },
        //     body: JSON.stringify({
        //         model: 'gemini-2.5-flash',
        //         messages: [{ role: 'user', content: prompt }],
        //         max_tokens: 500,
        //     }),
        // });

        // if (!response.ok) {
        //     throw new Error("Failed to get response from Gemini AI service");
        // }

        // const data = await response.json();
        // const noteText = data.choices[0].message.content?.trim() || "I'm sorry, I couldn't generate a note.";

        const model = "gemini-2.5-flash"; // Use the free tier flash model

        const response = await ai.models.generateContent({
            model: model,
            contents: [{ role: "user", parts: [{ text: prompt }] }],
        });


        const noteText = response.text || "I'm sorry, I couldn't generate a note. Try again.";
        // Save the generated note to the database
        // if (!noteText) {
        //     throw new Error("Failed to generate note text from Gemini AI");
        // }
        if (noteText.startsWith("I'm sorry")) {
            throw new Error(noteText);
        }
        
        return noteText;
    } catch (error) {
        throw handleError(error);
    }
}

// Summarize a note using AI
export async function summarizeNoteWithAIAction(noteId: string) {
    try {
        const user = await getUser();
        if (!user) {
            throw new Error("You are not authorized to summarize this note");
        }

        const note = await prisma.note.findUnique({
            where: {
                id: noteId,
                authorId: user.id,
            },
        });

        if (!note) {
            throw new Error("Note not found");
        }

        const prompt = `Please provide a concise summary of the following note:\n\n${note.text}`;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "user", content: prompt }
            ],
        });

        const summary = completion.choices[0].message.content?.trim() || "I'm sorry, I couldn't generate a summary.";

        return summary;
    } catch (error) {
        throw handleError(error);
    }
}