import { FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { Field, useField } from 'formik';
import { InputRightElement, Button, InputGroup } from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useState } from 'react';

const PasswordField = ({ label, type, name, placeholder }) => {
	const [showPassword, setShowPassword] = useState(false);
	const [field, meta] = useField({ type, name, placeholder });
	return (
		<FormControl isInvalid={meta.error && meta.touched} mb='6'>
			<FormLabel noOfLines={1}>{label}</FormLabel>
			<InputGroup>
				<Field as={Input} {...field} type={showPassword ? 'text' : type} name={name} placeholder={placeholder} />
				<InputRightElement h='full'>
					<Button variant='ghost' onClick={() => setShowPassword((showPassword) => !showPassword)}>
						{/* typically onClick should be shown as below */}
						{/* 1st way to write functionName method with parameter passing in */}
						{/* onClick={( functionName(showPassword )} */}
						{/* const functionName = (showPassword)=>{ setShowPassword(!showPassword) } */}
						{/* replace functionName with anonymous function */}
						{/* onClick={(showPassword) => setShowPassword(!showPassword)} */}

						{/* 2nd way to write functionName method without parameter passing in */}
						{/* onClick={( functionName( )} */}
						{/* const functionName = ()=>{ setShowPassword( (showPassword) => !showPassword) ) } */}
						{/* replace functionName with anonymous function */}
						{/* onClick={() => setShowPassword((showPassword) => !showPassword)} */}


						{/* because this functionName() method is very short,  you can directly put it into the onClick */}
						{/* setShowPassword(false) */}
						{/* onClick={() => setShowPassword(false} */}
						{/* setShowPassword(true) */}
						{/* onClick={() => setShowPassword(true} */}
						
						
						
						{/* the content in the wrapper div should be covered by curly braces */}
						{/* depends on the boolean of showPassword, different icon will be shown */}
						{showPassword ? <ViewIcon /> : <ViewOffIcon />}
					</Button>
				</InputRightElement>
			</InputGroup>
			<FormErrorMessage>{meta.error}</FormErrorMessage>
		</FormControl>
	);
};

export default PasswordField;
