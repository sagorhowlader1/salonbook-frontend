




import BrowseServices from "./browse-services";

interface Service {
  _id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  status: "Active" | "Inactive";
}

async function getServices(): Promise<Service[]> {
  try {
    const API_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    const response = await fetch(`${API_URL}/service`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch services");
    }

    const data: Service[] = await response.json();

    return data.filter(
      (service) => service.status === "Active"
    );
  } catch (error) {
    console.error("Services fetch error:", error);
    return [];
  }
}

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const [services, params] = await Promise.all([
    getServices(),
    searchParams,
  ]);

  return (
    <main className="min-h-screen bg-background px-5 py-16">
      <div className="mx-auto max-w-7xl">

        {/* Page Header */}
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-gold">
            Our Services
          </p>

          <h1 className="text-4xl font-bold tracking-tight">
            Explore Our Salon Services
          </h1>

          <p className="mt-4 text-muted-foreground">
            Discover our professional beauty and salon services.
          </p>
        </div>

        {/* Browse Services */}
        {services.length === 0 ? (
          <div className="py-20 text-center">
            <h2 className="text-xl font-semibold">
              No Services Available
            </h2>

            <p className="mt-2 text-muted-foreground">
              Please check back later.
            </p>
          </div>
        ) : (
          <BrowseServices
            services={services}
            initialCategory={params.category || ""}
          />
        )}

      </div>
    </main>
  );
}








// import Link from "next/link";

// interface Service {
//   _id: string;
//   name: string;
//   category: string;
//   description: string;
//   price: number;
//   duration: number;
//   image: string;
//   status: "Active" | "Inactive";
// }

// async function getServices(): Promise<Service[]> {
//   try {
//     const API_URL =
//       process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

//     const response = await fetch(`${API_URL}/service`, {
//       cache: "no-store",
//     });

//     if (!response.ok) {
//       throw new Error("Failed to fetch services");
//     }

//     const data = await response.json();

//     return data.filter(
//       (service: Service) => service.status === "Active"
//     );
//   } catch (error) {
//     console.error("Services fetch error:", error);
//     return [];
//   }
// }

// export default async function ServicesPage() {
//   const services = await getServices();

//   return (
//     <main className="min-h-screen bg-background px-5 py-16">
//       <div className="mx-auto max-w-7xl">

//         <div className="mb-10 text-center">
//           <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-gold">
//             Our Services
//           </p>

//           <h1 className="text-4xl font-bold tracking-tight">
//             Explore Our Salon Services
//           </h1>

//           <p className="mt-4 text-muted-foreground">
//             Discover our professional beauty and salon services.
//           </p>
//         </div>

//         {services.length === 0 ? (
//           <div className="py-20 text-center">
//             <h2 className="text-xl font-semibold">
//               No Services Available
//             </h2>

//             <p className="mt-2 text-muted-foreground">
//               Please check back later.
//             </p>
//           </div>
//         ) : (
//           <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">

//             {services.map((service) => (
//               <div
//                 key={service._id}
//                 className="overflow-hidden rounded-2xl border bg-card shadow-sm"
//               >
//                 <div className="h-56 overflow-hidden bg-muted">
//                   {service.image && (
//                     <img
//                       src={service.image}
//                       alt={service.name}
//                       className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
//                     />
//                   )}
//                 </div>

//                 <div className="space-y-4 p-5">

//                   <div>
//                     <p className="text-sm text-muted-foreground">
//                       {service.category}
//                     </p>

//                     <h2 className="mt-1 text-xl font-semibold">
//                       {service.name}
//                     </h2>
//                   </div>

//                   <p className="line-clamp-2 text-sm text-muted-foreground">
//                     {service.description}
//                   </p>

//                   <div className="flex items-center justify-between">
//                     <span className="text-lg font-bold">
//                       ${service.price}
//                     </span>

//                     <span className="text-sm text-muted-foreground">
//                       {service.duration} min
//                     </span>
//                   </div>

//                   <Link
//                     href={`/services/${service._id}`}
//                     className="block rounded-full bg-primary px-5 py-3 text-center text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
//                   >
//                     View Details
//                   </Link>

//                 </div>
//               </div>
//             ))}

//           </div>
//         )}
//       </div>
//     </main>
//   );
// }
