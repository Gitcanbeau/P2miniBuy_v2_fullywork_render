import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import store from './redux/store';
import { Provider } from 'react-redux';
//Overview​ The <Provider> component makes the Redux store available to any nested components that need to access the Redux store. 
//Since any React component in a React Redux app can be connected to the store, 
//most applications will render a <Provider> at the top level, with the entire app's component tree inside of it.


// Now we need to let our front end knows that the store exists 
// and we are doing this either in index.js or app.js, because this is the entry point of our application.

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	//wrap the <App/> with Provider and it can take the property called store, just pass our own store into this store property
	//here is the end of Redux setup
	<Provider store={store}>
		<App />
	</Provider>
);
