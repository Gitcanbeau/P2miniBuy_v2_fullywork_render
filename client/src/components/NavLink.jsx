import { IconButton } from '@chakra-ui/react';
import { Link as ReactLink } from 'react-router-dom';

//here, same explanation on why we use const NavLink=()=>(); rather than const NavLink=()=>{};
//because we dont have other declarations above return();
//therefore we can save that pair of {}, save the return keyword, and simply use ();
const NavLink = ({ children, route }) => (
	//as ReactLink and direct to route, show children
	//same notice, the content placed in the wrapper div should be covered with curly braces {children}
	<IconButton as={ReactLink} px='2' py='1' rounded='md' variant='ghost' to={route}>
		{children}
	</IconButton>
);

export default NavLink;
