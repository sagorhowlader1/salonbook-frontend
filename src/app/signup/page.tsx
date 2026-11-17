import type { Metadata } from "next"
import { SignUpForm } from "@/components/auth/sign-up-form"

export const metadata: Metadata = {
  title: "Sign Up — SalonBook",
}

export default function SignUpPage() {
  return (
    <section className="flex justify-center px-4 py-10 sm:py-14">
      <div className="w-full max-w-md">
        <SignUpForm />
      </div>
    </section>
  )
}
