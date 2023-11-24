import axios from 'axios';
import { setError, setShippingAddress, clearOrder } from '../slices/order';

//ex, dispatch(setAddress(values));
export const setAddress = (data) => (dispatch) => {
	dispatch(setShippingAddress(data));
};

//ex, dispatch(setPayment());
export const setPayment = () => async (dispatch, getState) => {
	const {
		cart: { cartItems, subtotal, shipping },
		order: { shippingAddress },
		user: { userInfo },
	} = getState();

	// console.log(shippingAddress);

	const newOrder = { subtotal, shipping, shippingAddress, cartItems, userInfo };

	try {
		const config = { headers: { Authorization: `Bearer ${userInfo.token}`, 'Content-Type': 'application/json' } };

		const { data } = await axios.post('api/checkout', newOrder, config);
		window.location.assign(data.url);
		//recall the success_url and cancel_url provided in stripeRoutes
		//success_url: 'http://localhost:3000/success',
		//cancel_url: 'http://localhost:3000/cancel',
		//we can redirect the user to data.url
		//The window. location. assign() method belongs to the Location object. 
		//It allows the window to load a document specified by the provided URL.
	} catch (error) {
		setError(
			error.response && error.response.data.message
				? error.response.data.message
				: error.message
				? error.message
				: 'An expected error has occured. Please try again later.'
		);
	}
};

export const resetOrder = () => async (dispatch) => {
	dispatch(clearOrder());
};
