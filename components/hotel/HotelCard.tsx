// components/hotel/HotelCard.tsx

"use client";

import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import AmenityItem from "../AmenityItem";
import { Dumbbell, MapPin } from "lucide-react";
import useLocation from "@/hooks/useLocation";
import { FaSwimmer } from "react-icons/fa";

interface HotelWithRooms {
  id: string;
  name: string;
  country_code: string;
  address_line: string;
  city?: string;
  catalog: {
    phone: string;
    category: string;
    star_rating: number;
    hero_image_url: {
      lg: string;
    };
  };
  swimmingPool?: boolean;
  gym?: boolean;
  rooms: {
    roomPrice: number;
  }[];
}

const HotelCard = ({ hotel }: { hotel: HotelWithRooms }) => {
  const pathname = usePathname();
  const isMyHotels = pathname.includes("my-hotels");
  const router = useRouter();

  const { getCountryByCode } = useLocation();
  const country = getCountryByCode(hotel.country_code);

  return (
    <div
      onClick={() => {
        console.log("Navigating to hotel with ID:", hotel.id);
        if (!isMyHotels) {
          router.push(`/hotel-details/${hotel.id}`);
        }
      }}
      className={cn(
        "col-span-1 cursor-pointer transition hover:scale-105",
        isMyHotels && "cursor-default"
      )}>
      <div className="flex gap-2 bg-background/50 border border-primary/10 rounded-lg">
        <div className="flex-1 aspect-square overflow-hidden relative w-full h-[210px] rounded-s-lg">
          <Image
            fill
            src={hotel.catalog.hero_image_url.lg}
            alt={hotel.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex-1 flex flex-col justify-between h-[210px] gap-1 p-1 py-2 text-sm">
          <h3 className="font-semibold text-xl">{hotel.name}</h3>
          <div className="text-primary/90">
            {hotel.address_line}, {hotel?.city}
          </div>
          <div className="text-primary/90">
            <AmenityItem>
              <MapPin className="w-4 h-4" /> {country?.name}, {hotel?.city}
            </AmenityItem>
            {hotel.swimmingPool && (
              <AmenityItem>
                <FaSwimmer size={18} /> Pool
              </AmenityItem>
            )}
            {hotel.gym && (
              <AmenityItem>
                <Dumbbell className="w-4 h-4" />
                Gym
              </AmenityItem>
            )}
          </div>
          <div className="text-primary/90">
            <div>Phone: {hotel.catalog.phone}</div>
            <div>Category: {hotel.catalog.category}</div>
            <div>Star Rating: {hotel.catalog.star_rating} ⭐</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
