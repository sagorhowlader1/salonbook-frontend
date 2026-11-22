import Link from "next/link"
import { AtSign, Clock, Globe, Hash, Mail, MapPin, Phone, Scissors } from "lucide-react"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Browse Services" },
  { href: "/dashboard", label: "Dashboard" },
] as const

const socialLinks = [
  { href: "https://instagram.com", label: "Instagram", icon: AtSign },
  { href: "https://facebook.com", label: "Facebook", icon: Globe },
  { href: "https://x.com", label: "X (Twitter)", icon: Hash },
] as const

 const Dete = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="border-t bg-muted/50 text-muted-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link
            href="/"
            aria-label="SalonBook home"
            className="flex items-center gap-2 font-semibold text-foreground"
          >
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Scissors className="size-4" />
            </span>
            SalonBook
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed">
            Book salon appointments online — browse trusted salons, compare
            services and reserve your visit in minutes.
          </p>
          <div className="mt-5 flex items-center gap-2">
            {socialLinks.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex size-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Footer">
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
            Navigation
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
            Contact
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li className="flex items-center gap-2">
              <Phone className="size-4 shrink-0 text-primary" />
              <a href="tel:+15551234567" className="transition-colors hover:text-foreground">
                +1 (555) 123-4567
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 shrink-0 text-primary" />
              <a
                href="mailto:hello@salonbook.com"
                className="transition-colors hover:text-foreground"
              >
                hello@salonbook.com
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
            Visit Us
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>
                123 Beauty Avenue
                <br />
                New York, NY 10001
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>
                Mon – Sat: 9:00 AM – 8:00 PM
                <br />
                Sunday: Closed
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-5 text-sm sm:flex-row">
          <p>© {Dete} SalonBook. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy-policy" className="transition-colors hover:text-foreground">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
