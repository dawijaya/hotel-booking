"use client";
import Image from "next/image";
import { useState } from "react";
import { HotelWithRooms } from "@/types/types";
import { FaSwimmer } from "react-icons/fa";
import { Dumbbell } from "lucide-react";
import AmenityItem from "../AmenityItem";
import useLocation from "@/hooks/useLocation";
import { useRouter } from "next/navigation";
import axios from "axios"; // Tambahkan ini di bagian import

const HotelDetail = ({ hotel }: { hotel: HotelWithRooms }) => {
  const { getCountryByCode } = useLocation();
  const country = getCountryByCode(hotel.country_code);
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [guestPerRoom, setGuestPerRoom] = useState(1);
  const [numberOfRoom, setNumberOfRoom] = useState(1);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Mendapatkan tanggal hari ini dalam format YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0];

  const handleBooking = async () => {
    try {
      const response = await axios.get(
        `https://project-technical-test-api.up.railway.app/stay/availability/${hotel.id}`,
        {
          params: {
            checkin,
            checkout,
            guest_per_room: guestPerRoom,
            number_of_room: numberOfRoom,
          },
        }
      );

      if (response.status === 200) {
        const data = response.data;
        console.log("API Response Data:", data);

        if (data.offer_list && data.offer_list.length > 0) {
          const query = new URLSearchParams(data.offer_list[0]).toString();
          router.push(`/BookingDetail?${query}`);
        } else {
          alert("No offers available.");
        }
      } else {
        alert("Failed to retrieve booking data.");
      }
    } catch (error) {
      console.error("Booking Error:", error);
      alert("An error occurred, please try again.");
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">
        {hotel.name}
      </h1>
      <div className="text-primary/90 text-center sm:text-left mt-2">
        <p>
          {hotel.address_line}, {hotel.city}, {country?.name}
        </p>
      </div>

      <div
        className="relative h-[200px] sm:h-[300px] w-full mt-4 cursor-pointer"
        onClick={openModal}>
        {hotel.catalog.hero_image_url.lg ? (
          <Image
            src={hotel.catalog.hero_image_url.lg}
            alt={hotel.name}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-200 rounded-lg">
            <p>No Image Available</p>
          </div>
        )}
      </div>

      <div className="mt-4 grid gap-2 text-primary/90 text-center sm:text-left sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <p>
          <strong>Phone:</strong> {hotel.catalog.phone}
        </p>
        <p>
          <strong>Category:</strong> {hotel.catalog.category}
        </p>
        <p>
          <strong>Brands:</strong> {hotel.catalog.brand}
        </p>
        <p>
          <strong>Chain:</strong> {hotel.catalog.chain}
        </p>
        <p>
          <strong>Jumlah Review:</strong> {hotel.catalog.review_count}
        </p>
        <p>
          <strong>Penilaian Rating:</strong> {hotel.catalog.review_rating}
        </p>
        <p>
          <strong>Star Rating:</strong> {hotel.catalog.star_rating} ⭐
        </p>
      </div>

      <div className="mt-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-center sm:text-left">
          Fasilitas
        </h2>
        <div className="flex flex-wrap gap-4 justify-center sm:justify-start mt-2">
          <AmenityItem>
            <FaSwimmer size={20} /> Swimming Pool
          </AmenityItem>

          <AmenityItem>
            <Dumbbell size={20} /> Gym
          </AmenityItem>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-center sm:text-left">
          Booking Details
        </h2>
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-4 mt-4">
          <input
            type="date"
            value={checkin}
            onChange={(e) => setCheckin(e.target.value)}
            placeholder="Check-in"
            className="border p-2 rounded"
            min={today} // Pastikan check-in tidak bisa memilih tanggal yang sudah lewat
          />
          <input
            type="date"
            value={checkout}
            onChange={(e) => setCheckout(e.target.value)}
            placeholder="Check-out"
            className="border p-2 rounded"
            min={checkin || today} // Pastikan check-out tidak bisa sebelum check-in atau tanggal saat ini
          />
          <input
            type="number"
            value={guestPerRoom}
            onChange={(e) => setGuestPerRoom(Number(e.target.value))}
            placeholder="Guests per Room"
            min={1}
            className="border p-2 rounded"
          />
          <input
            type="number"
            value={numberOfRoom}
            onChange={(e) => setNumberOfRoom(Number(e.target.value))}
            placeholder="Number of Rooms"
            min={1}
            className="border p-2 rounded"
          />
        </div>

        <button
          onClick={handleBooking}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Pesan
        </button>
      </div>

      {/* Modal untuk menampilkan gambar ukuran penuh */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative w-full max-w-3xl">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-1">
              ✕
            </button>
            <Image
              src={hotel.catalog.hero_image_url.lg}
              alt={hotel.name}
              width={1200}
              height={800}
              className="rounded-lg"
              objectFit="contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelDetail;
