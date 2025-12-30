import HomeSection from "@/components/sections/HomeSection";
import { Card } from "@/components/ui/card";
import { appName } from "@/lib/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: `Home - ${appName}`, // The title for the page
    description: `Welcome to the ${appName} home page.`, // Optional: also good for SEO
};

const HomePage = () => {

    return (
        <div className="mt-20 flex w-full flex-col items-center justify-center px-4">
            <Card className="w-full shadow-lg">
                <HomeSection />
            </Card>
        </div>
    );
}
export default HomePage;