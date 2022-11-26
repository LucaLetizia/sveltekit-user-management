<script>
	import { page } from '$app/stores';
	import '../app.css';
</script>

<slot />

{#if $page.data.user}
	<form action="/logout" method="POST">
		<button class="text-sky-600 hover:text-sky-500" type="submit">Log out</button>
	</form>
{/if}
