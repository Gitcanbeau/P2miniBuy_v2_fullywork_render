import { Box, Image, Text, Badge, Flex, IconButton, Skeleton, useToast, Tooltip } from '@chakra-ui/react';
//the tooltip lays over component and hovers when you hover over it gives you information.
import { BiExpand } from 'react-icons/bi';
import { TbShoppingCartPlus } from 'react-icons/tb';
import { MdOutlineFavorite, MdOutlineFavoriteBorder } from 'react-icons/md';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link as ReactLink } from 'react-router-dom';
import { addCartItem } from '../redux/actions/cartActions';
import { addToFavorites, removeFromFavorites } from '../redux/actions/productActions';

//ES7+ React/Redux/React-Native snippets
//the above extension allows shortcut to make the initial template of a component
//racfe and tab


//when we take properties from outside, we use curly braces to cover { product, loading }, 
const ProductCard = ({ product, loading }) => {
	const dispatch = useDispatch();
	//useDispatch() method can call the methods provided in action files
	const { favorites } = useSelector((state) => state.product);
	const { cartItems } = useSelector((state) => state.cart);
	//get favorites property in the product state by using useSelector to fetch state from store.js
	//get cartItems property in the cart state by using useSelector to fetch state from store.js
	const [isShown, setIsShown] = useState(false);
	const [cartPlusDisabled, setCartPlusDisabled] = useState(false);
	//provide isShown and cartPlusDisabled constant and their set constants which will be updated
	//provide initial value of these two constants by useState(initial value)
	const toast = useToast();
	//React toasts are lightweight notifications designed to mimic the push notifications 
	//that have been popularized by mobile and desktop operating systems. 
	//They're built with flexbox, so they're easy to align and position.

	useEffect(() => {
		const item = cartItems.find((cartItem) => cartItem.id === product._id);
		if (item && item.qty === product.stock) {
			setCartPlusDisabled(true);
		}
	}, [product, cartItems]);
	//product which is passed into this ProductCard, or cartItems get changed, this component will be re-rendered

	const addItem = (id) => {
		if (cartItems.some((cartItem) => cartItem.id === id)) {
			//some() method return boolean
			//The some() method of Array instances tests whether at least one element in the array passes the test implemented by the provided function.
			const item = cartItems.find((cartItem) => cartItem.id === id);
			dispatch(addCartItem(id, item.qty + 1));
			//use dispatch to call the methods provided in action file
		} else {
			dispatch(addCartItem(id, 1));
		}
		toast({
			description: 'Item has been added.',
			status: 'success',
			isClosable: true,
		});
	};

	return (
		// skeleton is just something like the card border
		<Skeleton isLoaded={!loading}>
			<Box
				_hover={{ transform: 'scale(1.1)', transitionDuration: '0.5s' }}
				// this hover effect makes card box shrink
				// transitionDuration makes this change doesnt happen too fast, which is user friendly
				borderWidth='1px'
				overflow='hidden'
				p='4'
				shadow='md'>

				<Image
					onMouseEnter={() => setIsShown(true)}
					onMouseLeave={() => setIsShown(false)}
					// onMouseEnter hover effect is the React.MouseEventHandler<HTMLImageElement>
					// if we have two pictures, isShown true show second picture, isShown false show first picture
					// so that we can have this hover effect
					src={product.images[isShown && product.images.length === 2 ? 1 : 0]}
					fallbackSrc='https://via.placeholder.com/150'
					alt={product.name}
					height='200px'
				/>

				{/* again, the content in the wrapper div should be covered by curly braces */}
				{product.stock < 5 ? (
					<Badge colorScheme='yellow'>only {product.stock} left</Badge>
				) : product.stock < 1 ? (
					<Badge colorScheme='red'>Sold out</Badge>
				) : (
					<Badge colorScheme='green'>In Stock</Badge>
				)}

				{product.productIsNew && (
					<Badge ml='2' colorScheme='purple'>
						new
					</Badge>
				)}

				{/* product is the thing you pass in this ProductCard component
				stock, productIsNew, brand, subtitle, category, price are the properties defined in Product entity */}
				<Text noOfLines={1} fontSize='xl' fontWeight='semibold' mt='2'>
					{product.brand} {` `} {product.name}
				</Text>
				<Text noOfLines={1} fontSize='md' color='gray.600'>
					{product.subtitle}
				</Text>

				{/* space-between put the items as far as they can be put */}
				<Flex justify='space-between' alignItems='center' mt='2'>
					<Badge colorScheme='purple'>{product.category}</Badge>
					<Text fontSize='xl' fontWeight='semibold' color='purple.600'>
						${product.price}
					</Text>
				</Flex>
	
				<Flex justify='space-between' mt='2'>
					{favorites.includes(product._id) ? (
						<IconButton
							icon={<MdOutlineFavorite size='20px' />}
							colorScheme='purple'
							size='sm'
							onClick={() => dispatch(removeFromFavorites(product._id))}
						/>
					) : (
						<IconButton
							icon={<MdOutlineFavoriteBorder size='20px' />}
							colorScheme='purple'
							size='sm'
							onClick={() => dispatch(addToFavorites(product._id))}
						/>
					)}

					{/* this is a good example to use ProductCard replacing hardcoded template */}
					{/* pass the product into this reusable component, extract the _id property, so that we can direct to the link /product/product._id  */}
					<IconButton
						icon={<BiExpand size='20' />}
						//ChakraUI allows to set the shape of icons
						as={ReactLink}
						to={`/product/${product._id}`}
						//as ReactLink and direct to routeURL
						colorScheme='purple'
						size='sm'
					/>

						{/* tooltip can help show some notice to users, label attribute is the message shown to user */}
						{/* cartPlusDisabled=true, then dont need to show tooltip,  */}
						{/* cartPlusDisabled=false, then need to show tooltip,*/}
						{/* therefore, {!cartPlusDisabled} */}
					<Tooltip
						isDisabled={!cartPlusDisabled}
						hasArrow
						label={
							!cartPlusDisabled
								? 'You reached the maximum quantity jof the product. '
								: product.stock <= 0
								? 'Out of stock'
								: ''
						}>
						<IconButton
							isDisabled={product.stock <= 0 || cartPlusDisabled}
							onClick={() => addItem(product._id)}
							icon={<TbShoppingCartPlus size='20' />}
							colorScheme='purple'
							size='sm'
						/>
					</Tooltip>
				</Flex>
			</Box>
		</Skeleton>
	);
};

export default ProductCard;
