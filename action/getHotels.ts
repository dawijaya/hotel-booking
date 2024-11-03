import prismadb from "@/lib/prismadb";

export const getHotels = async (
  searchParams: {
    title?: string;
    country?: string;
    state?: string;
    city?: string;
  } = {}
) => {
  try {
    const { title = "", country = "", state = "", city = "" } = searchParams;

    const hotels = await prismadb.hotel.findMany({
      where: {
        title: title ? { contains: title } : undefined,
        country: country || undefined,
        state: state || undefined,
        city: city || undefined,
      },
      include: { rooms: true },
    });

    console.log("Data hotels:", hotels); // Pindahkan console.log ke sini

    return hotels;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message || "Failed to fetch hotels");
  }
};
