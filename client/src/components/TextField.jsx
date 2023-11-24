import { FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/form-control';
import { Input } from '@chakra-ui/input';
import { Field, useField } from 'formik';

const TextField = ({ label, type, name, placeholder }) => {
	const [field, meta] = useField({ type, name, placeholder });
	//useField is a custom React hook that will automatically help you hook up inputs to Formik. 
	//You can and should use it to build your own custom input primitives.
	//the object in the useField: type, name, placeholder, will be used as required field in the <Field> div
	//the passed in object { label, type, name, placeholder }, will be assigned to these required filed
//<Field as={Input} {...field} type={type} name={name} placeholder={placeholder} />
//as, type, name placeholder are the attributes of <Field> div
//the value on the right of "=" is the value passed into these attributes
//useField can let us customize the attributes of <Field> div
	return (
		<FormControl isInvalid={meta.error && meta.touched} mb='6'>
			<FormLabel noOfLines={1}>{label}</FormLabel>
			<Field as={Input} {...field} type={type} name={name} placeholder={placeholder} />
			<FormErrorMessage>{meta.error}</FormErrorMessage>
		</FormControl>
	);
};

export default TextField;
