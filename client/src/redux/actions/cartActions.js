import axios from 'axios';
import { setError, setLoading, setShippingCosts, cartItemAdd, cartItemRemoval, clearCart } from '../slices/cart';

export const addCartItem = (id, qty) => async (dispatch) => {
	//these two arrows called querried function
	//with id and qty parameters passed into this addCartItem() method, addCartItem() method can run the code
	//then it has a callback function with dispatch as the function body
	dispatch(setLoading(true));
	//the use of dispatch is just let the methods in action file call the methods provided in slice file
	try {
		const { data } = await axios.get(`/api/products/${id}`);
		//destruction method to assign constant {data}
		//axios.get the result is the res.json, which means it returns a JSON obj
		const itemToAdd = {
			id: data._id,
			name: data.name,
			subtitle: data.subtitle,
			image: data.images[0],
			price: data.price,
			stock: data.stock,
			brand: data.brand,
			qty,
			stripeId: data.stripeId,
		};
		//other properties are defined in product entity, so just data.propertyName
		//qty is the property we should pass into this addCartItem() method, 

		dispatch(cartItemAdd(itemToAdd));
		//action file will fetch data from backend
		//use dispatch to call the methods provided in slice file
		//itemToAdd is a JSON object, served as {payload} JSON object passed in to cartItemAdd() method
		//cartItemAdd() method in the slice will update the localStorage
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

export const removeCartItem = (id) => async (dispatch) => {
	dispatch(setLoading(true));
	dispatch(cartItemRemoval(id));
};

//ex, dispatch(setShipping(e === 'express' ? Number(14.99).toFixed(2) : Number(4.99).toFixed(2)));
//e is the param pass into the onChange hook 
export const setShipping = (value) => async (dispatch) => {
	dispatch(setShippingCosts(value));
};

export const resetCart = () => (dispatch) => {
	dispatch(clearCart);
};
