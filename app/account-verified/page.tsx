import AuthForm from "@/components/forms/AuthForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { appName } from "@/lib/constants";
import { CheckCircle } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Account Verified - ${appName}`, // The title for the page
  description: 'Your account has been successfully verified. Please log in to continue.', // Optional: also good for SEO
};


function AccountVerifiedPage() {
  return (
    <div className="mt-20 flex w-full flex-col items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CheckCircle className="mx-auto mb-4 text-green-500" size={48} />
          <CardTitle className="text-center text-2xl mb-4">Account Verified!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center mb-4">Your account has been successfully verified. Please log in to continue.</p>
          <AuthForm type="login" />
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountVerifiedPage;