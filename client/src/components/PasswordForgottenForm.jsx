import { Text, Stack, Box, Button, Input } from '@chakra-ui/react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { sendResetEmail } from '../redux/actions/userActions';

const PasswordForgottenForm = () => {
	const dispatch = useDispatch();
	const [email, setEmail] = useState('');
	const handleChange = (event) => {
		setEmail(event.target.value);
	};

	return (
		// this parent div <> is very necessary, otherwise just starting with the <Box><Box/> will cause error
		<>
			<Box my='4'>
				<Text as='b'>Enter your email address below.</Text>
				<Text>We'll send you an email with a link to reset your password.</Text>
			</Box>
			<Stack>
				<Input
					mb='4'
					type='text'
					name='email'
					placeholder='Your Email Address'
					label='Email'
					value={email}
					onChange={(e) => handleChange(e)}
				/>
				{/* story */}
				{/* user provide email in the input, onChange will update the email by setEmail in the useEffect,
				click button to use the dispatch method to call the methods provided in userAction file,
				the sendResetEmail(email) method provided in userAction file require the email as parameter to pass in,
				the email is initialized with empty string, so we need to use useState to setEmail,
				so we need to use onChange to let setEmail happen */}
				{/* when you need to pass some parameter AAA from userInput to the method in the action file,
				 remember to provide const[AAA, setAAA] by useState(initial value of AAA), 
				 and remember to provide handleChange() method to call setAAA,
				 and in the <Input> div, receive the value={updatedAAA}, onChange to call handleChange,
				 and in the <Button> div, use onClick to call dispatch and pass the updatedAAA value in to the function provided in action file*/}
				<Button colorScheme='yellow' size='lg' fontSize='md' onClick={() => dispatch(sendResetEmail(email))}>
					Send Reset Email
				</Button>
			</Stack>
		</>
	);
};

export default PasswordForgottenForm;
