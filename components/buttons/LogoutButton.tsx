"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { logoutUserAction } from "@/app/actions/users";

export const LogoutButton = () => {

    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const handleLogout = async () => {
        console.log("User logged out");
        // Add your logout logic here
        setLoading(true);
        
        const result = await logoutUserAction();
        
        const errorMessage = result.errorMessage;
        
        if(!errorMessage){
            toast.success("Logged out successfully");
            router.push("/login");
        } else {
            toast.error(errorMessage);
        }

        setLoading(false);
    }
    return (
        <>
        <Button onClick={handleLogout} variant="outline" disabled={loading} className="w-25 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            
        {
            loading ? (<Loader2 className="animate-spin"/>) : "Logout"
        }
        </Button>
        </>
    );
}