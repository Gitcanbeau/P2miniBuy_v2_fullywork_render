import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

//Authorization is a request header, commonly use for HTTP Basic Auth. 
//It would be set if the server requested authorization, and the browser then prompted the user for a username/password 
//and sent it (base64-encoded) to the server with a subsequent request. For example:
//Server sends:
//WWW-Authenticate: Basic realm="your server"
//Client sends:
// Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==

const protectRoute = asyncHandler(async (req, res, next) => {
	let token;

	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		try {
			token = req.headers.authorization.split(' ')[1];
			//recall req.headers.authorization.split(' ')[0] is Bearer
			const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
			req.user = await User.findById(decoded.id);

			next(); //this is a middleware, need to move forward to next step, dont forget to put next()
		} catch (error) {
			res.status(401);
			throw new Error('Not authorized, token failed.');
		}
	}

	if (!token) {
		res.status(401);
		throw new Error('Not authorized, no token.');
	}
});

const admin = (req, res, next) => {
	if (req.user && req.user.isAdmin) {
		next();
	} else {
		res.status(401);
		throw new Error();
	}
};

export { protectRoute, admin };
