import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-gold/10 via-background to-background">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:py-16 lg:grid-cols-2 lg:items-center lg:gap-12 lg:py-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-gold uppercase">
            <span className="size-1.5 rounded-full bg-gold" />
            Luxury Salon Experience
          </span>
          <h1 className="mt-6 max-w-xl font-heading text-4xl leading-[1.05] font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Where elegance meets <span className="text-gold">exceptional</span> care.
          </h1>
          <p className="mt-5 max-w-lg text-base text-muted-foreground sm:text-lg">
            Discover hand-curated luxury salons, compare premium services and
            reserve your appointment in minutes — all with SalonBook.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              nativeButton={false}
              render={<Link href="/services" />}
              className="rounded-full bg-linear-to-r from-gold-light to-gold font-semibold text-black shadow-lg shadow-gold/20 hover:brightness-105"
            >
              Explore Salon Services
            </Button>
          </div>
        </div>

        <div className="relative mx-auto aspect-[4/3] w-full max-w-md overflow-hidden rounded-3xl border border-gold/20 shadow-2xl shadow-gold/10 lg:max-w-none">
          <Image
            src="/images/hero-salon.png"
            alt="Luxury salon experience"
            fill
            priority
            sizes="(min-width: 1024px) 40rem, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  )
}
