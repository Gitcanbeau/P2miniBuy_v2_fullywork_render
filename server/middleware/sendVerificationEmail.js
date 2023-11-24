import nodemailer from 'nodemailer';
// vnch hliv npcv divl
// benstechlines1@gmail.com
export const sendVerificationEmail = (token, email, name) => {
	const html = `
    <html>
        <body>
            <h3>Dear ${name}</h3>
            <p>Thanks for signing up at miniBuy!</p>
            <p>Use the link below to verify your email</p>
            <a href="http://localhost:3000/email-verify/${token}">Click here!</a>
        </body>
    </html>
    `;

	//https://myaccount.google.com/u/3/apppasswords?rapt=AEjHL4PHreFm7LodUCFbnMPJQyWO8Bdc5pYEFQiQSjyBe483bzUjqRSJHfPxQpbFO2qzusswtvn67C-KRhf6ZcTDKkRQ8S6zP2J64MIM7dkjBQpd-ESkWWw
	//search google app passwords
	//app name: miniBuy
	//create a specific password for this app: vjqd cwfy sxql urkp

	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'canw2336@gmail.com',
			// pass: 'vnch hliv npcv divl',
			pass: 'vjqd cwfy sxql urkp',
		},
	});

	const mailOptions = {
		from: 'canw2336@gmail.com',
		to: email,
		subject: 'Verify your email address of miniBuy',
		html: html,
	};

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log(`Email send to ${email}`);
			console.log(info.response);
		}
	});
};
