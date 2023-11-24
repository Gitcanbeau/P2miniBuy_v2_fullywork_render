import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// User entity -> add routes to index.js -> userRoutes
// middleware: sendVerificationEmail, sendPasswordResetEmail
//in app.js add route and component which should show that route
//->userRoutes: provide getUser method communicating with database, getUser route and decide which component will be used
//->store.js
//->userSlices: initialize user property, provide getUser method, export getUser method
//->userActions: provide getUser method communicating with backend
//->loginScreen, emailVerificationScreen, registrationScreen
//->jsx html page

const userSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String },
		active: { type: Boolean, default: false },
		isAdmin: { type: Boolean, default: false },
		firstLogin: { type: Boolean, default: true },
		googleImage: { type: String, default: undefined },
		googleId: { type: String, default: undefined },
	},
	{ timestamps: true }
);

//anonymous async funtion(parameter1){return balabala;}, and the returned value is assigned to userSchema.methods.matchPasswords
userSchema.methods.matchPasswords = async function (enteredPassword) {
	//compared hashed password rather than plain password, return a boolean
	//this.password refers to the pwd in the mongoose compass
	//enteredPassword is the one from the frontend
	return await bcrypt.compare(enteredPassword, this.password);
};

//pre-save hook, do the function before the save action
userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		next();
	}

	//Instead of simply hashing the given password, bcrypt adds a random piece of data, called salt, 
	//to create a unique hash that is almost impossible to break with automated guesses during hash dictionary and brute force attacks.
	//Password salting adds a random string (the salt) to a password before hashing it. This way, the hash generated will always be different each time. 
	//A good value should be high enough to secure the password but also low enough not to slow down the process. 
	//It commonly ranges between 5 and 15. In this tutorial, we will use 10.
	// pass the plain password and the generated salt to the bcrypt.hash() method to hash the password.
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('Userminibuy', userSchema);
//the first arg is the nickName shown in the mongoose compass
//conventionally, the nickName here is Capitalize first character, and this nickname will be shown 'users' in the mongoose compass
//if you called 'Usercoll', then the nickname should be 'usercolls' in the mongoose compass
//you should add the collection with correct nickname in the mongoose compass first, otherwise it cannot fetch data from the mongoose compass

export default User;
