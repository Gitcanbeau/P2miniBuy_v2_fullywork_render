import mongoose from 'mongoose';

// Product entity -> add routes to index.js -> productRoutes
//in app.js add route and component which should show that route
//->productRoutes: provide getProduct method communicating with database, getProduct route and decide which component will be used
//->store.js
//->productSlices: initialize product property, provide getProduct method, export getProduct method
//->productActions: provide getProduct method communicating with backend
//->productScreen, productsScreen
//->jsx html page

const reviewSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		rating: { type: Number, required: true },
		comment: { type: String, required: true },
		title: { type: String, required: true },
		user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Userminibuy' },
	},
	{ timestamps: true }
);

const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		images: {
			type: Array,
			required: true,
			default: [],
		},
		brand: {
			type: String,
			required: true,
		},
		category: {
			type: String,
			required: true,
		},
		reviews: [reviewSchema],
		rating: {
			type: Number,
			required: true,
			default: 5,
		},
		numberOfReviews: {
			type: Number,
			default: 0,
		},
		subtitle: {
			type: String,
		},
		description: {
			type: String,
		},
		price: {
			type: Number,
			required: true,
		},
		stock: {
			type: Number,
			required: true,
		},
		productIsNew: {
			type: Boolean,
			required: true,
		},
		stripeId: {
			type: String,
			default: 0,
		},
	},
	{ timestamps: true }
);

const Product = mongoose.model('Productminibuy', productSchema);

export default Product;
