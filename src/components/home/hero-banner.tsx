import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-linear-to-bl from-primary/10 via-background to-primary/5">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:py-16 lg:grid-cols-2 lg:items-center lg:gap-12 lg:py-24">
        <div>
          <span className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
            Premium Beauty Salon
          </span>
          <h1 className="mt-6 max-w-xl text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl">
            Book your next salon visit in minutes.
          </h1>
          <p className="mt-5 max-w-lg text-base text-muted-foreground sm:text-lg">
            SalonBook connects you with trusted salons — browse services,
            compare prices and reserve your appointment online.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              nativeButton={false}
              render={<Link href="/services" />}
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/80"
            >
              Explore Salon Services
            </Button>
          </div>
        </div>

        <div className="relative mx-auto aspect-[4/3] w-full max-w-md overflow-hidden rounded-3xl shadow-xl shadow-primary/20 lg:max-w-none">
          <Image
            src="/images/hero-salon.png"
            alt="SalonBook partner salon"
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
