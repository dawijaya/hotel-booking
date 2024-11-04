import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Fungsi untuk PATCH request
export async function PATCH(
  req: Request,
  context: unknown // Menggunakan tipe unknown
) {
  try {
    const body = await req.json();
    const { userId } = await auth();

    // Melakukan type assertion agar `context` dianggap sebagai objek dengan `params`
    const { params } = context as { params: { hotelId: string } };
    const hotelId = params?.hotelId;

    if (!hotelId) {
      return new NextResponse("Hotel Id is required", { status: 400 });
    }

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const hotel = await prismadb.hotel.update({
      where: { id: hotelId },
      data: { ...body },
    });

    return NextResponse.json(hotel);
  } catch (error) {
    console.error("Error at /api/hotel/[hotelId] PATCH", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Fungsi untuk DELETE request
export async function DELETE(
  req: Request,
  context: unknown // Menggunakan tipe unknown
) {
  try {
    const { userId } = await auth();

    // Melakukan type assertion agar `context` dianggap sebagai objek dengan `params`
    const { params } = context as { params: { hotelId: string } };
    const hotelId = params?.hotelId;

    if (!hotelId) {
      return new NextResponse("Hotel Id is required", { status: 400 });
    }

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const hotel = await prismadb.hotel.delete({
      where: { id: hotelId },
    });

    return NextResponse.json(hotel);
  } catch (error) {
    console.error("Error at /api/hotel/[hotelId] DELETE", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
