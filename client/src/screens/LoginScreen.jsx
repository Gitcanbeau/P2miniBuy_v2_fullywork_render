import {
	Alert,
	AlertDescription,
	AlertIcon,
	AlertTitle,
	Box,
	Button,
	Container,
	FormControl,
	HStack,
	Heading,
	Stack,
	Text,
	useToast,
} from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as ReactLink, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PasswordField from '../components/PasswordField';
import PasswordForgottenForm from '../components/PasswordForgottenForm';
import TextField from '../components/TextField';
import { login, googleLogin } from '../redux/actions/userActions';
import { useGoogleLogin } from '@react-oauth/google';



const LoginScreen = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	// So useNavigate will be handy when the user logged in. So we will get the data from the API.
	// And then with the useNavigate we can redirect the user to another location.
	const location = useLocation();
	// We want to keep track of the last location of the user. We can do this with the useLocation.
	const redirect = '/products';
	const toast = useToast();

	const { loading, error, userInfo, serverMsg } = useSelector((state) => state.user);
	//use useSelector to get user state from store.js
	//user state contains lots of properties, but we only need "loading, error, userInfo, serverMsg" here, so destruct assignment
	const [showPasswordReset, setShowPasswordReset] = useState(false);


// when the user clicks login, he sends the password to the API, the IP, the API will check if the user exists and pwd is correct.
// after chekcing, it returns back with the userInfo information.
// Now, we want to keep track of the userInfo in the state of Redux. //const { loading, error, userInfo, serverMsg } = useSelector((state) => state.user);
// So we will fill on a success login.
	useEffect(() => {
		if (userInfo) {
			if (location.state?.from) {
				navigate(location.state.from);
				//if the user has been logged in and if the user has been redirected from other page (ex, checkout page).
				//Please navigate to where he came from.
			} else {
				navigate(redirect);
				//if the user has been logged in but he is just first to be here (which means he from nowhere)
				//then just redirect the user to '/products' page
			}
			toast({
				description: 'Login successful.',
				status: 'success',
				isClosable: true,
			});
			//we can let the user know with a toaster notification that the login has been successful.
		}

		if (serverMsg) {
			toast({
				description: `${serverMsg}`,
				status: 'success',
				isClosable: true,
			});
			//toast is quite helpful to provide notification to user, 
			//template string and dollar sign `${serverMsg}` allows you to show the original info of that variable
			//isClosable let the user to close this pop up message
		}
	}, [userInfo, redirect, error, navigate, location.state, toast, showPasswordReset, serverMsg]);

	const handleGoogleLogin = useGoogleLogin({
		onSuccess: async (response) => {
			const userInfo = await axios
				.get('https://www.googleapis.com/oauth2/v3/userinfo', {
					headers: { Authorization: `Bearer ${response.access_token}` },
				})
				.then((res) => res.data);

				//What we get back from it is information in terms of a promise.
				//A promise returns us kind of a stream of data we can use.
				//and we can chain the returned promise with .then() to make use of the data
			const { sub, email, name, picture } = userInfo;
			dispatch(googleLogin(sub, email, name, picture));
		},
	});

	return (
		<Formik
			initialValues={{ email: '', password: '' }}
			validationSchema={Yup.object({
				email: Yup.string().email('Invalid email.').required('An email address is required.'),
				password: Yup.string()
					.min(1, 'Password is too short - must contain at least 1 character.')
					.required('Password is required.'),
			})}
			onSubmit={(values) => {
				dispatch(login(values.email, values.password));
			}}>
			{(formik) => (
				<Container maxW='lg' py={{ base: '12', md: '24' }} px={{ base: '0', md: '8' }} minH='4xl'>
					<Stack spacing='8'>
						<Stack spacing='6'>
							<Stack spacing={{ base: '2', md: '3' }} textAlign='center'>
								<Heading fontSize={{ base: 'md', lg: 'xl' }}>Log in to your account</Heading>
								<HStack spacing='1' justify='center'>
									<Text>Don't have an account?</Text>
									<Button as={ReactLink} to='/registration' variant='link' colorScheme='purple'>
										Sign up
									</Button>
								</HStack>
							</Stack>
						</Stack>
						<Box
							py={{ base: '0', md: '8' }}
							px={{ base: '4', md: '10' }}
							bg={{ base: 'transparent', md: 'bg-surface' }}
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
										<TextField type='text' name='email' placeholder='you@example.com' label='Email' />
										<PasswordField type='password' name='password' placeholder='your password' label='Password' />

										<Button
											my='2'
											onClick={() => setShowPasswordReset(!showPasswordReset)}
											size='sm'
											colorScheme='purple'
											variant='outline'>
											Forgot Password ?
										</Button>
										{showPasswordReset && <PasswordForgottenForm />}
									</FormControl>
								</Stack>
								{/* <Stack spacing='6'>
									<Button colorScheme='purple' size='lg' fontSize='md' isLoading={loading} type='submit'>
										Sign in
									</Button>
									<Button
										leftIcon={<FcGoogle />}
										colorScheme='purple'
										size='lg'
										fontSize='md'
										isLoading={loading}
										onClick={() => handleGoogleLogin()}>
										Google sign in
									</Button>
								</Stack> */}
							</Stack>
						</Box>
					</Stack>
				</Container>
			)}
		</Formik>
	);
};

export default LoginScreen;
