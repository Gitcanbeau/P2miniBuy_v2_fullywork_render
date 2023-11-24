import mongoose from 'mongoose';

// Order entity -> add routes to index.js -> stripeRoutes, add fcn in userRoutes, orderRoutes
// middleware: authMiddleware
//in app.js add route and component which should show that route
//->orderRoutes: provide getUser method communicating with database, getUser route and decide which component will be used
//->store.js
//->orderSlices: initialize user property, provide getUser method, export getUser method
//->orderActions: provide getUser method communicating with backend
//->checkoutScreens, successScreen, cancelScreen, yourOrdersScreen, AdminConsoleScreen
//->jsx html page

const orderSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Userminibuy',
		},
		username: {
			type: String,
			required: true,
			ref: 'Userminibuy',
		},
		email: {
			type: String,
			required: true,
			ref: 'Userminibuy',
		},
		orderItems: [
			{
				name: { type: String, required: true },
				qty: { type: Number, required: true },
				image: { type: String, required: true },
				price: { type: Number, required: true },
				id: {
					type: mongoose.Schema.Types.ObjectId,
					required: true,
					ref: 'Productminibuy',
				},
			},
		],
		shippingAddress: {
			address: { type: String, required: true },
			city: { type: String, required: true },
			postalCode: { type: String, required: true },
			country: { type: String, required: true },
		},
		shippingPrice: { type: Number, default: 0.0 },
		totalPrice: { type: Number, default: 0.0 },
		subtotal: { type: Number, default: 0.0 },
		isDelivered: { type: Boolean, required: true, default: false },

		deliveredAt: {
			type: Date,
		},
	},
	{ timestamps: true }
);

const Order = mongoose.model('Orderminibuy', orderSchema);
export default Order;
