import { FeaturedServices } from "@/components/home/featured-services"
import { HeroBanner } from "@/components/home/hero-banner"
import { ServiceCategories } from "@/components/home/service-categories"
import { WhyChooseUs } from "@/components/home/why-choose-us"


export default function Home() {
  return (
    <>
      <HeroBanner />
      <FeaturedServices />
      <ServiceCategories />
      <WhyChooseUs /> 
    </>
  )
}
