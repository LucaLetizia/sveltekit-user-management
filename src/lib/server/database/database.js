import { verbose } from 'sqlite3';

const tableList = [
	`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT NOT NULL, password TEXT NOT NULL, auth_token TEXT NOT NULL)`
];

const sqlite3 = verbose();
export const openConnection = async () => {
	return new Promise((resolve, reject) => {
		const db = new sqlite3.Database(
			'./src/lib/server/database/database.db',
			sqlite3.OPEN_READWRITE,
			(err) => {
				if (err) {
					reject({ error: err.message });
				} else {
					resolve(db);
				}
			}
		);
	});
};

export const initDatabase = async (conn) => {
	const promises = [];
	//iterate through table list and create every table as follows
	tableList.forEach((table) => {
		const tablePromise = new Promise((resolve, reject) => {
			conn.run(table, (err) => {
				if (err) {
					reject({ error: err.message });
				} else {
					const sqlArr = table.split(' ');
					resolve({ message: `Table ${sqlArr[5]} created` });
				}
			});
		});
		promises.push(tablePromise);
	});

	return Promise.all(promises).then((results) => {
		return results;
	});
};

export const closeConnection = async (conn) => {
	return new Promise((resolve, reject) => {
		conn.close((err) => {
			if (err) {
				reject({ error: err.message });
			} else {
				resolve({ message: 'Connection closed successfully!' });
			}
		});
	});
};
