import dotenv from 'dotenv';
dotenv.config();
//if we want to use the parameter in .env, we need to use dotenv.config()

import express from 'express';
import Stripe from 'stripe';
import Orderminibuy from '../models/Order.js';
import Productminibuy from '../models/Product.js';
import { protectRoute } from '../middleware/authMiddleware.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const stripeRoute = express.Router();
//express provide Router() method, hence you can chain .route('url').get/put/post/delete(method) at the bottom

const stripePayment = async (req, res) => {
	const data = req.body;
	// console.log(req.body);

	let lineItems = [];

	if (data.shipping == 14.99) {
		//data.shipping type is string "14.99"
		//but 14.99 type is number
		//if we use ===, it will always return false
		//The == operator performs a loose equality comparison that performs type coercion if necessary to make the comparison possible. 
		//The === operator, on the other hand, performs a strict equality comparison that does not perform type coercion and requires the operands to have the same type (as well as the same value).
		lineItems.push({
			price: process.env.EXPRESS_SHIPPING_ID,
			//although the key is price, the value should be the ID
			//So interestingly stripe has defined their ID with the word price.
			quantity: 1,
		});
	} else {
		lineItems.push({
			price: process.env.STANDARD_SHIPPING_ID,
			quantity: 1,
		});
	}

	data.cartItems.forEach((item) => {
		lineItems.push({
			price: item.stripeId,
			//the stripe server will go ahead with the stripeID
			//Recognize the stripe secret key so it will know okay this is the user Candice.
			quantity: item.qty,
		});
	});

	const session = await stripe.checkout.sessions.create({
		line_items: lineItems,
		mode: 'payment',
		success_url: 'http://localhost:3000/success',
		cancel_url: 'http://localhost:3000/cancel',
	});

	const order = new Orderminibuy({
		orderItems: data.cartItems,
		user: data.userInfo._id,
		username: data.userInfo.name,
		email: data.userInfo.email,
		shippingAddress: data.shippingAddress,
		shippingPrice: data.shipping,
		subtotal: data.subtotal,
		totalPrice: Number(data.subtotal + data.shipping).toFixed(2),
	});

	const newOrder = await order.save();

	data.cartItems.forEach(async (cartItem) => {
		let product = await Productminibuy.findById(cartItem.id);
		product.stock = product.stock - cartItem.qty;
		product.save();
	});

	res.send(
		JSON.stringify({
			orderId: newOrder._id.toString(),
			url: session.url,
		})
	);
};

stripeRoute.route('/').post(protectRoute, stripePayment);

export default stripeRoute;
