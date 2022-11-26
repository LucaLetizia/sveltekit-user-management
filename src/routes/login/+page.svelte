<script>
	export let form;

	let showPassword = false;
	let type = 'password';
	const handleShowPassword = () => {
		showPassword = !showPassword;
		showPassword ? (type = 'text') : (type = 'password');
	};
</script>

<main class="flex items-center justify-center h-screen bg-gradient-to-r from-sky-500 to-indigo-500">
	<form method="POST" action="?/authenticateUser">
		<div class="bg-white w-96 p-6 rounded shadow-sm text-gray-800 ">
			<div class="flex items-center justify-center mb-4">
				<img src="./favicon.png" alt="" />
			</div>

			<div class="relative mt-1">
				<iconify-icon icon="fa-solid:user" class="absolute pt-3 mx-3" />
				<input
					type="text"
					name="username"
					id="username"
					placeholder="Username"
					class="p-4 w-full h-10 rounded pl-10 bg-slate-100 border-solid border-2 border-slate-300 px-1 outline-none mb-4"
					value={form?.username ?? ''}
				/>
			</div>

			<div class="relative mt-1">
				<iconify-icon icon="ph:key-fill" class="absolute pt-3 mx-3" />
				{#if showPassword}
					<button type="button" class="absolute pt-3 right-5" on:click={handleShowPassword}
						><iconify-icon icon="mdi:eye-off" class="absolute" /></button
					>
				{:else}
					<button type="button" class="absolute pt-3 right-5" on:click={handleShowPassword}
						><iconify-icon icon="mdi:eye" class="absolute" /></button
					>
				{/if}

				<input
					{type}
					name="password"
					id="password"
					placeholder="Password"
					class="p-4 w-full h-10 rounded pl-10 pr-6 bg-slate-100 border-solid border-2 border-slate-300 px-1 outline-none mb-4"
					value={form?.password ?? ''}
				/>
			</div>

			{#if form?.message}
				<div
					class={form?.error
						? 'bg-red-100 text-red-500 border-solid border-2 border-red-500 px-3 py-2 rounded mb-3'
						: form?.success
						? 'bg-green-100 text-green-500 border-solid border-2 border-green-500 px-3 py-2 rounded mb-3'
						: 'bg-sky-100 text-sky-500 border-solid border-2 border-sky-500 px-3 py-2 rounded mb-3'}
				>
					<iconify-icon
						class="absolute pt-1"
						icon="material-symbols:error-circle-rounded-outline"
					/>
					<p class="pl-6">{form?.message}</p>
				</div>
			{/if}
			<button type="submit" class="bg-sky-500 w-full text-white py-2 rounded  hover:bg-sky-600 "
				>Login</button
			>
			<hr class="mt-5" />
			<p class="text-center mt-4">
				Don't have an account? <a href="/signup" class="text-blue-600 hover:text-blue-400"
					>Sign Up!</a
				>
			</p>
		</div>
	</form>
</main>
