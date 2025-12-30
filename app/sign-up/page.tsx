import AuthForm from "@/components/forms/AuthForm";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { DoorOpenIcon } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Sign Up - Intelligent Notes App', // The title for the page
  description: 'Create a new account to access the Intelligent Notes App.', // Optional: also good for SEO
};


function SignUpPage() {
  return (

    <div className="mt-20 flex w-full flex-col items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <DoorOpenIcon className="mx-auto mb-4 text-blue-500" size={48} />
          <CardTitle className="text-center text-2xl mb-4">Sign Up</CardTitle>

        </CardHeader>
        <AuthForm type="register" />
      </Card>
    </div>
  )
}

export default SignUpPage;