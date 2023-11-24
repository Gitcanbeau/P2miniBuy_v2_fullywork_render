import {
	Box,
	TableContainer,
	Th,
	Tr,
	Table,
	Td,
	Thead,
	Tbody,
	Button,
	useDisclosure,
	Alert,
	Stack,
	Spinner,
	AlertIcon,
	AlertTitle,
	AlertDescription,
	Wrap,
	Text,
	Flex,
	useToast,
} from '@chakra-ui/react';
import { CheckCircleIcon, DeleteIcon } from '@chakra-ui/icons';
import { TbTruckDelivery } from 'react-icons/tb';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrders, deleteOrder, resetErrorAndRemoval, setDelivered } from '../redux/actions/adminActions';
import ConfirmRemovalAlert from './ConfirmRemovalAlert';


const OrdersTab = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const cancelRef = useRef();
	//useRef is a React Hook that lets you reference a value that’s not needed for rendering.
	const [orderToDelete, setOrderToDelete] = useState('');
	const dispatch = useDispatch();
	//use dispatch to call the method in action file
	const { error, loading, orders, deliveredFlag, orderRemoval } = useSelector((state) => state.admin);
	const toast = useToast();
	//convenient to post small notification

	useEffect(() => {
		dispatch(getAllOrders());
		dispatch(resetErrorAndRemoval());
		if (orderRemoval) { 
			//default value from store is false, once the user click the html
			//the setOrderToDelete will save the order-ready-to-delete as const order
			//onOpen will open ConfirmRemovalAlert, and pass in the itemToDelete={orderToDelete} and deleteAction={deleteOrder}
			//in the ConfirmRemovalAlert, it will onClick={onDeleteItem}, which will call dispatch(deleteAction(itemToDelete._id)); 
			//deleteAction here is the deleteOrder in action file
			//the deleteOrder in action file will dispatch orderDelete in slice file
			//orderDelete in slice will set orderRemoval to true
			//because the orderRemoval is changed from false (from store.js) to true (after click), 
			//this component will be re-rendered by useEffect and a truthy orderRemoval will send user the toast
			toast({
				description: 'Order has been removed.',
				status: 'success',
				isClosable: true,
			});
		}

		if (deliveredFlag) {
			//default value from store is false, once the user click the html button openDeleteConfirmBox
			//this component will be re-rendered by useEffect and true orderRemoval will send user the toast
			toast({
				description: 'Order has been set to delivered.',
				status: 'success',
				isClosable: true,
			});
		}
	}, [dispatch, toast, orderRemoval, deliveredFlag]);

	const openDeleteConfirmBox = (order) => {
		setOrderToDelete(order);
		//isOpen default is false, default invisible
		//onOpen change isOpen to true, making the <div> with onOpen attribute to be visible
		onOpen();
	};

	const onSetToDelivered = (order) => {
		dispatch(resetErrorAndRemoval());
		dispatch(setDelivered(order._id));
	};

	return (
		<Box>
			{error && (
				<Alert status='error'>
					<AlertIcon />
					<AlertTitle>Oops!</AlertTitle>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}
			{loading ? (
				<Wrap justify='center'>
					<Stack direction='row' spacing='4'>
						<Spinner mt='20' thickness='2px' speed='0.65s' emptyColor='gray.200' color='purple.500' size='xl' />
					</Stack>
				</Wrap>
			) : (
				<Box>
					<TableContainer>
						<Table variant='simple'>
							<Thead>
								<Tr>
									<Th>Date</Th>
									<Th>Name</Th>
									<Th>Email</Th>
									<Th>Shipping</Th>
									<Th>Items Ordered</Th>
									<Th>Shipping Price</Th>
									<Th>Total</Th>
									<Th>Delivered</Th>
								</Tr>
							</Thead>
							<Tbody>
								{orders &&
									orders.map((order) => (
										<Tr key={order._id}>
											<Td>{new Date(order.createdAt).toDateString()}</Td>
											<Td>{order.username}</Td>
											<Td>{order.email}</Td>
											<Td>
												<Text>
													<i>Address: </i> {order.shippingAddress.address}
												</Text>
												<Text>
													<i>City: </i> {order.shippingAddress.postalCode} {order.shippingAddress.city}
												</Text>
												<Text>
													<i>Country: </i> {order.shippingAddress.country}
												</Text>
											</Td>
											<Td>
												{order.orderItems.map((item) => (
													<Text key={item._id}>
														{item.qty} x {item.name}
													</Text>
												))}
											</Td>
											<Td>${order.shippingPrice}</Td>
											<Td>${order.totalPrice}</Td>
											<Td>{order.isDelivered ? <CheckCircleIcon /> : 'Pending'}</Td>
											<Td>
												<Flex direction='column'>
													<Button variant='outline' onClick={() => openDeleteConfirmBox(order)}>
														<DeleteIcon mr='5px' />
														Remove Order
													</Button>
													{!order.isDelivered && (
														<Button mt='4px' variant='outline' onClick={() => onSetToDelivered(order)}>
															<TbTruckDelivery />
															<Text ml='5px'>Delivered</Text>
														</Button>
													)}
												</Flex>
											</Td>
										</Tr>
									))}
							</Tbody>
						</Table>
					</TableContainer>
					<ConfirmRemovalAlert
						isOpen={isOpen}
						onOpen={onOpen}
						onClose={onClose}
						cancelRef={cancelRef}
						itemToDelete={orderToDelete}
						deleteAction={deleteOrder}
					/>
				</Box>
			)}
		</Box>
	);
};

export default OrdersTab;
