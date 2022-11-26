import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		alias: {
			$db: './src/lib/server/database',
			$config: './config'
		}
	},
	preprocess: [
		preprocess({
			postcss: true
		})
	]
};

export default config;
