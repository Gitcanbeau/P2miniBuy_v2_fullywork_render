import {
	Box,
	Flex,
	Heading,
	HStack,
	Icon,
	Image,
	Link,
	Skeleton,
	Stack,
	useColorModeValue as mode,
	Text,
} from '@chakra-ui/react';
import { FaArrowRight } from 'react-icons/fa';
import { BsPhoneFlip } from 'react-icons/bs';
import { Link as ReactLink } from 'react-router-dom';


//typically
// function functionName(p1,p2){
// 	  return blablabla;
// };

//when calling this method, both ways will work
//1 functionName(pp1, pp2);
//2 function functionName(ppp1, ppp2){};

//a anonymous function expression will be following two ways
//1 [const | let | var] variableName =function(){};
//2 [const | let | var] variableName = () => { return blababla; };
//the creation of anonymous function to that variableName

//correct format is:
//const LandingScreen = () = {
	// other declaration;
	// return ();
// };
//however
// since we dont have other declation, we can save that step and also save return(); part
// and we can save the {} and use () as automatically return the content which is supposed to be placed in the return(); part
//const landingScreen=()=>();

//another note:
//Semicolons serve to separate statements from each other, and a FunctionDeclaration is not a statement.

const LandingScreen = () => (
	// p is responsive padding
	<Box maxW='8xl' mx='auto' p={{ base: '0', lg: '12' }} minH='6xl'>
		<Stack direction={{ base: 'column-reverse', lg: 'row' }} spacing={{ base: '0', lg: '20' }}>
			{/* flex=1 means stretch as far as possible */}
			<Flex flex='1' overflow='hidden'>
				<Image
					src={mode('images/landing-light.jpg', 'images/landing-dark.jpg')}
					fallback={<Skeleton />}
					maxH='550px'
					minW='300px'
					objectFit='cover'
					flex='1'
				/>
			</Flex>
			<Box
				width={{ lg: 'sm' }}
				transform={{ base: 'translateY(-50%)', lg: 'none' }}
				bg={{ base: mode('purple.50', 'gray.700'), lg: 'transparent' }}
				mx={{ base: '6', md: '8', lg: '0' }}
				px={{ base: '6', md: '8', lg: '0' }}
				py={{ base: '6', md: '8', lg: '12' }}>
				<Stack spacing={{ base: '8', lg: '10' }}>
					<Stack spacing={{ base: '2', lg: '4' }}>
						<Flex alignItems='center'>
							<Icon as={BsPhoneFlip} h={12} w={12} color={mode('purple.500', 'yellow.200')} />
							<Text fontSize='4xl' fontWeight='bold'>
								miniBuy
							</Text>
						</Flex>
						<Heading size='xl' fontWeight='normal'>
							Refresh your equipment
						</Heading>
					</Stack>
					<HStack spacing='3'>
						<Link as={ReactLink} to='/products' color={mode('purple.500', 'yellow.200')}>
							Discover now
						</Link>
						<Icon color={mode('purple.500', 'yellow.200')} as={FaArrowRight} />
					</HStack>
				</Stack>
			</Box>
			{/* flex=1 means stretch as far as possible */}
			
		</Stack>
	</Box>
);

export default LandingScreen;
