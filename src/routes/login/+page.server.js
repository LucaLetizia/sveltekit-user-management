import { invalid, redirect } from '@sveltejs/kit';
import * as bcrypt from 'bcrypt';
import * as db from '$db/database';
import * as userRepository from '$db/userRepository';

export const load = async ({ locals }) => {
	if (locals.user) {
		throw redirect(302, '/');
	}
};

export const checkPassword = async (password, hash) => {
	const match = await bcrypt.compare(password, hash);
	return match;
};

export const actions = {
	authenticateUser: async ({ cookies, request }) => {
		const formData = await request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		if (!username || !password) {
			return invalid(400, {
				error: true,
				message: 'One or more fields missing',
				username
			});
		}

		const conn = await db.openConnection();
		const user = await userRepository.getUserByUsername(conn, username);

		if (!user) {
			return invalid(400, {
				error: true,
				message: 'Invalid username or password',
				username
			});
		}

		const result = await checkPassword(password, user.password);

		if (!result) {
			return invalid(400, {
				error: true,
				message: 'Invalid username or password',
				username
			});
		}

		await userRepository.updateUser(conn, username, 'auth_token', crypto.randomUUID());
		const userRefreshed = await userRepository.getUserByUsername(conn, username);
		await db.closeConnection(conn);

		cookies.set('session', userRefreshed.auth_token, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			maxAge: 3600
		});

		throw redirect(302, '/');
	}
};
