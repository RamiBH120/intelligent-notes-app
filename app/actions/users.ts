"use server"

import { handleError } from "@/lib/utils";
import { createClient } from "../auth/server";
import { prisma } from "../db/prisma";

export async function loginUserAction(email: string, password: string) {
    try {
        const { auth } = await createClient();

        const { error } = await auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;

        return {
            errorMessage: null,
        };

    } catch (error) {
        return handleError(error);
    }
}

export async function logoutUserAction() {
    try {
        const { auth } = await createClient();

        const { error } = await auth.signOut();

        if (error) throw error;

        return {
            errorMessage: null,
        };

    } catch (error) {
        return handleError(error);
    }
}

export async function registerUserAction(email: string, password: string) {
    try {
        const { auth } = await createClient();

        const { data, error } = await auth.signUp({
            email,
            password,
        });
        if (error) throw error;
        
        let userId = data.user?.id;
        if(!userId) throw new Error("User ID not found after registration");
        
        await prisma.user.create({
            data: {
                id: userId,
                email: email,
            },
        });
        return {
            errorMessage: null,
        };

    } catch (error) {
        return handleError(error);
    }
}