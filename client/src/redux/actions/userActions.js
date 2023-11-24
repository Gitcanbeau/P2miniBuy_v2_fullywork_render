import axios from 'axios';
import {
	setUserOrders,
	setError,
	setLoading,
	setServerResponseStatus,
	setServerResponseMsg,
	userLogin,
	userLogout,
	verificationEmail,
	stateReset,
} from '../slices/user';

import { clearCart } from '../slices/cart';

//in the client package.json, install jwt-decode

//the action file will get the data
//the slice file set the data to what we saying it should be
//the store provide this data to the components in react
//So this is called separation of concerns.

// we introduced the benefits of redux somewhere else.
// When we talk about okay how do we get the data.
// If in the LoginScreen we're calling the data and then the loginScreen we call the data.
// Again the code gets very messy with all these requests directly to the backend.
// And we can do this here in our Redux store okay so sounds complicated, but it will get easier for you

//these two arrows called querried function
	//with email and password parameters passed into this login() method, login() method can run the code
	//then it has a callback function with dispatch as the function body
export const login = (email, password) => async (dispatch) => {
	dispatch(setLoading(true));
	//the use of dispatch is just let the methods in action file call the methods provided in slice file
	try {
		const config = { headers: { 'Content-Type': 'application/json' } };

		const { data } = await axios.post('api/users/login', { email, password }, config);
		//frontend send post request to backend
		//first arg is the url (req.params), second arg is the JSON body (request.body), third arg is the configuration headers
		//destruction method to assign constant {data}
		//axios.get the result is the res.json, which means it returns a JSON obj

		dispatch(userLogin(data));
		//action file will fetch data from backend
		//use dispatch to call the methods provided in slice file
		//{data} is a JSON object, served as {payload} JSON object passed in to userLogin() method
		
		localStorage.setItem('userInfo', JSON.stringify(data));
		//userLogin() method in the slice will NOT update the localStorage
		//BUT we will update localStorage here
		//it is completely ok to put localStorage in the slice file
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

export const logout = () => (dispatch) => {
	localStorage.removeItem('userInfo');
	localStorage.removeItem('cartItems');
	dispatch(clearCart());
	dispatch(userLogout());
};

export const register = (name, email, password) => async (dispatch) => {
	dispatch(setLoading(true));
	try {
		const config = { headers: { 'Content-Type': 'application/json' } };

		const { data } = await axios.post('api/users/register', { name, email, password }, config);

		dispatch(userLogin(data));
		localStorage.setItem('userInfo', JSON.stringify(data));
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

export const verifyEmail = (token) => async (dispatch) => {
	dispatch(setLoading(true));
	try {
		const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };

		await axios.get(`/api/users/verify-email`, config);

		dispatch(verificationEmail());
		const userInfo = JSON.parse(localStorage.getItem('userInfo'));
		if (userInfo) {
			userInfo.active = true;
			localStorage.setItem('userInfo', JSON.stringify(userInfo));
		}
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

export const sendResetEmail = (email) => async (dispatch) => {
	dispatch(setLoading(true));
	try {
		const config = { headers: { 'Content-Type': 'application/json' } };

		const { data, status } = await axios.post(`/api/users/password-reset-request`, { email }, config);

		dispatch(setServerResponseMsg(data));
		dispatch(setServerResponseStatus(status));
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

export const resetPassword = (password, token) => async (dispatch) => {
	dispatch(setLoading(true));
	try {
		const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };

		const { data, status } = await axios.post(`/api/users/password-reset`, { password }, config);
		console.log(data, status);
		// dispatch(setServerResponseMsg(data)); //下面的代码是他提供的，但是我觉得我写的这个对， 就提供一个{payload}， 不应该传两个
		dispatch(setServerResponseMsg(data, status));
		dispatch(setServerResponseStatus(status));
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

export const resetState = () => async (dispatch) => {
	dispatch(stateReset());
};

export const googleLogin = (googleId, email, name, googleImage) => async (dispatch) => {
	dispatch(setLoading(true));
	try {
		const config = { headers: { 'Content-Type': 'application/json' } };
		//It is used when it is not known how this data will be used. When the information is to be just extracted from the server in JSON format, 
		//it may be through a link or from any file, in that case, it is used.
		//The Content-Type header is just used as info for your application. 
		//The browser doesn't care what it is. The browser just returns you the data from the AJAX call. 
		//If you want to parse it as JSON, you need to do that on your own.
		//The header is there so your app can detect what data was returned and how it should handle it. 
		//You need to look at the header, and if it's application/json then parse it as JSON.
		//This is actually how jQuery works. If you don't tell it what to do with the result, 
		//it uses the Content-Type to detect what to do with it.

		const { data } = await axios.post('/api/users/google-login', { googleId, email, name, googleImage }, config);
		//recall that we have: userRoutes.route('/google-login').post(googleLogin);
		//in the googleLogin method provided by userRoutes, we have const { googleId, email, name, googleImage } = req.body;
		//so we need to send { googleId, email, name, googleImage } as the second arg from frontend
		dispatch(userLogin(data));
		localStorage.setItem('userInfo', JSON.stringify(data));
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

export const getUserOrders = () => async (dispatch, getState) => {
	dispatch(setLoading(true));

	//The destructuring assignment syntax is a JavaScript expression 
	//that makes it possible to unpack values from arrays, or properties from objects, into distinct variables.
	//use getState() method to get the state of user, but we dont need all the property of user state
	//therefore, we use destruction to get userInfo property and assign to user const
	const {
		user: { userInfo },
	} = getState();

	try {
		const config = { headers: { Authorization: `Bearer ${userInfo.token}`, 'Content-Type': 'application/json' } };

		//Because this route is protected.
		// So we need the bearer token and the application Json.
		//we need to specify this data is bearer token otherwise the backend may not know
		const { data } = await axios.get(`/api/users/${userInfo._id}`, config);
		dispatch(setUserOrders(data));
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
