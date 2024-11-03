// app/page.tsx
import { fetchHotelsByIds } from "@/action/fetchHotelsByIds";
import HotelList from "@/components/hotel/HotelList";

export default async function Home() {
  // Array of IDs untuk diambil datanya
  const hotelIds = [
    "9000898089",
    "9000898080",
    "9000898092",
    "9000898074",
    "9000898098",
    "9000898071",
  ]; // Masukkan ID yang diinginkan

  const hotels = await fetchHotelsByIds(hotelIds);

  if (!hotels || hotels.length === 0) return <div>No hotels found....</div>;

  return (
    <div>
      <HotelList hotels={hotels} />
    </div>
  );
}
