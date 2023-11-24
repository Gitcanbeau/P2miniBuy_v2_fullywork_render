import { useColorMode, IconButton } from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';

const ColorModeToggle = () => {
	const { colorMode, toggleColorMode } = useColorMode();
	//something like const[coloer, setColor] = useState('red');
	//but useColorMode() is a method to use, toogleColorMode will switch the current colorMode to the other one

	return (
		<IconButton icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />} onClick={toggleColorMode} variant='ghost' />
	);
};

export default ColorModeToggle;
