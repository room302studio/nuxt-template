import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST endpoint to create a Stripe Checkout session
export default defineEventHandler(async (event) => {
    try {
        const body = await useBody(event);
        const { productName, price } = body;

        // Create a Stripe Checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: productName,
                    },
                    unit_amount: price,
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${process.env.BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.BASE_URL}/cancel`,
        });

        // Return the session ID to the client
        return { sessionId: session.id };
    } catch (error) {
        // Handle any errors that occur during the creation of the session
        return createError({ statusCode: 500, statusMessage: 'Internal Server Error', error: error.message });
    }
});
