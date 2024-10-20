import Stripe from 'stripe';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Purchase } from '@/models/Purchase';
import { stripe } from '@/lib/stripe';
export async function POST(req: Request) {
  await connectDB(); // Ensure the database connection is established
  const body = await req.text();
  const signature = headers().get('stripe-signature') as string;
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (error: any) {
    return new NextResponse('Webhook Error:' + error.message, { status: 400 });
  }
  const session = event.data.object as Stripe.Checkout.Session;
  const userId = session?.metadata?.userId;
  const courseId = session?.metadata?.courseId;
  if (event.type === 'checkout.session.completed') {
    if (!userId || !courseId) {
      return new NextResponse('Webhook Error: Missing metadata', {
        status: 400,
      });
    }
    // Create a new purchase record in MongoDB
    await Purchase.create({
      userId,
      courseId
    });
  } else {
    return new NextResponse(
      `Webhook Error: Unhandled event type ${event.type}`,
      {
        status: 200,
      }
    );
  }
  return new NextResponse(null, { status: 200 });
}