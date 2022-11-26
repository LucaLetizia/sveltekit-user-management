const userFields = ['id', 'username', 'password', 'auth_token'];

export const getUsers = async (conn) => {
	const sql = `SELECT * FROM users`;
	return new Promise((resolve, reject) => {
		conn.all(sql, [], (err, rows) => {
			if (err) {
				reject({ error: err.message });
			} else {
				resolve(rows ? rows : null);
			}
		});
	});
};

export const getUserById = async (conn, userId) => {
	const sql = `SELECT * FROM users WHERE id = ?`;
	return new Promise((resolve, reject) => {
		conn.get(sql, [userId], (err, row) => {
			if (err) {
				reject({ error: err.message });
			} else {
				resolve(row ? row : null);
			}
		});
	});
};

export const getUserByUsername = async (conn, username) => {
	const sql = `SELECT * FROM users WHERE username = ?`;
	return new Promise((resolve, reject) => {
		conn.get(sql, [username], (err, row) => {
			if (err) {
				reject({ error: err.message });
			} else {
				resolve(row ? row : null);
			}
		});
	});
};

export const getUserByToken = async (conn, token) => {
	const sql = `SELECT * FROM users WHERE auth_token = ?`;
	return new Promise((resolve, reject) => {
		conn.get(sql, [token], (err, row) => {
			if (err) {
				reject({ error: err.message });
			} else {
				resolve(row ? row : null);
			}
		});
	});
};

export const createUser = async (conn, username, password, authToken) => {
	//check if username already in use
	const userRecord = await getUserByUsername(conn, username);
	if (userRecord !== null) return { error: `Username ${username} already in use` };

	const sql = `INSERT INTO users(username,password,auth_token) VALUES (?,?,?)`;
	return new Promise((resolve, reject) => {
		conn.run(sql, [username, password, authToken], (err) => {
			if (err) {
				reject({ error: err.message });
			} else {
				resolve({ message: 'User Created' });
			}
		});
	});
};

export const updateUser = async (conn, username, field, value) => {
	let sql;
	userFields.forEach((userField) => {
		if (userField === field) sql = `UPDATE users SET ${userField} = ? WHERE username = ?`;
	});

	if (!sql) return { error: `Invalid field ${field}` };

	//check if user exists
	const userRecord = await getUserByUsername(conn, username);
	if (userRecord === null) return { error: `User ${username} not found` };

	return new Promise((resolve, reject) => {
		conn.run(sql, [value, username], (err) => {
			if (err) reject({ error: err.message });
			else resolve({ message: `${field} updated` });
		});
	});
};

export const deleteUserById = (conn, userId) => {
	const sql = `DELETE FROM users WHERE id = ?`;
	return new Promise((resolve, reject) => {
		conn.run(sql, [userId], (err) => {
			if (err) reject({ error: err.message });
			else resolve({ message: 'User deleted' });
		});
	});
};
