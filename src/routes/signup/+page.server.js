import { invalid, redirect } from '@sveltejs/kit';
import * as bcrypt from 'bcrypt';
import * as db from '$db/database';
import * as userRepository from '$db/userRepository';

export const load = async ({ locals }) => {
	if (locals.user) {
		throw redirect(302, '/');
	}
};

export const hashPassword = async (password) => {
	const saltRounds = 10;
	const hashedPassword = await bcrypt.hash(password, saltRounds);
	return hashedPassword;
};

export const actions = {
	createUser: async ({ request }) => {
		const formData = await request.formData();
		const username = formData.get('username');
		const password = formData.get('password');
		const repeatPassword = formData.get('repeat-password');

		if (!username || !password | !repeatPassword) {
			return invalid(400, {
				error: true,
				message: 'One or more fields missing',
				username
			});
		}

		if (password !== repeatPassword) {
			return invalid(400, {
				error: true,
				message: 'Passwords do not match',
				username
			});
		}

		const hashedPassword = await hashPassword(password);
		if (!hashedPassword) {
			return invalid(400, {
				error: true,
				message: 'Something went wrong, please try again',
				username
			});
		}

		const authToken = crypto.randomUUID();

		const conn = await db.openConnection();
		const result = await userRepository.createUser(conn, username, hashedPassword, authToken);
		await db.closeConnection(conn);

		if (result?.message === 'User Created') {
			return { success: true, message: 'Account created, you can now Log In!' };
		} else {
			let errorMessage = 'Something went wrong, please try again';
			if (result?.error) errorMessage = `Username ${username} already in use`;
			return invalid(400, {
				error: true,
				message: errorMessage,
				username
			});
		}
	}
};
