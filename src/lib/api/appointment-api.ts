
export interface Appointment {
  _id: string;
  customerId: string;
  serviceId: string;
  serviceName: string;
  serviceImage: string;
  serviceCategory: string;
  servicePrice: number;
  appointmentDate: string;
  timeSlot: string;
  appointmentStatus: "Pending" | "Confirmed" | "Cancelled";
  paymentStatus: "Unpaid" | "Paid";
  createdAt: string;
}




export async function getMyAppointments(): Promise<Appointment[]> {
  const response = await fetch("/api/appointments/my", {
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch appointments");
  }

  return result.data;
}



export async function cancelAppointment(id: string) {
  const response = await fetch(
    `/api/appointments/${id}/cancel`,
    {
      method: "PATCH",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to cancel appointment"
    );
  }

  return result;
}












// const API_URL = "/api/appointments";

// export async function getMyAppointments(): Promise<Appointment[]> {
//   const response = await fetch(`${API_URL}/my`, {
//     cache: "no-store",
//   });

//   if (!response.ok) {
//     throw new Error("Failed to fetch appointments");
//   }

//   return response.json();
// }

// export async function cancelAppointment(id: string) {
//   const response = await fetch(`${API_URL}/${id}/cancel`, {
//     method: "PATCH",
//   });

//   const result = await response.json();

//   if (!response.ok) {
//     throw new Error(result.message || "Failed to cancel appointment");
//   }

//   return result;
// }
