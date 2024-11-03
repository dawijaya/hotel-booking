import axios from "axios";
import { HotelWithRooms } from "@/types/types";

export async function fetchHotelsByIds(
  ids: string[]
): Promise<HotelWithRooms[]> {
  try {
    const response = await axios.get(
      "https://project-technical-test-api.up.railway.app/property/content",
      {
        params: {
          id: ids, // Mengirim `id` sebagai array
          language: "en-us",
        },
        paramsSerializer: (params) => {
          return `id=${params.id.join("&id=")}`; // Mengubah array `id` menjadi format yang dapat diterima API
        },
      }
    );

    return ids.map((id) => {
      const data: HotelWithRooms = response.data[id];
      return {
        id: data.id,
        name: data.name,
        country_code: data.country_code || "",
        address_line: data.address_line || "",
        city: data.catalog.city || "",
        catalog: {
          city: data.catalog?.city || "", // Validasi bahwa `catalog` dan `city` ada
          brand: data.catalog.brand || "Unknown Brand",
          chain: data.catalog.chain || "Unknown Brand",
          phone: data.catalog.phone || "", // Default ke string kosong jika tidak ada
          category: data.catalog.category || "", // Default ke string kosong jika tidak ada
          review_count: data.catalog.review_count,
          review_rating: data.catalog.review_rating,
          star_rating: data.catalog.star_rating || 0,
          hero_image_url: {
            lg: data.catalog.hero_image_url?.lg || "",
          },
        },
        rooms: data.rooms || [{ roomPrice: 0 }],
      };
    });
  } catch (error) {
    console.error("Error fetching hotels:", error);
    throw error;
  }
}
