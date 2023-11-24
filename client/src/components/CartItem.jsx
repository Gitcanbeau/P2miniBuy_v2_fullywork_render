import { CloseButton, Flex, Image, Select, Spacer, Text, VStack, useColorModeValue as mode } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { addCartItem, removeCartItem } from '../redux/actions/cartActions';

//story
//we dont have a backend route to request cart info from database, because cart-related info (especially the qty) is just temporary
//we only need to take advantage of localStorage
//user click addItem button in html, will call the addItem method in html, will use dispatch call addCartItem method in action file, will use dispatch call cartItemAdd in slice file
//slice file update localStorage and update the states in store.js
//the html will use useSelector to read the states in store.js
//once the button is hit, the setProperty or other constant will change, the useEffect will re-render the html
//hence a cycle is formed, the effect from html (click button) will affect back to html (re-render), during this cycle, the states in store.js are also updated
const CartItem = ({ cartItem }) => {
	const { name, image, price, stock, qty, id, brand } = cartItem;
	//deconstruct " name, image, price, stock, qty, id, brand " from cartItem
	//this passed in {cartItem} is from CartScreen page and is fetched from the states in store.js
	//the cartItem in slice file is only declared as an array, however, this cartItem in action file has declared "name, image, price, stock, qty, id, brand, etc"
	//so these
	const dispatch = useDispatch();

	return (
		<Flex minWidth='300px' borderWidth='1px' rounded='lg' align='center'>
			<Image rounded='lg' w='120px' h='120px' fit='cover' src={image} fallbackSrc='https://via.placeholder.com/150' />
			<VStack p='2' w='100%' spacing='4' align='stretch'>
				<Flex alignItems='center' justify='space-between'>
					<Text fontWeight='medium'>
						{brand} {name}
					</Text>
					<Spacer />
					<CloseButton onClick={() => dispatch(removeCartItem(id))} />
					{/*   you can make a const method above the return part, for example, const fcnremove=(id)=>{dispatch(removeCartItem(id))}  */}
					{/*   and in this html, just put onClick={()=>fcnremove(id)}   */}
					{/*   because this fcnremove is quite short, you can directly    onClick={() => dispatch(removeCartItem(id))}    */}
				</Flex>
				<Spacer />
				<Flex alignItems='center' justify='space-between'>
					<Select
						maxW='68px'
						focusBorderColor={mode('purple.500', 'purple.200')}
						value={qty}
						onChange={(e) => {
							dispatch(addCartItem(id, e.target.value));
						}}>
						{[...Array(stock).keys()].map((item) => (
							<option key={item + 1} value={item + 1}>
								{item + 1}
							</option>
						))}
					</Select>
					<Text fontWeight='bold'>${price}</Text>
				</Flex>
			</VStack>
		</Flex>
	);
};

export default CartItem;
