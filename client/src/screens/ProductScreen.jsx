import {
	Alert,
	AlertDescription,
	AlertIcon,
	AlertTitle,
	Badge,
	Box,
	Button,
	Flex,
	HStack,
	Heading,
	Image,
	SimpleGrid,
	Spinner,
	Stack,
	Text,
	Wrap,
	useToast,
	Textarea,
	Input,
	Tooltip,
} from '@chakra-ui/react';
import { MinusIcon, SmallAddIcon } from '@chakra-ui/icons';
import { BiCheckShield, BiPackage, BiSupport } from 'react-icons/bi';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getProduct } from '../redux/actions/productActions';
import { createProductReview } from '../redux/actions/productActions';
import { addCartItem } from '../redux/actions/cartActions';
import Star from '../components/Star';


const ProductScreen = () => {
	
	const { id } = useParams(); //get id from url
	const dispatch = useDispatch(); //useDispatch() allows to call methods in action files
	const { loading, error, product, reviewed } = useSelector((state) => state.product);
	const { cartItems } = useSelector((state) => state.cart);
	const { userInfo } = useSelector((state) => state.user);
	//useSelector() allows to get state from store.js
	//product state contains lots of properties, but we only need "loading, error, product, reviewed " here, so destruction assignment
	//cart state contains lots of properties, but we only need "cartItems " here, so destruction assignment
	//user state contains lots of properties, but we only need "userInfo " here, so destruction assignment
	const toast = useToast();

	const [amount, setAmount] = useState(1);
	const [comment, setComment] = useState('');
	const [rating, setRating] = useState(1);
	const [title, setTitle] = useState('');
	const [reviewBoxOpen, setReviewBoxOpen] = useState(false);
	const [buttonLoading, setButtonLoading] = useState(false);
	//make use of useState() method to set initial value of the first parameter of the const array[]

	useEffect(() => {
		dispatch(getProduct(id));
		setReviewBoxOpen(false);

		if (reviewed) {
			toast({
				description: 'Product review saved.',
				status: 'success',
				isClosable: 'true',
			});
			setReviewBoxOpen(false);
		}
	}, [dispatch, id, toast, reviewed]);
	//useEffect(()=>{},[])
	//once dispatch is called, once the id from URL from useParams() method is changed, this component will be re-render
	//same for toast, reviewed

	//the logic to prepare component is below:
	//onClick={()=>changeAmount('plus')} will call the method here
	//user click button to changeAmount -> setAmount is updated -> prepare const[amount, setAmount] by useState()
	const changeAmount = (input) => {
		if (input === 'plus') {
			setAmount(amount + 1);
		}
		if (input === 'minus') {
			setAmount(amount - 1);
		}
	};

	const addItem = () => {
		if (cartItems.some((cartItem) => cartItem.id === id)) {
			cartItems.find((cartItem) => cartItem.id === id);
			dispatch(addCartItem(id, amount));
		} else {
			dispatch(addCartItem(id, amount));
		}
		toast({
			description: 'Item has been added.',
			status: 'success',
			isClosable: true,
		});
	};

	const hasUserReviewed = () => product.reviews.some((item) => item.user === userInfo._id);
	//The some() method of Array instances tests whether at least one element in the array passes the test implemented by the provided function. It returns true if, in the array, it finds an element 
	//for which the provided function returns true; otherwise it returns false. It doesn't modify the array.
	const onSubmit = () => {
		setButtonLoading(true);
		dispatch(createProductReview(product._id, userInfo._id, comment, rating, title));
	};

	return (
		<Wrap spacing='30px' justify='center' minHeight='100vh'>
			{loading ? (
				<Stack direction='row' spacing='4'>
					<Spinner mt='20' thickness='2px' speed='0.65s' emptyColor='gray.200' color='purple.500' size='xl' />
				</Stack>
			) : error ? (
				<Alert status='error'>
					<AlertIcon />
					<AlertTitle>We are sorry!</AlertTitle>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			) : (
				product && (
					<Box
						maxW={{ base: '3xl', lg: '5xl' }}
						mx='auto'
						px={{ base: '4', md: '8', lg: '12' }}
						py={{ base: '6', md: '8', lg: '12' }}>
						<Stack direction={{ base: 'column', lg: 'row' }} align='flex-start'>
							<Stack pr={{ base: '0', md: 'row' }} flex='1.5' mb={{ base: '12', md: 'none' }}>
								{product.productIsNew && (
									<Badge p='2' rounded='md' w='50px' fontSize='0.8em' colorScheme='green'>
										New
									</Badge>
								)}
								{product.stock === 0 && (
									<Badge rounded='full' w='70px' fontSize='0.8em' colorScheme='red'>
										sold out
									</Badge>
								)}
								<Heading fontSize='2xl' fontWeight='extrabold'>
									{product.brand} {product.name}
								</Heading>
								<Stack spacing='5'>
									<Box>
										<Text fontSize='xl'>${product.price}</Text>
										<Flex>
											<HStack spacing='2px'>
												<Star color='purple.500' />
												<Star rating={product.rating} star={2} />
												<Star rating={product.rating} star={3} />
												<Star rating={product.rating} star={4} />
												<Star rating={product.rating} star={5} />
											</HStack>
											<Text fontSize='md' fontWeight='bold' ml='4px'>
												{product.numberOfReviews} Reviews
											</Text>
										</Flex>
									</Box>
									<Text>{product.subtitle}</Text>
									<Text>{product.description}</Text>
									<Text fontWeight='bold'>Quantity</Text>
									<Flex w='170px' p='5px' border='1px' borderColor='gray.200' alignItems='center'>
										<Button isDisabled={amount <= 1} onClick={() => changeAmount('minus')}>
											{/* use isDisabled to make sure the amount is in the reasonable range */}
											<MinusIcon />
										</Button>
										<Text mx='30px'>{amount}</Text>
										<Button isDisabled={amount >= product.stock} onClick={() => changeAmount('plus')}>
											<SmallAddIcon />
										</Button>
									</Flex>
									<Badge fontSize='lg' width='170px' textAlign='center' colorScheme='gray'>
										In Stock: {product.stock}
									</Badge>
									<Button
										variant='outline'
										isDisabled={product.stock === 0}
										colorScheme='purple'
										onClick={() => addItem()}>
										Add to cart
									</Button>
									<Stack width='270px'>
										<Flex alignItems='center'>
											<BiPackage size='20px' />
											<Text fontWeight='medium' fontSize='sm' ml='2'>
												Shipped in 2 - 3 days
											</Text>
										</Flex>
										<Flex alignItems='center'>
											<BiCheckShield size='20px' />
											<Text fontWeight='medium' fontSize='sm' ml='2'>
												2 year extended warranty
											</Text>
										</Flex>
										<Flex alignItems='center'>
											<BiSupport size='20px' />
											<Text fontWeight='medium' fontSize='sm' ml='2'>
												We're here for you 24/7
											</Text>
										</Flex>
									</Stack>
								</Stack>
							</Stack>
							<Flex 
								direction='column' 
								align='center' 
								flex='1' 
								//if it is dark mode, then use this color as bg
								_dark={{ bg: 'gray.900' }}>
								<Image
									mb='30px'
									src={product.images[0]}
									alt={product.name}
									fallbackSrc='https://via.placeholder.com/250'
								/>
								<Image
									mb='30px'
									src={product.images[1]}
									alt={product.name}
									fallbackSrc='https://via.placeholder.com/250'
								/>
							</Flex>
						</Stack>
						{/* Text is stacking */}
						{/* Stack default direction is column */}
						{/* Flex default direction is row, but you can set direction as column, something like Stack but can shrink */}
						{/* Stack contain Stack(descriptions) and Flex(2 pictures) */}
						{/* so the height of Flex(2 pictures) and Stack(descriptions) is same */}
						{/* use Flex to contain pictures is for the purpose of shrink */}

						{/* the content within the wrapper div should be covered by curly braces */}
						{/* if the contect needs to $$ with another wrapper div, it should be in the parenthesis, then put an empty div */}
						{userInfo && (
							<>
								<Tooltip label={hasUserReviewed() && 'you have already reviewed this product.'} fontSize='medium'>
									<Button
										isDisabled={hasUserReviewed()}
										//if user has reviewed, then isDisabled=true, then this button cannot be clicked
										my='20px'
										w='140px'
										colorScheme='purple'
										// onClick={functionName(parameter)}
										//const functionName=()=>{setReviewBoxOpen(!reviewBoxOpen)}
										onClick={() => setReviewBoxOpen(!reviewBoxOpen)}>
										Write a review
									</Button>
								</Tooltip>
								{reviewBoxOpen && (
									<Stack mb='20px'>
										<Wrap>
											<HStack spacing='2px'>
												<Button variant='outline' onClick={() => setRating(1)}>
													<Star />
												</Button>
												{/* the Star component that we provided in components folder can accept rating and star, 
												it will dynamically show the purple color of star if the star >=rating.
												from the results, the first three star will be purple when you move your cursor to the third star.
												if without this component, the thrid star will be the only one being purple when you move your cursor to the third star */}
												<Button variant='outline' onClick={() => setRating(2)}>
													<Star rating={rating} star={2} />
												</Button>
												<Button variant='outline' onClick={() => setRating(3)}>
													<Star rating={rating} star={3} />
												</Button>
												<Button variant='outline' onClick={() => setRating(4)}>
													<Star rating={rating} star={4} />
												</Button>
												<Button variant='outline' onClick={() => setRating(5)}>
													<Star rating={rating} star={5} />
												</Button>
											</HStack>
										</Wrap>
										<Input
											onChange={(e) => {
												setTitle(e.target.value);
											}}
											placeholder='Review title (optional)'
										/>
										<Textarea
											onChange={(e) => {
												setComment(e.target.value);
											}}
											placeholder={`The ${product.brand} ${product.name} is...`}
											// all the content/value of attributes in the wrapper div should be covered by curly braces
											//placeholder={}
											//rating={}
										/>
										<Button
											isLoading={buttonLoading}
											loadingText='Saving'
											w='140px'
											colorScheme='purple'
											onClick={() => onSubmit()}>
											Publish review
										</Button>
									</Stack>
								)}
							</>
						)}


						<Stack>
							<Text fontSize='xl' fontWeight='bold'>
								Reviews
							</Text>
							<SimpleGrid minChildWidth='300px' spacingX='40px' spacingY='20px'>
								{product.reviews.map((review) => (
									<Box key={review._id}>
										<Flex spcaing='2px' alignItems='center'>
											<Star color='purple.500' />
											<Star rating={product.rating} star={2} />
											<Star rating={product.rating} star={3} />
											<Star rating={product.rating} star={4} />
											<Star rating={product.rating} star={5} />
											<Text fontWeight='semibold' ml='4px'>
												{review.title && review.title}
											</Text>
										</Flex>
										<Box py='12px'>{review.comment}</Box>
										<Text fontSize='sm' color='gray.400'>
											by {review.name}, {new Date(review.createdAt).toDateString()}
										</Text>
									</Box>
								))}
							</SimpleGrid>
						</Stack>
					</Box>
				)
			)}
		</Wrap>
	);
};

export default ProductScreen;
