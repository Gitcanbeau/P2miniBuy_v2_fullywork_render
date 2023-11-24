import {
	Alert,
	AlertDescription,
	AlertIcon,
	AlertTitle,
	Box,
	Button,
	Center,
	Container,
	FormControl,
	Heading,
	Stack,
	Text,
	VStack,
	useBreakpointValue,
	useToast,
} from '@chakra-ui/react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as ReactLink, useParams } from 'react-router-dom';
import PasswordField from '../components/PasswordField';
import { resetPassword, resetState } from '../redux/actions/userActions';

const PasswordResetScreen = () => {
	const { token } = useParams();
	//get token from url
	const dispatch = useDispatch();
	//useDispatch allows to call methods provided in action file
	const toast = useToast();
	//useToast allows to show short notification to users

	const { loading, error, serverStatus, serverMsg } = useSelector((state) => state.user);
	//use useSelector to get user state from store.js
	//user state contains lots of properties, but we only need "loading, error, userInfo, serverMsg" here, so destruct assignment
	
	const headingBR = useBreakpointValue({ base: 'xs', md: 'sm' });
	const boxBR = useBreakpointValue({ base: 'transparent', md: 'bg-surface' });

	useEffect(() => {
		if (serverStatus && serverMsg) {
			toast({
				description: `${serverMsg}`,
				status: 'success',
				isClosable: true,
			});
			dispatch(resetState());
		}
	}, [error, toast, serverMsg, serverStatus, dispatch]);

	return serverStatus ? (
		<Center minH='90vh'>
			<VStack>
				<Text my='10' fontSize='xl'>
					Password reset successful!
				</Text>
				<Button as={ReactLink} to='/login' variant='outline' colorScheme='purple' w='300px'>
					Log in
				</Button>
				<Button as={ReactLink} to='/products' variant='outline' colorScheme='purple' w='300px'>
					Products
				</Button>
			</VStack>
		</Center>
	) : (
		<Formik
			initialValues={{ password: '' }}
			validationSchema={Yup.object({
				password: Yup.string()
					.min(1, 'Password is too short - must contain at least 1 character.')
					.required('Password is required.'),
				confirmPassword: Yup.string()
					.min(1, 'Password is too short - must contain at least 1 character.')
					.required('Password is required.')
					.oneOf([Yup.ref('password'), null], 'Passwords must match'),
			})}
			onSubmit={(values) => {
				dispatch(resetPassword(values.password, token));
			}}>
			{/* onSubmit={functionName(values)} */}
			{/* const functionName = (values)=>{ dispatch (resetPassword(values.password, token))} */}
			{(formik) => (
				<Container maxW='lg' py={{ base: '12', md: '24' }} px={{ base: '0', md: '8' }} minH='4xl'>
					<Stack spacing='8'>
						<Stack spacing='6'>
							<Stack spacing={{ base: '2', md: '3' }} textAlign='center'>
								<Heading size={headingBR}>Reset your password.</Heading>
							</Stack>
						</Stack>
						<Box
							py={{ base: '0', md: '8' }}
							px={{ base: '4', md: '10' }}
							bg={{ boxBR }}
							boxShadow={{ base: 'none', md: 'xl' }}>
							<Stack spacing='6' as='form' onSubmit={formik.handleSubmit}>
								{error && (
									<Alert
										status='error'
										flexDirection='column'
										alignItems='center'
										justifyContent='center'
										textAlign='center'>
										<AlertIcon />
										<AlertTitle>We are sorry!</AlertTitle>
										<AlertDescription>{error}</AlertDescription>
									</Alert>
								)}
								<Stack spacing='5'>
									<FormControl>
										{/* PasswordField is the component that we customized its attributes with useField */}
										<PasswordField type='password' name='password' placeholder='Your password' label='New Password' />
										<PasswordField
											type='password'
											name='confirmPassword'
											placeholder='Confirm your new password'
											label='Confirm your password'
										/>
									</FormControl>
								</Stack>
								<Stack spacing='6'>
									<Button colorScheme='purple' size='lg' fontSize='md' isLoading={loading} type='submit'>
										Set new Password
									</Button>
								</Stack>
							</Stack>
						</Box>
					</Stack>
				</Container>
			)}
		</Formik>
	);
};

export default PasswordResetScreen;
