import { Alert, AlertTitle, AlertIcon, AlertDescription, Box, Button, Center, Wrap, WrapItem } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../redux/actions/productActions';

//we installed concurrently in the dependencies which allows frontend and backend run together
//add scripts in outer most package.json file
//"client": "concurrently npm    \"npm run server\"    \"npm run client\"    "
//npm run client will start calling both commands above

//when running npm start, error message talks about babel thing, just add it into devDependencies in the outer most package.json file
//"devDependencies": {
//     "@babel/plugin-proposal-private-property-in-object": "^7.21.11"
//}

// in productsScreen, we pass down data to our productCard to render data on the screen.
// However, when the productCard would change the data or it would update the data in the productCard itself, the productsScreen would not notice.
// For example, if you pass down data and you changing the stock or the amounts, it might be that the productCard is changing the amount, but the productsScreen doesn't know.
// And if the productsScreen talks to the database, things can get very messy and the data would be displayed on the screen incorrectly.
// So this is where Redux comes in.
// It's probably the best sidekick of react, because Redux is our frontend database taking care of the state of the data.

//create redux folder under src folder
//create store.js file, actions folder, slices folder under redux folder

const ProductsScreen = () => {
	const dispatch = useDispatch();
	//useDispatch() method can call the methods provided in action files
	const { loading, error, products, pagination, favoritesToggled } = useSelector((state) => state.product);
	//in redux folder, we have store.js file, we declare several states including product, cart, user, order, admin in the store
	//we use useSelector() method to get the state declared in the redux folder store.js file
	//in the useSelector() method, we will pass in state, return state.product and assign to favoritesToggled const
	//const {} is destructing assignment, the returned value could contain multiple pairs of key-value pair
	//const {abc, ddd} will only get the value of "abc" and "ddd" in the returned value
	// in this ProductScreen method, we declare several constants which will be used in the returned html file below
	// here we just declare the initial value of this constant, we could use useEffect() method to update the value of this constant
	
	useEffect(() => {
		dispatch(getProducts(1));
	}, [dispatch]);
	//every single time when you use the dispatch method (which is also the useDispatch() method), this component will be reloaded
	//and since you call dispatch(getProducts()) method inside useEffect() method, this method will be recalled and this component will be updated and reploaded

	const paginationButtonClick = (page) => {
		dispatch(getProducts(page));
	};

	//when we use axios.get('api/products').then((response)=>{setData(response.data.products)});
	//actually the url doesnt know which port of localhost it should go to
	//we can define this in package.json file, you can set the proxy to let the axios where to go
	//"proxy": "http://localhost:4036",

	return (
		// this empty div is necessary
		<>
			{products.length >= 1 && (
				<Box>
					{/* Wrap is just something like Flex */}
					{/* in each wrapper div, use {} to cover the content */}
					<Wrap spacing='30px' justify='center' minHeight='80vh' mx={{ base: '12', md: '20', lg: '32' }}>
						{error ? (
							<Alert status='error'>
								<AlertIcon />
								<AlertTitle>We are sorry!</AlertTitle>
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						) : (
							// products is the const we defined and extracted from the product state
							// use the map method to pass each item to ProductCard component
							// map method will always return an array
							//map(()=>(use parenthesis here rather than curly braces because we return a html page rather than function));
							products.map((product) => (
								<WrapItem key={product._id}>
									{/* Center component simply make everything at center */}
									<Center w='250px' h='450px'>
										<ProductCard product={product} loading={loading} />
										{/* the product and loading are the required parameters in ProductCard component*/}
									</Center>
								</WrapItem>
							))
						)}
					</Wrap>
					{!favoritesToggled && (
						<Wrap spacing='10px' justify='center' p='5'>
							<Button colorScheme='purple' onClick={() => paginationButtonClick(1)}>
								<ArrowLeftIcon />
							</Button>
							{Array.from(Array(pagination.totalPages), (e, i) => {
								return (
									<Button
										colorScheme={pagination.currentPage === i + 1 ? 'purple' : 'gray'}
										key={i}
										onClick={() => paginationButtonClick(i + 1)}>
										{i + 1}
									</Button>
								);
							})}
							<Button colorScheme='purple' onClick={() => paginationButtonClick(pagination.totalPages)}>
								<ArrowRightIcon />
							</Button>
						</Wrap>
					)}
				</Box>
			)}
		</>
	);
};

export default ProductsScreen;
