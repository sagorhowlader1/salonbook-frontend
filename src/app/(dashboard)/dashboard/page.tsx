import { SectionHeading } from "@/components/shared/section-heading"
import { StateBlock } from "@/components/shared/state-block"

export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
      <SectionHeading
        align="left"
        eyebrow="Customer Dashboard"
        title="Welcome to your dashboard"
        description="Your appointments, rewards and account activity will appear here."
      />

      <div className="mt-10">
        <StateBlock
          state="empty"
          title="Nothing to show yet"
          description="Book your first appointment and it will appear here with all the details."
        />
      </div>
    </div>
  )
}
