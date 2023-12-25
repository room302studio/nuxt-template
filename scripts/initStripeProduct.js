/*
This script prompts the user to select a product type and then captures the details for the chosen product type.

Depending on the product type, it creates a Stripe product and a corresponding price object.

If the product creation is successful, it logs the product details, including the product ID, name, description, price, currency, and metadata.
*/
require('dotenv').config();
const inquirer = require('inquirer');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const path = require('path');
const fs = require('fs');

async function createStripeProduct() {
    // Get the slug from the parent directory
    const directoryPath = path.dirname(__dirname);
    const projectSlug = path.basename(directoryPath);

    console.log(`Creating product for project: ${projectSlug}`);

    const productTypeAnswer = await inquirer.prompt([
        {
            type: 'list',
            name: 'productType',
            message: 'What type of product would you like to create?',
            choices: ['Paywall', 'Per-Usage Fee', 'Membership Fee'],
        }
    ]);

    try {
        let product;
        switch (productTypeAnswer.productType) {
            case 'Paywall':
                product = await createPaywallProduct();
                break;
            case 'Per-Usage Fee':
                product = await createPerUsageProduct();
                break;
            case 'Membership Fee':
                product = await createMembershipProduct();
                break;
            default:
                console.log('Invalid product type.');
                return;
        }

        if (product) {
            console.log(`Product created successfully. Product ID: ${product.id}`);
            logProductDetails({product});
        } else {
            console.log('Product creation failed.');
        }
    } catch (error) {
        console.error('Error creating product:', error.message);
        logStripeResponse(error);
    }
}

async function createProductCommonQuestions() {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter the name of the product:',
            validate: input => input.trim() !== '',
        },
        {
            type: 'input',
            name: 'description',
            message: 'Enter a description for the product:',
            validate: input => input.trim() !== '',
        },
        {
            type: 'input',
            name: 'price',
            message: 'Enter the price (in cents):',
            validate: value => !isNaN(value) && parseInt(value) > 0,
            filter: value => parseInt(value),
        },
    ]);
}

async function createPaywallProduct() {
    const answers = await createProductCommonQuestions();

    const product = await stripe.products.create({
        name: answers.name,
        description: answers.description,
        metadata: { projectSlug: path.basename(directoryPath) }
    });

    const price = await stripe.prices.create({
        unit_amount: answers.price,
        currency: 'usd',
        product: product.id,
    });

    return { product, price };
}

async function createPerUsageProduct() {
    const answers = await createProductCommonQuestions();

    const product = await stripe.products.create({
        name: answers.name,
        description: answers.description,
        metadata: { projectSlug: path.basename(directoryPath) }
    });

    const price = await stripe.prices.create({
        unit_amount: answers.price,
        currency: 'usd',
        product: product.id,
        recurring: { interval: 'day' },
    });

    return { product, price };
}

async function createMembershipProduct() {
    const answers = await createProductCommonQuestions();
    const intervalAnswer = await inquirer.prompt([
        {
            type: 'list',
            name: 'interval',
            message: 'Select the billing interval for the membership:',
            choices: ['day', 'week', 'month', 'year'],
        }
    ]);

    const product = await stripe.products.create({
        name: answers.name,
        description: answers.description,
        metadata: { projectSlug: path.basename(directoryPath) }
    });

    const price = await stripe.prices.create({
        unit_amount: answers.price,
        currency: 'usd',
        product: product.id,
        recurring: {
            interval: intervalAnswer.interval,
        },
    });

    return { product, price };
}


function logProductDetails({ product, price }) {
    const details = {
        ProductID: product.id,
        Name: product.name,
        Description: product.description,
        Price: price.unit_amount,
        Currency: price.currency,
        Metadata: product.metadata
    };
    console.log('Product Details:', details);
    fs.appendFileSync('product_log.txt', JSON.stringify(details, null, 2) + '\n');
}

function logStripeResponse(error) {
    fs.appendFileSync('stripe_error_log.txt', JSON.stringify(error, null, 2) + '\n');
}

createStripeProduct().catch(console.error);
