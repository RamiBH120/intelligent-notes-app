"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CardContent, CardFooter } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import React from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { loginUserAction, registerUserAction } from "@/app/actions/users";

type Props = {
    type: "login" | "register";
};

const AuthForm = ({ type }: Props) => {
    const isLoginForm = type === "login";

    const router = useRouter();
    const [isPendingLogin, startLoginTransition] = React.useTransition();

    const handleSubmit = (form: FormData) => {
        startLoginTransition(async () => {
            const email = form.get("email") as string;
            const password = form.get("password") as string;

            let errorMessage, title, description = "";

            if (isLoginForm) {
                errorMessage = (await loginUserAction(email, password)).errorMessage;
                title = "Logged In";
                description = "You have successfully logged in.";
            }
            else {
                errorMessage = (await registerUserAction(email, password)).errorMessage;
                title = "Registered";
                description = "You have successfully registered.";
            }

            if (errorMessage) {
                console.error(errorMessage);
                
                toast.error("Your credentials are invalid. Please try again.");
            } else {
                toast.success(title, {
                    description: description,
                });
                router.replace("/");
            }

        });

    };


    return (
        <form action={handleSubmit} className="flex flex-col gap-4">
            <CardContent className="grid w-full gap-4">
                <div className="flex flex-col space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input type="email" id="email" name="email" required placeholder="Enter your email" disabled={isPendingLogin} />
                </div>
                <div className="flex flex-col space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input type="password" id="password" name="password" required placeholder="Enter your password" disabled={isPendingLogin} />
                </div>
            </CardContent>
            <CardFooter className="mt-4 flex flex-col gap-6">
                <Button className="w-full" type="submit" disabled={isPendingLogin}>
                    {isPendingLogin ? <Loader2 className="animate-spin" /> : (isLoginForm ? "Login" : "Register")}
                </Button>
                <p className="text-xs">
                    {isLoginForm ? "Don't have an account? Register now!" : "Already have an account? Login here!"}
                    <Link href={isLoginForm ? "/sign-up" : "/login"} className={`ml-1 text-blue-500 hover:underline ${isPendingLogin ? " pointer-events-none text-gray-400 opacity-50" : ""}`}>
                        {isLoginForm ? "Sign Up" : "Login"}
                    </Link>
                </p>
            </CardFooter>
        </form>
    );
};

export default AuthForm;