import { User } from "@supabase/supabase-js";

import { Button } from "@/components/ui/button"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { UserCircleIcon } from "lucide-react";

type Props = {
    user: User | null;
};

const UserInformation = ({ user }: Props) => {
    return (
        <HoverCard>
            <HoverCardTrigger asChild>

                    <UserCircleIcon size={32} className="text-indigo-400" />
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
                <div className="flex justify-between gap-4">
                    <div className="space-y-1">
                        <h4 className="text-sm font-semibold"><span className="font-medium text-gray-800 dark:text-gray-200">{user?.email}</span></h4>
                        <p className="text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Joined {user?.created_at.split("T")[0].replace(/-/g, "/")}</span>
                        </p>
                        {/* <div className="text-muted-foreground text-xs">
                             December 2021
                        </div> */}
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
}

export default UserInformation;