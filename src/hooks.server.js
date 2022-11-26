import * as db from '$db/database';
import * as userRepository from '$db/userRepository';
import * as fs from 'fs';

const dbPath = './src/lib/server/database/database.db';
const initConnection = async () => {
	try {
		const connection = await db.openConnection();
		console.log(await db.initDatabase(connection));
		await db.closeConnection(connection);
	} catch (ex) {
		if (ex.error.includes('SQLITE_CANTOPEN')) {
			fs.open(dbPath, 'w+', (err) => {
				if (err) return console.log(err);
			});
			return initConnection();
		}
		console.log(ex.error);
	}
};
initConnection();

export const handle = async ({ event, resolve }) => {
	const session = event.cookies.get('session');

	if (!session) return await resolve(event);

	const conn = await db.openConnection();
	const user = await userRepository.getUserByToken(conn, session);
	await db.closeConnection(conn);

	if (user) {
		event.locals.user = {
			username: user.username
		};
	}

	return await resolve(event);
};
