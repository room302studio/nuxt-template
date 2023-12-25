import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default defineEventHandler(async (event) => {
    try {
        const products = await stripe.products.list({ active: true });
        const prices = await stripe.prices.list({ active: true });

        // Optionally, format this data as needed for your front end
        return { products, prices };
    } catch (error) {
        return createError({ statusCode: 500, statusMessage: 'Internal Server Error', error: error.message });
    }
});