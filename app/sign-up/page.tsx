import AuthForm from "@/components/AuthForm";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

function SignUpPage() {
    return (

    <div className="mt-20 flex w-full flex-col items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
        <CardTitle className="text-center text-2xl mb-4">Sign Up</CardTitle>

        </CardHeader>
        <AuthForm type="register" />
      </Card>
    </div>
    )
}

export default SignUpPage;