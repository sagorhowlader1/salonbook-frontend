import Link from "next/link"
import { Scissors } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Scissors className="size-7" />
      </span>

      <div>
        <Badge variant="outline">Error 404</Badge>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Page not found
        </h1>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been
          moved. Let&apos;s get you back on track.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button
          size="lg"
          nativeButton={false}
          render={<Link href="/" />}
          className="rounded-full bg-linear-to-r from-fuchsia-600 to-violet-600 text-white hover:opacity-90"
        >
          Back to Home
        </Button>
        <Button
          variant="outline"
          size="lg"
          nativeButton={false}
          render={<Link href="/services" />}
          className="rounded-full"
        >
          Browse Services
        </Button>
      </div>
    </section>
  )
}
