import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { VStack, Spinner } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import axios from 'axios';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ProductsScreen from './screens/ProductsScreen';
import Header from './components/Header';
import LandingScreen from './screens/LandingScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import Footer from './components/Footer';
import LoginScreen from './screens/LoginScreen';
import EmailVerificationScreen from './screens/EmailVerificationScreen';
import PasswordResetScreen from './screens/PasswordResetScreen';
import RegistrationScreen from './screens/RegistrationScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import YourOrdersScreen from './screens/YourOrdersScreen';
import CancelScreen from './screens/CancelScreen';
import SuccessScreen from './screens/SuccessScreen';
import AdminConsoleScreen from './screens/AdminConsoleScreen';

function App() {
	const theme = extendTheme({
		styles: {
			global: (props) => ({
				body: {
					bg: props.colorMode === 'light' && '#F7FAFC',
				},
			}),
		},
	});

	const [googleClient, setGoogleClient] = useState(null);
	useEffect(() => {
		const googleKey = async () => {
			//recall in the server index.js file, we have this: app.get('/api/config/google', (req, res) => res.send(process.env.GOOGLE_CLIENT_ID));
			//this is how to get the GOOGLE_CLIENT_ID from env file from the backend
			const { data: googleId } = await axios.get('/api/config/google');
			setGoogleClient(googleId);
		};
		googleKey();
	}, [googleClient]);

	return (
		// ChakraProvider wrapper component should be at the outer most shell
		<ChakraProvider theme={theme}>
			{!googleClient ? (
				<VStack pt='37vh'>
					<Spinner mt='20' thickness='2px' speed='0.65s' emptyColor='gray.200' color='purple.500' size='xl' />
				</VStack>
			) : (
				<GoogleOAuthProvider clientId={googleClient}>
					<Router>
						{/* use Router wrapper component to introduce the routes you want to set */}
						{/* pass Header, main routes, and Footer within Router wrapper */}
						<Header />
						<main>
							<Routes>
								<Route path='/products' element={<ProductsScreen />} />
								<Route path='/' element={<LandingScreen />} />
								<Route path='/product/:id' element={<ProductScreen />} />
								<Route path='/cart' element={<CartScreen />} />
								<Route path='/login' element={<LoginScreen />} />
								<Route path='/registration' element={<RegistrationScreen />} />
								<Route path='/email-verify/:token' element={<EmailVerificationScreen />} />
								<Route path='/password-reset/:token' element={<PasswordResetScreen />} />
								<Route path='/checkout' element={<CheckoutScreen />} />
								<Route path='/cancel' element={<CancelScreen />} />
								<Route path='/order-history' element={<YourOrdersScreen />} />
								<Route path='/success' element={<SuccessScreen />} />
								<Route path='/admin-console' element={<AdminConsoleScreen />} />
							</Routes>
						</main>
						<Footer />
					</Router>
				</GoogleOAuthProvider>
			)}
		</ChakraProvider>
	);
}

// return (
// 	// ChakraProvider wrapper component should be at the outer most shell
// 	<ChakraProvider theme={theme}>
		
// 		<Router>
// 			{/* use Router wrapper component to introduce the routes you want to set */}
// 			{/* pass Header, main routes, and Footer within Router wrapper */}
// 			<Header />
// 			<main>
// 				<Routes>
// 					<Route path='/products' element={<ProductsScreen />} />
// 					<Route path='/' element={<LandingScreen />} />
// 					<Route path='/product/:id' element={<ProductScreen />} />
// 					<Route path='/cart' element={<CartScreen />} />
// 					<Route path='/login' element={<LoginScreen />} />
// 					<Route path='/registration' element={<RegistrationScreen />} />
// 					<Route path='/email-verify/:token' element={<EmailVerificationScreen />} />
// 					<Route path='/password-reset/:token' element={<PasswordResetScreen />} />
// 					<Route path='/checkout' element={<CheckoutScreen />} />
// 					<Route path='/cancel' element={<CancelScreen />} />
// 					<Route path='/order-history' element={<YourOrdersScreen />} />
// 					<Route path='/success' element={<SuccessScreen />} />
// 					<Route path='/admin-console' element={<AdminConsoleScreen />} />
// 				</Routes>
// 			</main>
// 			<Footer />
// 		</Router>
			
		
// 	</ChakraProvider>
// );
// }

export default App;
