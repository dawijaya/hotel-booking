import axios from "axios";
import { HotelWithRooms } from "@/types/types";

// Fungsi untuk mengambil data hotel berdasarkan ID tunggal
export async function fetchHotelById(
  id: string
): Promise<HotelWithRooms | null> {
  try {
    const url = `https://project-technical-test-api.up.railway.app/property/content?id=${id}&language=en-us`;
    console.log("Fetching from URL:", url); // Logging URL yang diambil
    const response = await axios.get(url);

    // Memeriksa apakah data diterima sesuai dengan ID
    if (!response.data || !response.data[id]) {
      console.error(`Data for ID ${id} not found`);
      return null;
    }

    const data = response.data[id];

    return {
      id: data.id,
      name: data.name,
      country_code: data.country_code || "",
      address_line: data.address_line || "",
      city: data.catalog.city || "",
      catalog: {
        city: data.catalog.city || "",
        brand: data.catalog.brand || "Unknown Brand",
        chain: data.catalog.chain || "Unknown Brand",
        phone: data.catalog.phone || "",
        category: data.catalog.category || "",
        star_rating: data.catalog.star_rating || 0,
        review_count: data.catalog.review_count,
        review_rating: data.catalog.review_rating,
        hero_image_url: {
          lg: data.catalog.hero_image_url?.lg || "",
        },
      },
      rooms: data.rooms || [{ roomPrice: 0 }],
      swimmingPool: data.swimmingPool || false,
      gym: data.gym || false,
    };
  } catch (error) {
    console.error("Error fetching hotel by ID:", error);
    return null;
  }
}
