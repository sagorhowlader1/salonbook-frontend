import type { Metadata } from "next"
import { SignInForm } from "@/components/auth/sign-in-form"

export const metadata: Metadata = {
  title: "Sign In — SalonBook",
}

export default function SignInPage() {
  return (
    <section className="flex justify-center px-4 py-10 sm:py-14">
      <div className="w-full max-w-md">
        <SignInForm />
      </div>
    </section>
  )
}
