import Link from "next/link";

const Footer = async () => {
    return (
        <footer className="w-full p-4 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Intelligent Notes App. Made with ❤️ by <Link href="https://rami-benhamouda.tech" target="_blank" className="hover:underline text-accent-foreground">Rami</Link>.
        </footer>
    );
};

export default Footer;