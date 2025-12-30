import HomeSection from "@/components/sections/HomeSection";
import { Card } from "@/components/ui/card";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Home - Intelligent Notes App', // The title for the page
    description: 'Welcome to the Intelligent Notes App home page.', // Optional: also good for SEO
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