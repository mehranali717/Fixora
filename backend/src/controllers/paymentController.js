import Booking from "../models/Booking.js";
import stripe from "../config/stripe.js";
import { env } from "../config/env.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createCheckoutSession = asyncHandler(async (req, res) => {
  if (!stripe) throw new AppError("Stripe is not configured", 503);
  const { bookingId } = req.body;
  const booking = await Booking.findById(bookingId).populate("service");

  if (!booking) throw new AppError("Booking not found", 404);
  if (booking.user.toString() !== req.user._id.toString()) throw new AppError("Forbidden", 403);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: req.user.email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "aed",
          unit_amount: Math.round(booking.totalAmount * 100),
          product_data: {
            name: booking.service.title,
            description: booking.service.description.slice(0, 120),
          },
        },
      },
    ],
    success_url: `${env.CLIENT_ORIGIN}/dashboard/bookings?payment=success`,
    cancel_url: `${env.CLIENT_ORIGIN}/dashboard/bookings?payment=cancelled`,
    metadata: {
      bookingId: booking._id.toString(),
      userId: req.user._id.toString(),
    },
  });

  booking.stripeSessionId = session.id;
  await booking.save();

  res.json({ success: true, data: { sessionId: session.id, url: session.url } });
});

export const stripeWebhook = asyncHandler(async (req, res) => {
  if (!stripe || !env.STRIPE_WEBHOOK_SECRET) throw new AppError("Stripe webhook unavailable", 503);

  const signature = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch {
    throw new AppError("Invalid Stripe signature", 400);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const bookingId = session?.metadata?.bookingId;
    if (bookingId) {
      await Booking.findByIdAndUpdate(bookingId, {
        paymentStatus: "paid",
        status: "approved",
        stripePaymentIntentId: session.payment_intent || "",
      });
    }
  }

  res.json({ received: true });
});
