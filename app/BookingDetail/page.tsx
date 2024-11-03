"use client";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

interface RoomImage {
  size_sm: string;
  caption: string;
}

const BookingDetail = () => {
  const searchParams = useSearchParams();

  // Ambil nilai dari query string
  const bookingData = {
    property_id: searchParams.get("property_id"),
    room_name: searchParams.get("room_name"),
    price_total: searchParams.get("price_total"),
    rate_nightly: searchParams.get("rate_nightly"),
    room_available: searchParams.get("room_available"),
    room_bed_groups: searchParams.get("room_bed_groups"),
    room_size_sqm: searchParams.get("room_size_sqm"),
    room_views: searchParams.get("room_views"),
    cancel_policy_description: searchParams.get("cancel_policy_description"),
    room_images: JSON.parse(
      searchParams.get("room_images") || "[]"
    ) as RoomImage[],
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Booking Details</h1>

      <div className="mb-4">
        <p>
          <strong>Property ID:</strong> {bookingData.property_id}
        </p>
        <p>
          <strong>Room Name:</strong> {bookingData.room_name}
        </p>
        <p>
          <strong>Price Total:</strong> {bookingData.price_total}
        </p>
        <p>
          <strong>Rate Nightly:</strong> {bookingData.rate_nightly}
        </p>
        <p>
          <strong>Available Rooms:</strong> {bookingData.room_available}
        </p>
        <p>
          <strong>Room Bed Groups:</strong> {bookingData.room_bed_groups}
        </p>
        <p>
          <strong>Room Size (sqm):</strong> {bookingData.room_size_sqm}
        </p>
        <p>
          <strong>Room Views:</strong> {bookingData.room_views}
        </p>
        <p>
          <strong>Cancel Policy:</strong>{" "}
          {bookingData.cancel_policy_description}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {bookingData.room_images &&
          bookingData.room_images.map((image: RoomImage, index: number) => (
            <Image
              key={index}
              src={image.size_sm}
              alt={image.caption}
              width={200}
              height={200}
              className="rounded-lg"
            />
          ))}
      </div>
    </div>
  );
};

export default BookingDetail;
