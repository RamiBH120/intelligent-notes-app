import AuthForm from "@/components/AuthForm";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

function SignUpPage() {
    return (

    <div className="flex flex-col items-center justify-center h-screen m-auto py-2">
      <Card className="w-96 shadow-lg mb-8">
        <CardHeader>
        <CardTitle className="text-2xl mb-4">Sign Up</CardTitle>

        </CardHeader>
        <AuthForm type="register" />
      </Card>
    </div>
    )
}

export default SignUpPage;