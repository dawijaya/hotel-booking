import prismadb from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-09-30.acacia",
});

export async function POST(req: Request) {
  try {
    const user = await currentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { booking, payment_intent_id } = body;

    if (!booking || typeof booking.totalPrice !== "number") {
      return new NextResponse("Invalid booking data", { status: 400 });
    }

    const bookingData = {
      ...booking,
      userName: user.firstName,
      userEmail: user.emailAddresses[0]?.emailAddress || "",
      userId: user.id,
      currency: "usd",
      paymentIntentId: payment_intent_id,
    };

    let foundBooking;

    if (payment_intent_id) {
      foundBooking = await prismadb.booking.findFirst({
        where: { paymentIntentId: payment_intent_id, userId: user.id },
      });
    }

    if (foundBooking && payment_intent_id) {
      await prismadb.booking.update({
        where: { id: foundBooking.id },
        data: bookingData,
      });

      return NextResponse.json({ message: "Booking updated" });
    } else {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: booking.totalPrice * 100,
        currency: bookingData.currency,
        automatic_payment_methods: { enabled: true },
      });

      bookingData.paymentIntentId = paymentIntent.id;

      await prismadb.booking.create({
        data: bookingData,
      });

      return NextResponse.json({ paymentIntent });
    }
  } catch (error: unknown) {
    console.error("Error:", error); // Log error untuk debugging

    // Periksa apakah error adalah objek dan memiliki properti 'clerkError'
    if (
      typeof error === "object" &&
      error !== null &&
      "clerkError" in error &&
      Array.isArray((error as any).errors)
    ) {
      const clerkError = error as {
        clerkError: boolean;
        errors: { message: string }[];
      };
      return new NextResponse(
        "Error with Clerk API: " + clerkError.errors[0]?.message,
        { status: 500 }
      );
    }

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
