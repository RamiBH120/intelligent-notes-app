import AuthForm from "@/components/forms/AuthForm";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { DoorOpenIcon } from "lucide-react";

function LoginPage() {
  return (
   <div className="mt-20 flex w-full flex-col items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <DoorOpenIcon className="mx-auto mb-4 text-green-500" size={48} />
        <CardTitle className="text-center text-2xl mb-4">Login</CardTitle>

        </CardHeader>
        <AuthForm type="login" />
      </Card>
    </div>
  );
};

export default LoginPage;