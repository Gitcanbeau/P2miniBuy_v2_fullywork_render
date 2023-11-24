import React from 'react';
import {
	IconButton,
	Box,
	Flex,
	HStack,
	Icon,
	Stack,
	Text,
	useColorModeValue as mode,
	useDisclosure,
	AlertDescription,
	Alert,
	AlertIcon,
	AlertTitle,
	Divider,
	Image,
	Menu,
	MenuButton,
	MenuDivider,
	MenuItem,
	MenuList,
	Spacer,
	useToast,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { TbShoppingCart } from 'react-icons/tb';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';
import { FcGoogle } from 'react-icons/fc';
import { MdOutlineFavorite, MdOutlineFavoriteBorder } from 'react-icons/md';
import { BiUserCheck, BiLogInCircle } from 'react-icons/bi';
import { BsPhoneFlip } from 'react-icons/bs';
import { useEffect, useState } from 'react';
import { Link as ReactLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import NavLink from './NavLink';
import ColorModeToggle from './ColorModeToggle';
import { toggleFavorites } from '../redux/actions/productActions';
import { logout } from '../redux/actions/userActions';
import { googleLogout } from '@react-oauth/google';

const Links = [
	{ name: 'Products', route: '/products' },
	{ name: 'Hot Deals', route: '/hot-deals' },
	{ name: 'Contact', route: '/contact' },
	{ name: 'Services', route: '/services' },
];

const Header = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	//useDisclosure is a custom hook in chakra-ui used to help handle common open, close, or toggle scenarios.
	//opOpen or onClose are callback function to set a falsy/truthy value for the isOpen parameter.
	const dispatch = useDispatch();
	//in redux folder, we have actions folder, dispatch can call these methods even without importing the action files here
	const toast = useToast();
	const { favoritesToggled } = useSelector((state) => state.product); 
	//in redux folder, we have store.js file, we declare several states including product, cart, user, order, admin in the store
	//we use useSelector() method to get the state declared in the redux folder store.js file
	//in the useSelector() method, we will pass in state, return state.product and assign to favoritesToggled const
	//const {} is destructing assignment, the returned value could contain multiple pairs of key-value pair
	//const {abc, ddd} will only get the value of "abc" and "ddd" in the returned value
	// in this Header method, we declare several constants which will be used in the returned html file below
	// here we just declare the initial value of this constant, we could use useEffect() method to update the value of this constant
	const { cartItems } = useSelector((state) => state.cart);
	//get the cart state from the state declared in store.js, and destruct the {cartItems} from the returned value
	const { userInfo } = useSelector((state) => state.user);
	//get the user state from the state declared in store.js, and destruct the {userInfo} from the returned value
	const [showBanner, setShowBanner] = useState(userInfo ? !userInfo.active : false);

	useEffect(() => {
		if (userInfo && !userInfo.active) {
			setShowBanner(true);
		}
	}, [favoritesToggled, dispatch, userInfo]);
	// you dont have to put function in useEffect, once the dependency is changed, the html will re-render
	// if the html contains onClick will call some functions either in this jsx file or in other action file
	// the data shown on this html page will be updated
	// you dont have to finish all the update in useEffect method. useEffect just trigger when the html will be re-render
	//useEffect(()=>{}, [favoritesToggled]) is also okay, it can be empty in the first arg

	const logoutHandler = () => {
		googleLogout();
		dispatch(logout());
		toast({
			description: 'You have been logged out.',
			status: 'success',
			isClosable: 'true',
		});
	};

	return (
		//this empty parent div is necessary, otherwise it will show error
		<> 
			<Box bg={mode(`purple.300`, 'gray.900')} px='4'>
				<Flex h='16' alignItems='center' justifyContent='space-between'>
					<Flex display={{ base: 'flex', md: 'none' }} alignItems='center'>
						<IconButton
							bg='parent'
							size='md'
							icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
							onClick={isOpen ? onClose : onOpen}
							// onClick={functionName(parameter)} //with param
							// onClick={functionName()} //no param
							// onClick={functionName} //save() if no param
							// onClose onOpen are actually functions, so directly call them
							// onClick={onClose}
						/>
						<IconButton
							ml='12'
							position='absolute'
							icon={<TbShoppingCart size='20px' />}
							as={ReactLink}
							to='/cart'
							//as {reactlink} to '/url'
							variant='ghost'
						/>
						{cartItems.length > 0 && (
							<Text fontWeight='bold' fontStyle='italic' position='absolute' ml='74px' mt='-6' fontSize='sm'>
								{cartItems.length}
							</Text>
						)}
					</Flex>
					{/* in the laptop mode, we use HStack to put navbar in a row */}
					{/* in the mobile mode at bottom, we use Stack to put navbar in a column */}
					<HStack spacing='8' alignItems='center'>
						<Box alignItems='center' display='flex' as={ReactLink} to='/'>
							<Icon as={BsPhoneFlip} h='6' w='6' color={mode('black', 'yellow.200')} />
							<Text as='b'>miniBuy</Text>
						</Box>

						<HStack as='nav' spacing='4' display={{ base: 'none', md: 'flex' }}>
							{Links.map((link) => (
								<NavLink route={link.route} key={link.route}>
									<Text fontWeight='medium'>{link.name}</Text>
								</NavLink>
							))}
							<Box>
								<IconButton icon={<TbShoppingCart size='20px' />} as={ReactLink} to='/cart' variant='ghost' />
								{cartItems.length > 0 && (
									<Text fontWeight='bold' fontStyle='italic' position='absolute' ml='26px' mt='-6' fontSize='sm'>
										{cartItems.length}
									</Text>
								)}
							</Box>

							<ColorModeToggle />
							{/* we have this individual component */}

							{/* if already favorite, cancel favorite should use dispatch to change toggleFavorites state as false
							the */}
							{favoritesToggled ? (
								<IconButton
									onClick={() => dispatch(toggleFavorites(false))}
									icon={<MdOutlineFavorite size='20px' />}
									variant='ghost'
								/>
							) : (
								<IconButton
									onClick={() => dispatch(toggleFavorites(true))}
									icon={<MdOutlineFavoriteBorder size='20px' />}
									variant='ghost'
								/>
							)}
						</HStack>
					</HStack>

					<Flex alignItems='center'>
						{userInfo ? (
							<Menu>
								<MenuButton rounded='full' variant='link' cursor='pointer' minW='0'>
									<HStack>
										{userInfo.googleImage ? (
											<Image
												borderRadius='full'
												boxSize='40px'
												src={userInfo.googleImage}
												referrerPolicy='no-referrer'
											/>
										) : (
											<BiUserCheck size='30' />
										)}

										<ChevronDownIcon />
									</HStack>
								</MenuButton>
								<MenuList>
									<HStack>
										<Text pl='3' as='i'>
											{userInfo.email}
										</Text>
										{userInfo.googleId && <FcGoogle />}
									</HStack>
									<Divider py='1' />
									<MenuItem as={ReactLink} to='/order-history'>
										Order History
									</MenuItem>
									<MenuItem as={ReactLink} to='/profile'>
										Profile
									</MenuItem>
									{userInfo.isAdmin && (
										<>
											<MenuDivider />
											<MenuItem as={ReactLink} to='/admin-console'>
												<MdOutlineAdminPanelSettings />
												<Text ml='2'>Admin Console</Text>
											</MenuItem>
										</>
									)}
									<MenuDivider />
									<MenuItem onClick={logoutHandler}>Logout</MenuItem>
									{/*because we dont need to pass any parameter to logoutHandler, then just call its name */}
									{/* but put the parenthesis is also good */}
									{/* onClick={someFcntion} */}
									{/* onClick={someFcntion()} */}
									{/* onClick={someFcntion(someParameter)} */}
									{/* onClick={dispatch(someFcntion(someParameter))} */}
								</MenuList>
							</Menu>
						) : (
							<Menu>
								<MenuButton as={IconButton} variant='ghost' cursor='pointer' icon={<BiLogInCircle size='25px' />} />
								<MenuList>
									<MenuItem as={ReactLink} to='/login' p='2' fontWeight='400' variant='link'>
										Sign in
									</MenuItem>
									<MenuDivider />
									<MenuItem as={ReactLink} to='/registration' p='2' fontWeight='400' variant='link'>
										Sign up
									</MenuItem>
								</MenuList>
							</Menu>
						)}
					</Flex>
				</Flex>

				{/* below is the mobile mode, if isOpen is true */}
				<Box display='flex'>
					{isOpen && (
						<Box pb='4' display={{ md: 'none' }}>
							<Stack as='nav' spacing='4'>
								{Links.map((link) => (
									<NavLink route={link.route} key={link.route}>
										<Text fontWeight='medium'>{link.name}</Text>
									</NavLink>
								))}
							</Stack>
							{favoritesToggled ? (
								<IconButton
									onClick={() => dispatch(toggleFavorites(false))}
									icon={<MdOutlineFavorite size='20px' />}
									variant='ghost'
								/>
							) : (
								<IconButton
									onClick={() => dispatch(toggleFavorites(true))}
									icon={<MdOutlineFavoriteBorder size='20px' />}
									variant='ghost'
								/>
							)}
							<ColorModeToggle />
						</Box>
					)}
				</Box>
			</Box>


			{/* below is banner notificaion */}
			{userInfo && !userInfo.active && showBanner && (
				<Box>
					<Alert status='warning'>
						<AlertIcon />
						<AlertTitle>Email not verified!</AlertTitle>
						<AlertDescription>You must verify your email address.</AlertDescription>
						<Spacer />
						<CloseIcon cursor={'pointer'} onClick={() => setShowBanner(false)} />
						{/* onClick={functionName()} */}
						{/*  or save the () because we dont need to pass any parameter, onClick={functionName} */}
						{/* const functionName= ()=>{setShowBanner(false)} */}
					</Alert>
				</Box>
			)}
		</>
	);
};

export default Header;
