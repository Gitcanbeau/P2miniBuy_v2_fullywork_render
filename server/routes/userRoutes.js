import express from 'express';
import Userminibuy from '../models/User.js';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { sendVerificationEmail } from '../middleware/sendVerificationEmail.js';
import { sendPasswordResetEmail } from '../middleware/sendPasswordResetEmail.js';
import { protectRoute, admin } from '../middleware/authMiddleware.js';
import Orderminibuy from '../models/Order.js';

// ----------------------------------------------------------------------------
// Without express-async-handler

// express.get('/',(req, res, next) => {
//     foo.findAll()
//     .then ( bar => {
//        res.send(bar)
//      } )
//     .catch(next); // error passed on to the error handling route
// })

// with express-async-handler,
// you dont need to write catch error so you can save some space and time

// const asyncHandler = require('express-async-handler')

// express.get('/', asyncHandler(async (req, res, next) => {
// 	const bar = await foo.findAll();
// 	res.send(bar)
// }))

// ----------------------------------------------------------------------------
const userRoutes = express.Router();
//every entityRoutes file starts from express.Router() method, so that it can chain with .route('url').get/put/post/delete(method); at the end

//TODO: redefine expiresIn
const genToken = (id) => {
	//jwt syntax, pass {payload obj}, secret and [option] to the jqt.sign() method
	return jwt.sign({ id }, process.env.TOKEN_SECRET, { expiresIn: '1d' });
};

// login
//format 1
// const loginUser = asyncHandler();
//format 2
//if we save declaration above return keyword, we can save the return keyword and curly braces, just use ()
// const loginUser = asyncHandler(   async (req, res) => (html block)   );
//however, because await keyword is just something like return, so you still need to use curly braces
// const loginUser = asyncHandler(async (req, res) => { await something} );
//format 3
// const loginUser = asyncHandler(async (req, res) => {
// 	const user = await User.findOne({ email });
// 	bunch of code using await to receive promise;
// });
const loginUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	//destruct from req.body, req.body is in a JSON format
	//review: you can use req.params to extract that param info if you have that param in the url

	const user = await Userminibuy.findOne({ email });
	//mongoose model provide find,findOne, findById method, you need to pass in an object, JSON format object is preferably
	//const user = await User.findOne({ email: email, age: {$gte:5} });

	if (user && (await user.matchPasswords(password))) {
		user.firstLogin = false;
		await user.save();
		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			googleImage: user.googleImage,
			goodleId: user.googleId,
			isAdmin: user.isAdmin,
			token: genToken(user._id),
			active: user.active,
			firstLogin: user.firstLogin,
			created: user.createdAt,
		});
	} else {
		res.status(401).send('Invalid Email or Password.');
		throw new Error('User not found.');
	}
});

// register
const registerUser = asyncHandler(async (req, res) => {
	const { name, email, password } = req.body;

	const userExists = await Userminibuy.findOne({ email });
	if (userExists) {
		res.status(400).send('We already have an account with that email address.');
	}

	const user = await Userminibuy.create({
		name,
		email,
		password,
	});

	const newToken = genToken(user._id);

	sendVerificationEmail(newToken, email, name);

	if (user) {
		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			googleImage: user.googleImage,
			googleId: user.googleId,
			firstLogin: user.firstLogin,
			isAdmin: user.isAdmin,
			token: newToken,
			active: user.active,
			createdAt: user.createdAt,
		});
	} else {
		res.status(400).send('We could not register you.');
		throw new Error('Something went wrong. Please check your information and try again.');
	}
});

// verify email
const verifyEmail = asyncHandler(async (req, res) => {
	const user = req.user;
	user.active = true;
	await user.save();
	res.json('Thanks for activating your account. You can close this window now.');
});

// password reset request
const passwordResetRequest = asyncHandler(async (req, res) => {
	const { email } = req.body;
	try {
		const user = await Userminibuy.findOne({ email: email });
		if (user) {
			const newToken = genToken(user._id);
			sendPasswordResetEmail(newToken, user.email, user.name);
			res.status(200).send(`We have send you a recover email to ${email}`);
		}
	} catch (error) {
		res.status(401).send('There is not account with such an email address');
	}
});

