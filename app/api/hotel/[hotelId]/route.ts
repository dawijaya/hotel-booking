import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Fungsi PATCH
export async function PATCH(
  req: Request,
  { params }: { params: Record<string, string> } // Menggunakan Record untuk generalisasi tipe
) {
  try {
    const body = await req.json();
    const { userId } = await auth();

    const hotelId = params.hotelId;

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

// Fungsi DELETE
export async function DELETE(
  req: Request,
  { params }: { params: Record<string, string> } // Menggunakan Record untuk generalisasi tipe
) {
  try {
    const { userId } = await auth();
    const hotelId = params.hotelId;

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
