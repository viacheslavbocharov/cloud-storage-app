import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Sticky Navbar */}
      <header className="sticky top-0 z-50 bg-background border-b">
        <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 flex items-center justify-between py-4">
          <Link
            to="/"
            className="text-2xl sm:text-3xl font-bold text-foreground hover:opacity-90 transition"
          >
            Drivix
          </Link>

          <Button asChild>
            <Link to="/login">Sign in</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-muted text-foreground min-h-[70vh] flex items-center justify-center w-full">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Welcome to Drivix
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground">
            Your ultimate solution for secure and intelligent file storage.
          </p>
        </div>
      </section>

      {/* Description Section */}
      <section className="bg-background text-foreground min-h-[70vh] flex items-center w-full">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-semibold">
            Why choose Drivix?
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            We provide a fast, private, and reliable cloud storage platform that
            adapts to your needs. Manage your files, share them securely, and
            collaborate effortlessly.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted text-muted-foreground py-6 text-center">
        <div className="text-sm">© 2025 Drivix. All rights reserved.</div>
      </footer>
    </div>
  );
}
