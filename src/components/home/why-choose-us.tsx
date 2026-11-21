
import {
  Award,
  Sparkles,
  CalendarCheck,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: Award,
    title: "Expert Professionals",
    description:
      "Get personalized care from skilled and experienced salon professionals.",
  },
  {
    icon: Sparkles,
    title: "Premium Experience",
    description:
      "Enjoy a relaxing and comfortable salon experience every time.",
  },
  {
    icon: CalendarCheck,
    title: "Easy Online Booking",
    description:
      "Book your favorite salon service anytime with just a few clicks.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted Services",
    description:
      "Enjoy a smooth booking experience with clear service information.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Why SalonBook
          </p>

          <h2 className="text-3xl md:text-4xl font-bold mt-3">
            Beauty Meets Convenience
          </h2>

          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            We make discovering and booking your favorite salon services
            simple, comfortable and convenient.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-2xl border bg-card p-7 text-center hover:shadow-lg transition"
              >
                <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <Icon size={30} />
                </div>

                <h3 className="font-semibold text-lg mt-5">
                  {feature.title}
                </h3>

                <p className="text-sm text-muted-foreground mt-3 leading-6">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
