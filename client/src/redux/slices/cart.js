import { createSlice } from '@reduxjs/toolkit';
//remember this helpful toolkit

const calculateSubtotal = (cartState) => {
	let result = 0;
	cartState.map((item) => (result += item.qty * item.price));
	//since you provide this method ahead of editing cartAction file
	//since you use qty and price as property name, KEEP IN MIND to pass in qty and price in the method provided in action file
	return result;
};

export const initialState = {
	loading: false,
	error: null,
	//take advantages of local storage, so that we wont lose the info even after refreshing the page
	//although we update the state in frontend by localStorage, we still update the database in the backend after we update localStorage, which is shown in the action file
	cartItems: JSON.parse(localStorage.getItem('cartItems')) ?? [],
	shipping: JSON.parse(localStorage.getItem('shipping')) ?? Number(4.99),
	//?? means if left is not null use left, otherwise use default value on the right
	//locaoStorage stores key-value pair, use getItem(key) to get the value
	//the value is a string, so use JSON.parse to make the text/string a JS array or JSON object
	subtotal: localStorage.getItem('cartItems') ? calculateSubtotal(JSON.parse(localStorage.getItem('cartItems'))) : 0,
};

//take advantage of localStorage, we get values from localStorage and update the localStorage after any change
const updateLocalStorage = (cart) => {
	//JSON.stringify to convert json obj to string
	//setItems to set key-value pair in the localStorage
	localStorage.setItem('cartItems', JSON.stringify(cart));
	localStorage.setItem('subtotal', JSON.stringify(calculateSubtotal(cart)));
};

export const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		setLoading: (state) => {
			state.loading = true;
		},
		setError: (state, { payload }) => {
			state.error = payload;
			state.loading = false;
		},
		cartItemAdd: (state, { payload }) => {
			//check if the added item is already in the cart, return whether item.id === payload.id, return a boolean
			const existingItem = state.cartItems.find((item) => item.id === payload.id);

			if (existingItem) {
				state.cartItems = state.cartItems.map((item) => (item.id === existingItem.id ? payload : item));
			} else {
				//if the added item is not in the cart, just add this new added item to the array of cartItems
				//cartItem is an array, ...state.cartItems is all of the previous cartItems, put into this array, 
				//and add new added item (which is payload) to the end of this array
				state.cartItems = [...state.cartItems, payload];
			}
			state.loading = false;
			state.error = null;
			updateLocalStorage(state.cartItems);
			state.subtotal = Number(calculateSubtotal(state.cartItems));
			//casting the type by Number() method.
		},
		cartItemRemoval: (state, { payload }) => {
			//filter method, if the item.is==payload, we dont include this item in the updated cartItems array
			//again, ...state.cartItems means all of the items in this iterable array
			state.cartItems = [...state.cartItems].filter((item) => item.id !== payload);
			updateLocalStorage(state.cartItems);
			state.subtotal = calculateSubtotal(state.cartItems);
			state.loading = false;
			state.error = null;
		},
		setShippingCosts: (state, { payload }) => {
			state.shipping = payload;
			localStorage.setItem('shipping', payload);
		},
		clearCart: (state) => {
			localStorage.removeItem('cartItems');
			localStorage.removeItem('shipping');
			localStorage.removeItem('subTotal');
			//these three properties are initialized in this cart state
			//keep in mind to take advantage of localStorage, means, all these properties should use/update localStorage
			state.cartItems = [];
			state.shipping = Number(4.99);
			state.subtotal = 0;
			state.loading = false;
			state.error = null;
		},
	},
});

export const { setError, setLoading, cartItemAdd, cartItemRemoval, setShippingCosts, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

export const cartSelector = (state) => state.cart;
