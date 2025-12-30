import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { CircleQuestionMarkIcon } from "lucide-react";
import Link from "next/link";

const AboutProjectButton = () => {


    return (<Dialog>
                <DialogTrigger asChild>
                    <Link href="#" className="rounded-md px-14 py-3 text-lg font-semibold text-indigo-600 bg-white shadow-md transition duration-200 hover:text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50 border-accent-foreground">About this Project</Link>
                </DialogTrigger>
                <DialogContent className="custom-scrollbar flex flex-col h-[85vh] max-w-4xl overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>The technologies used in this project</DialogTitle>
                    </DialogHeader>
                    <DialogDescription className="mt-4 mb-8 space-y-4">
                        <ul className="list-disc list-inside space-y-2">
                            <li><strong>Next.js:</strong> A React framework for building server-side rendered and statically generated web applications.</li>
                            <li><strong>TypeScript:</strong> A superset of JavaScript that adds static typing to enhance code quality and maintainability.</li>
                            <li><strong>Tailwind CSS:</strong> A utility-first CSS framework for rapidly building custom user interfaces.</li>
                            <li><strong>Gemini API:</strong> An API that provides access to advanced AI models for natural language processing and generation.</li>
                            <li><strong>Prisma:</strong> An ORM (Object-Relational Mapping) tool for database management and querying.</li>
                            <li><strong>PostgreSQL:</strong> A powerful, open-source relational database system used for storing application data.</li>
                            <li><strong>Vercel:</strong> A cloud platform for deploying and hosting web applications with ease.</li>
                        </ul>
                        <h3 className="mt-6 text-lg font-semibold">Additional Resources:</h3>
                        <ul className="list-disc list-inside space-y-2">
                            <li><Link href="https://nextjs.org/" target="_blank" className="text-indigo-600 hover:underline">Next.js Official Website</Link></li>
                            <li><Link href="https://www.typescriptlang.org/" target="_blank" className="text-indigo-600 hover:underline">TypeScript Official Website</Link></li>
                            <li><Link href="https://tailwindcss.com/" target="_blank" className="text-indigo-600 hover:underline">Tailwind CSS Official Website</Link></li>
                            <li><Link href="https://gemini.com/api/" target="_blank" className="text-indigo-600 hover:underline">Gemini API Documentation</Link></li>
                            <li><Link href="https://www.prisma.io/" target="_blank" className="text-indigo-600 hover:underline">Prisma Official Website</Link></li>
                            <li><Link href="https://www.postgresql.org/" target="_blank" className="text-indigo-600 hover:underline">PostgreSQL Official Website</Link></li>
                            <li><Link href="https://vercel.com/" target="_blank" className="text-indigo-600 hover:underline">Vercel Official Website</Link></li>
                        </ul>
                        <h3 className="mt-6 text-lg font-semibold">Project Repository:</h3>
                        <p>Explore the source code and contribute to the project on <Link href="https://github.com/RamiBH120/intelligent-notes-app" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">GitHub</Link>.</p>

                    </DialogDescription>
                    {/* <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline"> 
                                        <StopCircleIcon size={16} /> Cancel</Button>
                        </DialogClose>
                    </DialogFooter> */}
                </DialogContent>
        </Dialog>);
}

export default AboutProjectButton;