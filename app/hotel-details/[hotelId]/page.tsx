import { fetchHotelById } from "@/action/fetchHotelsById";
import HotelDetail from "@/components/hotel/HotelDetail";

interface HotelDetailsPageProps {
  params: {
    hotelId: string;
  };
}

export default async function HotelDetailsPage({
  params,
}: HotelDetailsPageProps) {
  const { hotelId } = params;

  // Logging untuk memeriksa ID yang diterima
  console.log("Received ID:", hotelId);

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
