import { combineReducers, configureStore } from '@reduxjs/toolkit';
//in old days, it is complicated to set redux up; but this toolkit helps a lot, pls remember this  '@reduxjs/toolkit';
//this toolkit should be in the client package.json file

import product from './slices/product';
import cart from './slices/cart';
import user from './slices/user';
import order from './slices/order';
import admin from './slices/admin';


// Redux has a reducer which will update our components AS SOON AS something changes.
// We have to combine reducers method here for it, which takes an {object} .
// this is where we can combine on our reducers for products, orders, users, etc in our database or in our frontend.

const reducer = combineReducers({
	product,
	cart,
	user,
	order,
	admin,
});


export default configureStore({ reducer });
// just export the configure object
// Now we need to let our front end knows that the store exists 
// and we are doing this either in index.js or app.js in client folder (not server folder),
// because this is the entry point of frontend of our application.

//productSlices->productActions
