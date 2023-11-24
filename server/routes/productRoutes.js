import express from 'express';
import Productminibuy from '../models/Product.js';
import { protectRoute, admin } from '../middleware/authMiddleware.js';
import asyncHandler from 'express-async-handler';
import Userminibuy from '../models/User.js';
//in app.js add route and component which should show that route
//->productRoutes: provide getProduct method communicating with database, getProduct route and decide which component will be used
//->store.js
//->productSlices: initialize product property, provide setProduct method, export setProduct method
//->productActions: provide getProduct method communicating with backend
//->productScreen, productsScreen
//->jsx html page

const productRoutes = express.Router(); 
//express provide Router() method, hence you can chain .route('url').get/put/post/delete(method) at the bottom

const getProducts = async (req, res) => {
	const page = parseInt(req.params.page); // 1, 2 or 3 
	const perPage = parseInt(req.params.perPage); // 10
	//get the parameter from the request url
	//you define how the request url from frontend look like in the productAction
	// 'api/products/${page}/${10}
	//since this is defined, you can extract page and perPage parameters from req.params
	
	const products = await Productminibuy.find({});
	//Product is the mongoose model, it provides find method

	if (page && perPage) {
		const totalPages = Math.ceil(products.length / perPage);
		const startIndex = (page - 1) * perPage;
		const endIndex = startIndex + perPage;
		//array.slice() method can cut the array from startIdx to endIdx, included
		const paginatedProducts = products.slice(startIndex, endIndex);
		//return JSON obj the products an pagination are properties in product state
		//method in productAction can get these updates by sending the url and parsing these returned results
		res.json({ 
			products: paginatedProducts, 
			pagination: { currentPage: page, totalPages } 
		});
	} else {
		//if we dont have pagination, simply use res.json() to return JSON obj to frontend
		res.json({ products, pagination: {} });
	}
};

const getProduct = async (req, res) => {
	const product = await Productminibuy.findById(req.params.id);

	if (product) {
		res.json(product);
	} else {
		res.status(404).send('Product not found.');
		throw new Error('Product not found');
	}
};

//when we add new feature
//backend: add parent routes in index.js, add children routes in productRoutes
//frontend: update slice with new property and reducers, update action with new methods, update all related screen
const createProductReview = asyncHandler(async (req, res) => {
	const { rating, comment, userId, title } = req.body;

	const product = await Productminibuy.findById(req.params.id);
	const user = await Userminibuy.findById(userId);

	if (product) {
		const alreadyReviewed = product.reviews.find((review) => review.user.toString() === user._id.toString());
		//map in the reviews to check each review, if the review.user (which will return id) equals to current user._id

		if (alreadyReviewed) {
			res.status(400).send('Product already reviewed.');
			throw new Error('Product already reviewed.');
		}

		const review = {
			name: user.name,
			rating: Number(rating),
			comment,
			title,
			user: user._id,
		};

		product.reviews.push(review);

		product.numberOfReviews = product.reviews.length;
		product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
		//The reduce() method of Array instances executes a user-supplied "reducer" callback function on each element of the array, 
		//in order, passing in the return value from the calculation on the preceding element. 
		//The final result of running the reducer across all elements of the array is a single value.
		// const array1 = [1, 2, 3, 4];
		// 0 + 1 + 2 + 3 + 4
		// const initialValue = 0;
		// const sumWithInitial = array1.reduce(
		//   (accumulator, currentValue) => accumulator + currentValue,
		//   initialValue,
		// );

		await product.save();
		res.status(201).json({ message: 'Review has been saved.' });
	} else {
		res.status(404).send('Product not found.');
		throw new Error('Product not found.');
	}
});

const createNewProduct = asyncHandler(async (req, res) => {
	const { brand, name, category, stock, price, images, productIsNew, description, subtitle, stripeId } = req.body;
	//destructing assignment from the body of the request sent from frontend

	const newProduct = await Productminibuy.create({
		brand,
		name,
		category,
		subtitle,
		description,
		stock,
		price,
		images,
		productIsNew,
		stripeId,
	});

	await newProduct.save();

	const products = await Productminibuy.find({});

	if (newProduct) {
		res.json(products);
	} else {
		res.status(404).send('Product could not be uploaded.');
		throw new Error('Product could not be uploaded.');
	}
});

const updateProduct = asyncHandler(async (req, res) => {
	const { brand, name, category, stock, price, id, productIsNew, description, subtitle, stripeId, imageOne, imageTwo } =
		req.body;
	//destructing assignment from the body of the request sent from frontend
	// console.log(stripeId);

	const product = await Productminibuy.findById(id);

	if (product) {
		product.name = name;
		product.subtitle = subtitle;
		product.price = price;
		product.description = description;
		product.brand = brand;
		product.category = category;
		product.stock = stock;
		product.productIsNew = productIsNew;
		product.stripeId = stripeId;
		product.images = [imageOne, imageTwo];

		await product.save();

		const products = await Productminibuy.find({});

		res.json(products);
	} else {
		res.status(404).send('Product not found.');
		throw new Error('Product not found.');
	}
});

const removeProductReview = asyncHandler(async (req, res) => {
	const product = await Productminibuy.findById(req.params.productId);

	const updatedReviews = product.reviews.filter((review) => review._id.valueOf() !== req.params.reviewId);

	if (product) {
		product.reviews = updatedReviews;

		product.numberOfReviews = product.reviews.length;

		if (product.numberOfReviews > 0) {
			product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
		} else {
			product.rating = 5;
		}

		await product.save();
		const products = await Productminibuy.find({});
		res.json({ products, pagination: {} });
	} else {
		res.status(404).send('Product not found.');
		throw new Error('Product not found.');
	}
});

const deleteProduct = asyncHandler(async (req, res) => {
	const product = await Productminibuy.findByIdAndDelete(req.params.id);

	if (product) {
		res.json(product);
	} else {
		res.status(404).send('Product not found.');
		throw new Error('Product not found.');
	}
});

productRoutes.route('/:page/:perPage').get(getProducts);
productRoutes.route('/').get(getProducts);
productRoutes.route('/:id').get(getProduct);
productRoutes.route('/reviews/:id').post(protectRoute, createProductReview);
//indeed, the createProductReview() method in productAction file will send port request and have the toke in the sent request
//as long as we have token, we are able to use protectRoute
productRoutes.route('/:id').delete(protectRoute, admin, deleteProduct);
productRoutes.route('/').put(protectRoute, admin, updateProduct);
productRoutes.route('/:productId/:reviewId').put(protectRoute, admin, removeProductReview);
productRoutes.route('/').post(protectRoute, admin, createNewProduct);

export default productRoutes;
