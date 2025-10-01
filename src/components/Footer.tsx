import Link from 'next/link';
import Image from 'next/image';
import { 
  Github, 
  Linkedin, 
  Instagram, 
  Globe, 
  Link2,
  Heart,
  Code
} from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border/50 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Future Engineers
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              A collaborative platform for engineering students to share and access educational resources, notes, and study materials.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <Code className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Built with</span>
              <Heart className="h-4 w-4 text-red-500 animate-pulse" />
              <span className="text-muted-foreground">by engineers</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/resources" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                  Browse Resources
                </Link>
              </li>
              <li>
                <Link 
                  href="/contribute" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                  Contribute
                </Link>
              </li>
              <li>
                <Link 
                  href="/leaderboard" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link 
                  href="/dashboard" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Developer Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Connect with Developer</h3>
            <div className="flex items-center gap-3 mb-4">
              {/* Developer Image */}
              <div className="relative h-12 w-12 rounded-full overflow-hidden ring-2 ring-primary/20 flex-shrink-0 bg-gradient-to-br from-primary/20 to-purple-600/20">
                <Image
                  src="/images/vicky.jpg"
                  alt="Vikas A"
                  fill
                  className="object-cover"
                  sizes="48px"
                  priority
                />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Developed by
                </p>
                <p className="font-semibold text-foreground">Vikas A</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://linktr.ee/Its_VikasA"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 hover:bg-green-500/20 hover:scale-110 transition-all duration-300 group"
                aria-label="Linktree"
              >
                <Link2 className="h-5 w-5 text-green-600 group-hover:rotate-12 transition-transform" />
              </a>
              <a
                href="https://www.linkedin.com/in/vikas028"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 hover:bg-blue-500/20 hover:scale-110 transition-all duration-300 group"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5 text-blue-600 group-hover:rotate-12 transition-transform" />
              </a>
              <a
                href="https://github.com/ItsVikasA"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gradient-to-br from-gray-500/10 to-gray-500/5 border border-gray-500/20 hover:bg-gray-500/20 hover:scale-110 transition-all duration-300 group"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5 text-gray-700 dark:text-gray-300 group-hover:rotate-12 transition-transform" />
              </a>
              <a
                href="https://www.instagram.com/hands_on_coding_028"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gradient-to-br from-pink-500/10 to-pink-500/5 border border-pink-500/20 hover:bg-pink-500/20 hover:scale-110 transition-all duration-300 group"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5 text-pink-600 group-hover:rotate-12 transition-transform" />
              </a>
              <a
                href="https://alwaysforone.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 hover:bg-purple-500/20 hover:scale-110 transition-all duration-300 group"
                aria-label="Personal Website"
              >
                <Globe className="h-5 w-5 text-purple-600 group-hover:rotate-12 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Future Engineers. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-primary transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
