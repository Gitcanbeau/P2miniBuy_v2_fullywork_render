import { createSlice } from '@reduxjs/toolkit';
//remember this '@reduxjs/toolkit' package
//each slice contains the initial state and how the state gets changed

export const initialState = {
	loading: false,
	error: null,
	userInfo: JSON.parse(localStorage.getItem('userInfo')) ?? null,
	//?? means if the left of ?? is false, then use the right
	//userInfo use localStorage saves key-value pair, the value is a JSONstring, 
	//therefore use JSON.parse to construct the JavaScript value or object described by the string.
	serverMsg: null,
	serverStatus: null,
};

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		//in action file, the method in slice will be called by dispatch method. for example, dispatch(setLoading(true));
		setLoading: (state) => {
			state.loading = true;
		},
		//an example on how to call 
		// dispatch(
		// 	setError(
		// 		error.response && error.response.data.message
		// 			? error.response.data.message
		// 			: error.message
		// 			? error.message
		// 			: 'An expected error has occured. Please try again later.'
		// 	)
		// );
		setError: (state, { payload }) => {
			state.error = payload;
			state.loading = false;
		},
		//in action file, the method in slice will be called by dispatch method. for example, dispatch(userLogin(data));
		userLogin: (state, { payload }) => {
			state.userInfo = payload;
			state.error = null;
			state.loading = false;
		},
		//in action file, the method in slice will be called by dispatch method. for example, dispatch(userLogout());
		userLogout: (state) => {
			state.loading = false;
			state.error = null;
			state.userInfo = null;
		},
		//in action file, the method in slice will be called by dispatch method. for example, dispatch(verificationEmail());
		verificationEmail: (state) => {
			state.userInfo && (state.userInfo.active = true);
			state.loading = false;
			state.error = null;
		},
		setServerResponseMsg: (state, { payload }) => {
			state.serverMsg = payload;
			state.loading = false;
		},
		setServerResponseStatus: (state, { payload }) => {
			state.serverStatus = payload;
			state.loading = false;
		},
		stateReset: (state) => {
			state.loading = false;
			state.serverMsg = null;
			state.error = null;
		},
		setUserOrders: (state, { payload }) => {
			state.error = null;
			state.orders = payload;
			state.loading = false;
		},
	},
});

//in oder to let other file use these methods in the reducers, export them
//you can export the productsSlice.reducer, but you need to use the dot to call the method. reducer.setLoading(), which is kind of tedious
//or you can export each of them, so that you only need to import several methods import {setLoading, setError} as needed
export const {
	setUserOrders,
	setError,
	setLoading,
	setServerResponseStatus,
	setServerResponseMsg,
	userLogin,
	userLogout,
	verificationEmail,
	stateReset,
} = userSlice.actions;

export default userSlice.reducer;

export const userSelector = (state) => state.user;