// password reset
const passwordReset = asyncHandler(async (req, res) => {
	const token = req.headers.authorization.split(' ')[1];
	try {
		const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
		const user = await Userminibuy.findById(decoded.id);

		if (user) {
			user.password = req.body.password;
			await user.save();
			res.json('Your password has been updated successfully.');
		} else {
			res.status(404).send('User not found.');
		}
	} catch (error) {
		res.status(401).send('Password reset failed.');
	}
});

//google login
//https://cloud.google.com/cloud-console
//->enable APIs & services -> create new projects 
//->OAuth consent screen -> choose external user type -> provide app name and my 2336 email address
//->credentials -> select create oauth client id -> select web application -> add uri http://localhost:3000
//clientID:993745313743-akuc9vpqdebtvduv6mdrt1vfihkgp8ts.apps.googleusercontent.com
//clientSecrest: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
//
const googleLogin = asyncHandler(async (req, res) => {
	const { googleId, email, name, googleImage } = req.body;
	// console.log(googleId, email, name, googleImage);

	try {
		const user = await Userminibuy.findOne({ googleId: googleId });
		if (user) {
			user.firstLogin = false;
			await user.save();
			res.json({
				_id: user._id,
				name: user.name,
				email: user.email,
				googleImage: user.googleImage,
				googleId: user.googleId,
				firstLogin: user.firstLogin,
				isAdmin: user.isAdmin,
				token: genToken(user._id),
				active: user.active,
				createdAt: user.createdAt,
			});
		} else {
			const newUser = await User.create({
				name,
				email,
				googleImage,
				googleId,
			});

			const newToken = genToken(newUser._id);

			sendVerificationEmail(newToken, newUser.email, newUser.name);
			res.json({
				_id: newUser._id,
				name: newUser.name,
				email: newUser.email,
				googleImage: newUser.googleImage,
				googleId: newUser.googleId,
				firstLogin: newUser.firstLogin,
				isAdmin: newUser.isAdmin,
				// token: genToken(newUser._id),
				token: newToken,
				active: newUser.active,
				createdAt: newUser.createdAt,
			});
		}
	} catch (error) {
		res.status(404).send('Something went wrong, please try again later.');
	}
});

const getUserOrders = asyncHandler(async (req, res) => {
	const orders = await Orderminibuy.find({ user: req.params.id });
	if (orders) {
		res.json(orders);
	} else {
		res.status(404).send('No orders could be found.');
		throw new Error('No Orders found.');
	}
});

const getUsers = asyncHandler(async (req, res) => {
	const users = await Userminibuy.find({});
	res.json(users);
});

const deleteUser = asyncHandler(async (req, res) => {
	try {
		const user = await Userminibuy.findByIdAndRemove(req.params.id);
		res.json(user);
	} catch (error) {
		res.status(404).send('This user could not be found.');
		throw new Error('This user could not be found.');
	}
});

userRoutes.route('/login').post(loginUser);
userRoutes.route('/register').post(registerUser);
userRoutes.route('/verify-email').get(protectRoute, verifyEmail);
//Okay, so at the moment this verify email is just can be accessed when the user is logged in.
//recall when the user logged in, a token will be generated with {id}, process.env.TOKEN_SECRET and expiring option
//with that token, we can use the protectRoute
//in other cases having token, we can also use protectRoute
userRoutes.route('/password-reset-request').post(passwordResetRequest);
userRoutes.route('/password-reset').post(protectRoute, passwordReset);
userRoutes.route('/google-login').post(googleLogin);
userRoutes.route('/:id').get(protectRoute, getUserOrders);
userRoutes.route('/').get(protectRoute, admin, getUsers);
userRoutes.route('/:id').delete(protectRoute, admin, deleteUser);

export default userRoutes;
