// types.ts
export interface HotelWithRooms {
  id: string;
  name: string;
  country_code: string;
  address_line: string;
  city: string;
  catalog: {
    city: string;
    brand: string;
    chain: string;
    phone: string;
    category: string;
    star_rating: number;
    review_count: number;
    review_rating: number;
    hero_image_url: {
      lg: string;
    };
  };
  rooms: {
    roomPrice: number;
  }[];
  swimmingPool?: boolean;
  gym?: boolean;
}
