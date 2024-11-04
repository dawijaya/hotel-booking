import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  context: any // Menggunakan `any` agar lebih fleksibel dengan Next.js
) {
  try {
    const body = await req.json();
    const { userId } = await auth();
    const { hotelId } = context.params;

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
    console.log("Error at /api/hotel/[hotelId] PATCH", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  context: any // Menggunakan `any` agar lebih fleksibel dengan Next.js
) {
  try {
    const { userId } = await auth();
    const { hotelId } = context.params;

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
    console.log("Error at /api/hotel/[hotelId] DELETE", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
