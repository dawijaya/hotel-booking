import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// PATCH request handler
export async function PATCH(
  req: Request,
  context: unknown // Menggunakan tipe unknown
) {
  try {
    const body = await req.json();
    const { userId } = await auth();

    // Melakukan type assertion untuk `context` agar dapat menggunakan `params`
    const { params } = context as { params: { roomId: string } };
    const roomId = params?.roomId;

    if (!roomId) {
      return new NextResponse("Room Id is required", { status: 400 });
    }

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const room = await prismadb.room.update({
      where: { id: roomId },
      data: { ...body },
    });

    return NextResponse.json(room);
  } catch (error) {
    console.error("Error at /api/room/[roomId] PATCH", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// DELETE request handler
export async function DELETE(
  req: Request,
  context: unknown // Menggunakan tipe unknown
) {
  try {
    const { userId } = await auth();

    // Melakukan type assertion untuk `context` agar dapat menggunakan `params`
    const { params } = context as { params: { roomId: string } };
    const roomId = params?.roomId;

    if (!roomId) {
      return new NextResponse("Room Id is required", { status: 400 });
    }

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const room = await prismadb.room.delete({
      where: { id: roomId },
    });

    return NextResponse.json(room);
  } catch (error) {
    console.error("Error at /api/room/[roomId] DELETE", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
