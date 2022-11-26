<script>
	import { page } from '$app/stores';
	import { loop_guard } from 'svelte/internal';
</script>

{#if $page.data.user}
	<h1>Welcome, {$page.data.user.username}</h1>
{/if}
