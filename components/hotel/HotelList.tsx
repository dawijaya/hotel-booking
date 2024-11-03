"use client";

import { useState, useEffect } from "react";
import HotelCard from "./HotelCard";
import SearchInput from "../SearchInput";
import { HotelWithRooms } from "@/types/types";

interface HotelListProps {
  hotels: HotelWithRooms[];
}

const HotelList = ({ hotels }: HotelListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredHotels, setFilteredHotels] =
    useState<HotelWithRooms[]>(hotels);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredHotels(hotels);
      return;
    }

    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = hotels.filter(
      (hotel) =>
        hotel.name.toLowerCase().includes(lowercasedQuery) ||
        hotel.catalog.category.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredHotels(filtered);
  }, [searchQuery, hotels]);

  return (
    <div>
      <SearchInput onSearch={setSearchQuery} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {filteredHotels.length > 0 ? (
          filteredHotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))
        ) : (
          <div>No hotels found...</div>
        )}
      </div>
    </div>
  );
};

export default HotelList;
