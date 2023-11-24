import {
	Box,
	Button,
	Flex,
	FormControl,
	Heading,
	Radio,
	RadioGroup,
	Spacer,
	Stack,
	Text,
	VStack,
} from '@chakra-ui/react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { Link as ReactLink } from 'react-router-dom';
import { setShipping } from '../redux/actions/cartActions';
import { setAddress, setPayment } from '../redux/actions/orderActions';
import TextField from './TextField';


const ShippingInformation = () => {
	const { shipping } = useSelector((state) => state.cart);
	const { shippingAddress } = useSelector((state) => state.order);
	//use useSelector to get the cart state and order state from store.js
	//in action file, you can use getState() to get these states
	//but in jsx file, you need to use useSelector() to get these states
	//cart state contains many properties, we only need "shipping" here, so destructing assignment
	//order state contains many properties, we only need "shippingAddress" here, so destructing assignment
	const dispatch = useDispatch();

	const onSubmit = async (values) => {
		dispatch(setAddress(values));
		dispatch(setPayment());
		//use dispatch to call the methods provided in action file
	};
	//Formik is designed to manage forms with complex validation with ease. 
	//Formik supports synchronous and asynchronous form-level and field-level validation. 
	//Furthermore, it comes with baked-in support for schema-based form-level validation through Yup. 
	//This guide will describe the ins and outs of all of the above

	return (
		<Formik
			initialValues={{
				address: shippingAddress ? shippingAddress.address : '',
				postalCode: shippingAddress ? shippingAddress.postalCode : '',
				city: shippingAddress ? shippingAddress.city : '',
				country: shippingAddress ? shippingAddress.country : '',
			}}
			// put the initial value {object}
			//after that, provide the validationSchema by creating a new Yup object({object content})
			validationSchema={Yup.object({
				address: Yup.string().required('We need an address.').min(2, 'This address is too short.'),
				postalCode: Yup.string().required('We need a postal code.').min(2, 'This postal code is too short.'),
				city: Yup.string().required('We need a city.').min(2, 'This city is too short.'),
				country: Yup.string().required('We need a country.').min(2, 'This country is too short.'),
			})}
			onSubmit={onSubmit}>
				{/* the contect in the wrapper div should be covered by curly braces
				here should be anonymous function (formit)=>{const balabala, return <div><div/>}
				pass the formik into the function, because we dont have other declaration, 
				we can save the curly braces and just return html
				we can also save the return keyword and just use parenthesis */}
			{(formik) => (
				<>
					<VStack as='form'>
						<FormControl>
							<TextField name='address' placeholder='Street Address' label='Street Address' />
							<Flex>
								<Box flex='1' mr='10'>
									<TextField name='postalCode' placeholder='Postal Code' label='Postal Code' type='number' />
								</Box>
								<Box flex='2'>
									<TextField name='city' placeholder='City' label='City' />
								</Box>
							</Flex>
							<TextField name='country' placeholder='Country' label='Country' />
						</FormControl>
						<Box w='100%' pr='5'>
							<Heading fontSize='2xl' fontWeight='extrabold' mb='10'>
								Shipping Method
							</Heading>
							<RadioGroup
								onChange={(e) => {
									dispatch(setShipping(e === 'express' ? Number(14.99).toFixed(2) : Number(4.99).toFixed(2)));
								}}
								defaultValue={shipping === 4.99 ? 'withoutExpress' : 'express'}>
								<Stack direction={{ base: 'column', lg: 'row' }} align={{ lg: 'flex-start' }}>
									<Stack pr='10' spacing={{ base: '8', md: '10' }} flex='1.5'>
										<Box>
											<Radio value='express'>
												<Text fontWeight='bold'>Express 14.99</Text>
												<Text>Dispatched in 24 hours</Text>
											</Radio>
										</Box>
										<Stack spacing='6'>Express</Stack>
									</Stack>
									<Radio value='withoutExpress'>
										<Box>
											<Text fontWeight='bold'>Standard 4.99</Text>
											<Text>Dispatched in 2 - 3 days</Text>
										</Box>
									</Radio>
								</Stack>
							</RadioGroup>
						</Box>
					</VStack>
					<Flex alignItems='center' gap='2' direction={{ base: 'column', lg: 'row' }}>
						<Button variant='outline' colorScheme='purple' w='100%' as={ReactLink} to='/cart'>
							Back to cart
						</Button>
						<Button
							variant='outline'
							colorScheme='purple'
							w='100%'
							as={ReactLink}
							to='/payment'
							onClick={formik.handleSubmit}>
							Continue to Payment
						</Button>
					</Flex>
				</>
			)}
		</Formik>
	);
};

export default ShippingInformation;
