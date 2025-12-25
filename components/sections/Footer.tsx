const Footer = async () => {
    return (
        <footer className="w-full p-4 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Intelligent Notes App. All rights reserved.
        </footer>
    );
};

export default Footer;