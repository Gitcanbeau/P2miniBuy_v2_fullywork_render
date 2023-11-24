import {
	Box,
	Flex,
	Heading,
	HStack,
	Link,
	Stack,
	useColorModeValue as mode,
	Spinner,
	Alert,
	AlertIcon,
	AlertDescription,
	Wrap,
	AlertTitle,
} from '@chakra-ui/react';
import { Link as ReactLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CartItem from '../components/CartItem';
import OrderSummary from '../components/OrderSummary';

const CartScreen = () => {
	const { loading, error, cartItems } = useSelector((state) => state.cart);
	//useSelector() allows to get state from store.js
	//cart state contains lots of properties, but we only need "loading, error, cartItems " here, so destruction assignment
	

	const getHeadingContent = () => (cartItems.length === 1 ? '(1 Item)' : `(${cartItems.length} Items)`);

	return (
		<Wrap spacing='30px' justify='center' minHeight='100vh'>
			{/* again, in the wrapper div, the content should be covered by curly braces {loading ? ...etc} */}
			{loading ? (
				<Stack direction='row' spacing='4'>
					<Spinner mt='20' thickness='2px' speed='0.65s' emptyColor='gray.200' color='purple.500' size='xl' />
				</Stack>
			) : error ? (
				<Alert status='error'>
					<AlertIcon />
					<AlertTitle>We are sorry!</AlertTitle>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			) : cartItems.length <= 0 ? (
				<Alert status='warning'>
					<AlertIcon />
					<AlertTitle>Your cart is empty.</AlertTitle>
					<AlertDescription>
						<Link as={ReactLink} to='/products'>
							Click here to see your products.
						</Link>
					</AlertDescription>
				</Alert>
			) : (
				<Box px='4' py='8' w={{ base: '95%', md: '70%', lg: '50%' }}>
					<Stack
						direction={{ base: 'column', lg: 'row' }}
						align={{ lg: 'flex-start' }}
						spacing={{ base: '8', md: '16' }}>
						<Stack spacing={{ base: '8', md: '10' }} flex='2'>
							<Heading fontSize='2xl' fontWeight='extrabold'>
								Shopping Cart
							</Heading>

							<Stack spacing='6'>
								{/* use a Stack to show cartItem */}
								{/* again, within a wrapper dic, all the content should be covered by a curly braces */}
								{/* cartItems is dectructed from state.cart, which is an array, use map() method */}
								{/* cartItems.map(()->{ declaration, return (); }) */}
								{/* since we dont have other declaration, we can save curly braces and the return keyword */}
								{/* <componentName/> can be considered as a shortcut of the html which can be returned */}
								{cartItems.map((cartItem) => (
									<CartItem key={cartItem.id} cartItem={cartItem} />
								))}
							</Stack>
						</Stack>

					{/* here we have Stack and Flex at same level, under another Stack, the height of Stack and Flex should be same */}
						<Flex direction='column' align='center' flex='1'>
							<OrderSummary />

							<HStack mt='6' fontWeight='semibold'>
								<p>or</p>
								<Link as={ReactLink} to='/products' color={mode('purple.500', 'purple.200')}>
									Continue Shopping
								</Link>
							</HStack>
						</Flex>
					</Stack>
				</Box>
			)}
		</Wrap>
	);
};

export default CartScreen;
