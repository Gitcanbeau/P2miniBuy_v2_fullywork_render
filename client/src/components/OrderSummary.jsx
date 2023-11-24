import { Button, Flex, Heading, Stack, Text, useColorModeValue as mode } from '@chakra-ui/react';
import { FaArrowRight } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link as ReactLink } from 'react-router-dom';
//in client folder, install @stripe/react-stripe-js and install @stripe/stripe-js

const OrderSummary = ({ checkoutScreen = false }) => {
	//we will use this OrderSummary component in the productCard and checkoutScreen
	//we can have this checkout button shown on productCard but hidden in the checkoutScreen
	//so we can provide a default value here { checkoutScreen = false } which makes the checkout button shown
	//if we are on the checkoutScreen, we will pass true to this component then the checkout button will be hidden
	const { subtotal, shipping } = useSelector((state) => state.cart);
	//useSelector() allows to get state from store.js
	//cart state contains lots of properties, but we only need "subtotal, shipping " here, so destruction assignment

	return (
		<Stack
			minWidth='300px'
			spacing='8'
			borderWidth='1px'
			borderColor={mode('purple.500', 'purple.100')}
			rounded='lg'
			padding='8'
			w='full'>
			<Heading size='md'>Order Summary</Heading>
			<Stack spacing='6'>
				<Flex justify='space-between'>
					<Text fontWeight='medium' color={mode('gray.600', 'gray.400')}>
						Subtotal
					</Text>
					<Text fontWeight='medium'>${subtotal}</Text>
				</Flex>
				<Flex justify='space-between'>
					<Text fontWeight='medium' color={mode('gray.600', 'gray.400')}>
						Shipping
					</Text>
					<Text fontWeight='medium'>${shipping}</Text>
				</Flex>
				<Flex justify='space-between'>
					<Text fontSize='xl' fontWeight='extrabold'>
						Total
					</Text>
					<Text fontWeight='medium'>${Number(subtotal) + Number(shipping)}</Text>
				</Flex>
			</Stack>
			<Button
				hidden={checkoutScreen}
				//if on the checkoutScreen, this will be true and this checkout button will be hidden because we've already at checkoutScreen
				//the attribute value almost covered by curly braces, if not, they would be covered by quote
				as={ReactLink}
				to='/checkout'
				colorScheme='purple'
				size='lg'
				rightIcon={<FaArrowRight />}>
				Checkout
			</Button>
		</Stack>
	);
};

export default OrderSummary;
