import { createSlice } from '@reduxjs/toolkit';
//remember this '@reduxjs/toolkit' package
//each slice contains the initial state and how the state gets changed

export const initialState = {
	loading: false,
	error: null,
	products: [],
	product: null,
	pagination: {},
	favoritesToggled: false,
	reviewed: false,
	favorites: JSON.parse(localStorage.getItem('favorites')) ?? [],
	//?? means if the left of ?? is false, then use the right
	//favorites is an array, localStorage saves key-value pair, the value is a JSONstring, 
	//therefore use JSON.parse to construct the JavaScript value or object described by the string.
	reviewRemoval: false,
	productUpdate: false,
};


export const productsSlice = createSlice({
	name: 'products',
	initialState,
	reducers: {
		setLoading: (state) => {
			state.loading = true;
		},
		setError: (state, { payload }) => {
			state.loading = false;
			state.error = payload;
		},
		setProducts: (state, { payload }) => {
			//use ; rather than ,
			//because this is a lambda function
			//you pass two parameters into this anonymous function, state and payload object
			//return the function body, set state.loading as false, assign payload obj to state.products
			//the state here is the passed in parameter, you also return this state with updated value and send back
			state.loading = false;
			state.error = null;
			state.products = payload;
			state.reviewRemoval = false;
		},
		setProduct: (state, { payload }) => {
			state.product = payload;
			state.loading = false;
			state.error = null;
			state.reviewed = false;
		},
		setPagination: (state, { payload }) => {
			state.loading = false;
			state.error = null;
			state.pagination = payload;
		},
		setFavorites: (state, { payload }) => {
			state.favorites = payload;
		},
		setFavoritesToggle: (state, { payload }) => {
			state.favoritesToggled = payload;
		},
		productReviewed: (state, { payload }) => {
			state.loading = false;
			state.error = null;
			state.reviewed = payload;
		},
		//below contains the property operated by admin
		resetError: (state) => {
			state.error = null;
			state.reviewed = false;
			state.productUpdate = false;
			state.reviewRemoval = false;
		},
		setProductUpdateFlag: (state) => {
			state.productUpdate = true;
			state.loading = false;
		},
		setReviewRemovalFlag: (state) => {
			state.error = null;
			state.reviewRemoval = true;
			state.loading = false;
		},
	},
});

//in oder to let other file use these methods in the reducers, export them
//you can export the productsSlice.reducer, but you need to use the dot to call the method. reducer.setLoading(), which is kind of tedious
//or you can export each of them, so that you only need to import several methods import {setLoading, setError} as needed
export const {
	setLoading,
	setError,
	setProducts,
	setProduct,
	setPagination,
	setFavoritesToggle,
	setFavorites,
	productReviewed,
	setProductUpdateFlag,
	resetError,
	setReviewRemovalFlag,
} = productsSlice.actions;

export default productsSlice.reducer;

export const productSelector = (state) => state.products;
// we use this productSelector in the frontend in other components to request the state
// Redux is built or created or developed is called functional programming.
// this is a part of functional programming. And people have a problem to understand functional programming.
// Furthermore, or especially in this case, it's under the hood because the Redux JS toolkit is using something in the node modules we probably will never understand unless you are a Redux developer.
// So don't be afraid if you don't understand that. We know how to use it and we know how to set it up and this is all we need.
