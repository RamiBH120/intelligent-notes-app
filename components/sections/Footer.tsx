import Link from "next/link";

const Footer = async () => {
    return (
        <footer className="w-full p-4 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Intelligent Notes App. Made with ❤️ by <Link href="https://rami-benhamouda.tech" className="hover:underline text-amber-100">Rami</Link>.
        </footer>
    );
};

export default Footer;