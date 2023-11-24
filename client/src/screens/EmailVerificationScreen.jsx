import React, { useEffect } from 'react';
import { useParams, Link as ReactLink } from 'react-router-dom';
import { verifyEmail } from '../redux/actions/userActions';
import { useDispatch, useSelector } from 'react-redux';
import {
	AbsoluteCenter,
	Box,
	AlertIcon,
	AlertTitle,
	AlertDescription,
	Text,
	Spinner,
	Button,
	Alert,
} from '@chakra-ui/react';

const EmailVerificationScreen = () => {
	const { token } = useParams();
	//if my memory is right, the token is send in the verification url link
	//get token from url
	//in backend, in the sendVerificationEmail.js file
	//<a href="http://localhost:3000/email-verify/${token}">Click here!</a>
	//${token} is defined in the url
	//the above link will be sent to user, when user click that link
	//frontend, app.js file
	// <Route path='/email-verify/:token' element={<EmailVerificationScreen />} />
	//the user will be redirected to component <EmailVerificationScreen />
	//because the link contains {token}
	//frontend, productAction file, user click button will eventually call the method and pass this {token} in action file to communicate with backend
	//in action file, getProduct method uses the axios.get/put/post/delete(url)

	//another example
	//in the above url, there could contain some parameter in the variable format ${id}
	//"http://localhost:3000/api/products/${id}"
	//in productScreen.jsx, you can use useParams() to extract that id from the url
	const dispatch = useDispatch();
	const { error, loading } = useSelector((state) => state.user);

	useEffect(() => {
		dispatch(verifyEmail(token));
	}, [token, dispatch]);
	//这一大堆方法调用来调用去挺难看的
	//没懂怎么get {token}
	
	return (
		<Box position='relative' minH='3xl'>
			<AbsoluteCenter axis='both'>
				{loading ? (
					<Box textAlign='center'>
						<Text fontSize='3xl'>We are working on verifying your email.</Text>
						<Spinner size='xl' />
					</Box>
				) : error === null ? (
					<Alert
						bg='parent'
						status='success'
						flexDirection='column'
						alignItems='center'
						justifyContent='center'
						textAlign='center'>
						<AlertIcon boxSize='16' size='xl' />
						<AlertTitle>Thanks for verifying your email.</AlertTitle>
						<AlertDescription fontSize='xl'>You can close this window now.</AlertDescription>
					</Alert>
				) : (
					<Alert
						bg='parent'
						status='error'
						flexDirection='column'
						alignItems='center'
						justifyContent='center'
						textAlign='center'>
						<AlertIcon boxSize='16' size='xl' />
						<AlertTitle>We are sorry!</AlertTitle>
						<AlertDescription fontSize='xl'>{error}</AlertDescription>
					</Alert>
				)}
			</AbsoluteCenter>
		</Box>
	);
};

export default EmailVerificationScreen;
