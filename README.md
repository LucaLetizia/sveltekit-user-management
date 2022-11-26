# sveltekit-user-management

Simple SvelteKit app to create and manage users using a local sqlite database. The database is initialised on startup and it's located in `src/lib/server/database/database.db`.

The app comes with a login and a signup form with basic validation for the following scenarios:

- One or more fields missing (signup and login)
- Wrong credentials (login)
- Username already taken (signup)
- The two passwords do not match (signup)

Passwords are hashed and salted with bcrypt and therefore cannot be recovered if lost.

Upon login, a unique user token is generated and stored in the database and a session cookie is created. On every request, the database is queried to returned a user record associated with the token. If a record is found, the corresponding username is stored in `locals.user` (see `src/hooks.server.js`). `locals.user` is currently responsible for validating redirects to protected routes and for passing user data to pages (see `src/routes/+layout.server.js`).

The app is styled with Tailwind CSS.
Icons: https://iconify.design

## Dependencies

- sqlite3
- bcrypt

## Running locally

```bash
npm install
npm run dev
```

## Creating tables

Tables are created automatically during database initialisation by executing sql statements stored in `tableList` in `src/lib/server/database/database.js`

```
const tableList = [
	`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT NOT NULL, password TEXT NOT NULL, user_token TEXT NOT NULL)`,
];
```

To create a new table, simply add an extra sql statement to `tableList` and reload the app.

```
const tableList = [
	`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT NOT NULL, password TEXT NOT NULL, user_token TEXT NOT NULL)`,
	`CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY, title TEXT NOT NULL, content TEXT NOT NULL, user_id INTEGER NOT NULL, FOREIGN KEY(user_id) REFERENCES users(id))`
];
```

## Protected routes

By default, the only protected route is "/". This can be changed in `config/config.json` by adding more routes under `protected_routes` with value `true`:

```
{
	"protected_routes": {
		"/": true,
		"/my-secret-route": true
	}
}
```
