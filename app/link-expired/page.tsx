import AuthForm from "@/components/forms/AuthForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CrossIcon, LockIcon } from "lucide-react";

function LinkExpiredPage() {
  return (
   <div className="mt-20 flex w-full flex-col items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
        <LockIcon className="mx-auto mb-4 text-red-500" size={48} />
        <CardTitle className="text-center text-2xl mb-4">Link Expired!</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-center mb-4">The link has expired. Please log in again to receive a new link in your email.</p>
            <AuthForm type="login" />
        </CardContent>
      </Card>
    </div>
  );
};

export default LinkExpiredPage;