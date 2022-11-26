import { redirect } from '@sveltejs/kit';
import * as config from '$config/config.json';

export const load = async ({ locals, routeId }) => {
	if (!locals.user) {
		if (config.protected_routes[routeId]) {
			throw redirect(302, '/login');
		}
	}
	return { user: locals.user };
};
