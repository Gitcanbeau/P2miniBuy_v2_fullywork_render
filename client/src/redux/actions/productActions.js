import {
	setProducts,
	setLoading,
	setError,
	setPagination,
	setFavorites,
	setFavoritesToggle,
	setProduct,
	productReviewed,
	resetError,
} from '../slices/product';
import axios from 'axios';

//the action file will get the data
//the slice file set the data to what we saying it should be
//the store provide this data to the components in react
//So this is called separation of concerns.

// we introduced the benefits of redux somewhere else.
// When we talk about okay how do we get the data.
// If in the productsScreen we're calling the data and then the productCard we call the data.
// Again the code gets very messy with all these requests directly to the backend.
// And we can do this here in our Redux store okay so sounds complicated, but it will get easier for you

export const getProducts = (page, favoriteToggle) => async (dispatch) => {
	//these two arrows called querried function
	//with page and favoriteToggle parameters passed into this getProducts() method, getProducts() method can run the code
	//then it has a callback function with dispatch as the function body
	dispatch(setLoading());
	try {
		const { data } = await axios.get(`/api/products/${page}/${10}`);
		//destruct the fetched data to get products and pagination from the fetched data
		const { products, pagination } = data;
		dispatch(setProducts(products));
		dispatch(setPagination(pagination));
	} catch (error) {
		dispatch(
			setError(
				error.response && error.response.data.message
					? error.response.data.message
					: error.message
					? error.message
					: 'An expected error has occured. Please try again later.'
			)
		);
	}
};

export const addToFavorites = (id) => async (dispatch, getState) => {
	//a good example
	//we will click on productCard with _id passing into each productCard
	//so we can 

	//The destructuring assignment syntax is a JavaScript expression 
	//that makes it possible to unpack values from arrays, or properties from objects, into distinct variables.
	//use getState() method to get the state of product, but we dont need all the property of product state
	//therefore, we use destruction to get favorites property and assign to product const
	const {
		product: { favorites },
	} = getState();

	//because favorites is a JSON object, we can use ... spread syntax expands an array into its elements
	//all the old favorite items will still be in the newFavorties array[0], 
	//but we will add this "id" (the one passed into this function) will be array[1]
	const newFavorites = [...favorites, id];
	//localStorage is key-value pair
	//use setItems() method to set key-value pair of localStorage
	localStorage.setItem('favorites', JSON.stringify(newFavorites));
	//call the setFavorites method in the reducers of productSlices to update favorites state
	dispatch(setFavorites(newFavorites));
	//user send change request from html page by calling the addToFavorites method in action file
	//action file will update both localStorage and use setFavorites method in the slice file to update the favorite property of product state
	//the updated product state is managed in store.js
};

export const removeFromFavorites = (id) => async (dispatch, getState) => {
	const {
		product: { favorites },
	} = getState();

	const newFavorites = favorites.filter((favoriteId) => favoriteId !== id);
	localStorage.setItem('favorites', JSON.stringify(newFavorites));
	dispatch(setFavorites(newFavorites));
};

export const toggleFavorites = (toggle) => async (dispatch, getState) => {
	//use getState() method to get the state of product, but we dont need all the property of product state
	//therefore, we use destruction to get favorites and products property and assign to product const
	const {
		product: { favorites, products },
	} = getState();

	if (toggle) {
		//if we have toggle as true, get these favorites products and assign to new const filteredProducts
		const filteredProducts = products.filter((product) => favorites.includes(product._id));
		dispatch(setFavoritesToggle(toggle));
		dispatch(setProducts(filteredProducts));
	} else {
		dispatch(setFavoritesToggle(false));
		dispatch(getProducts(1));
	}
};

export const getProduct = (id) => async (dispatch) => {
	dispatch(setLoading(true));
	try {
		const { data } = await axios.get(`/api/products/${id}`);
		dispatch(setProduct(data));
	} catch (error) {
		dispatch(
			setError(
				error.response && error.response.data.message
					? error.response.data.message
					: error.message
					? error.message
					: 'An expected error has occurred. Please try again later.'
			)
		);
	}
};

export const createProductReview = (productId, userId, comment, rating, title) => async (dispatch, getState) => {
	//these two arrows called querried function
	//with "productId, userId, comment, rating, title" parameters passed into this createProductReview method, createProductReview() method can run the code
	//then it has a callback function with dispatch and getState as the function body
	const {
		user: { userInfo },
	} = getState();
	//use getState() method to get the state of user, but we dont need all the property of user state
	//therefore, we use destruction to get userInfo property and assign to user const
	try {
		const config = { headers: { Authorization: `Bearer ${userInfo.token}`, 'Content-Type': 'application/json' } };

		await axios.post(`/api/products/reviews/${productId}`, { comment, userId, rating, title }, config);
		dispatch(productReviewed(true));
	} catch (error) {
		dispatch(
			setError(
				error.response && error.response.data.message
					? error.response.data.message
					: error.message
					? error.message
					: 'An expected error has occured. Please try again later.'
			)
		);
	}
};

export const resetProductError = () => async (dispatch) => {
	dispatch(resetError());
};
