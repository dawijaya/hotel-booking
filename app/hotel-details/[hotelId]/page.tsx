import { fetchHotelById } from "@/action/fetchHotelsById";
import HotelDetail from "@/components/hotel/HotelDetail";

// Next.js secara otomatis menyediakan params dari rute dinamis
interface PageProps {
  params: {
    hotelId: string;
  };
}

export default async function HotelDetailsPage({ params }: PageProps) {
  // Mengakses hotelId dari params
  const { hotelId } = params;

  console.log("Received ID:", hotelId);

  // Ambil data hotel
  const hotel = await fetchHotelById(hotelId);

  if (!hotel) {
    return <div>Hotel not found...</div>;
  }

  return (
    <div>
      <HotelDetail hotel={hotel} />
    </div>
  );
}
