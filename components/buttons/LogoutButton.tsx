"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { DoorClosedIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { logoutUserAction } from "@/app/actions/users";
import useNote from "@/hooks/useNote";

export const LogoutButton = () => {

    const [loading, setLoading] = useState(false);
    const {setUserAuthenticated} = useNote();
    const router = useRouter();
    const handleLogout = async () => {
        setLoading(true);

        const result = await logoutUserAction();

        const errorMessage = result.errorMessage;

        if (!errorMessage) {
            setUserAuthenticated && setUserAuthenticated(false);
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
                    loading ? (<Loader2 className="animate-spin" />) : <><DoorClosedIcon className="inline-block mr-2" /> Logout</>
                }
            </Button>
        </>
    );
}