import AuthForm from "@/components/forms/AuthForm";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { LogInIcon } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Login - Intelligent Notes App', // The title for the page
  description: 'Login to your account to access the Intelligent Notes App.', // Optional: also good for SEO
};


function LoginPage() {
  return (
    <div className="mt-20 flex w-full flex-col items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <LogInIcon className="mx-auto mb-4 text-green-500" size={48} />
          <CardTitle className="text-center text-2xl mb-4">Login</CardTitle>

        </CardHeader>
        <AuthForm type="login" />
      </Card>
    </div>
  );
};

export default LoginPage;