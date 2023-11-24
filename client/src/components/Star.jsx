import { StarIcon } from '@chakra-ui/icons';


//when we take properties from outside, we use curly braces to cover { rating , star }, 
//you can set default value in case the passed in value doesnt contain any value
const Star = ({ rating = 0, star = 0 }) => (
	<StarIcon color={rating >= star || rating === 0 ? 'purple.500' : 'gray.200'} />
);

export default Star;
