import AuthForm from "@/components/forms/AuthForm";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { PenBoxIcon } from "lucide-react";

function SignUpPage() {
    return (

    <div className="mt-20 flex w-full flex-col items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <PenBoxIcon className="mx-auto mb-4 text-blue-500" size={48} />
        <CardTitle className="text-center text-2xl mb-4">Sign Up</CardTitle>

        </CardHeader>
        <AuthForm type="register" />
      </Card>
    </div>
    )
}

export default SignUpPage;