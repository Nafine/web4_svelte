<script>
	import { apiFetch, revokeAccessToken } from '$lib/clientApi.svelte';

	async function onclick() {
		await apiFetch('/api/logout', {
			method: 'POST'
		});

		revokeAccessToken();
		location.href = '/';
	}
</script>

<nav id="main-header">
	<img src="/pics/itmo_vt.png" alt="Logo" />
	<button class="btn-general" {onclick}>Logout</button>
</nav>

<style>
	#main-header {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;

		height: 80px;
		display: flex;
		align-items: center;
		justify-content: space-between;

		background-color: black;
		padding: 0 1em;
		z-index: 1000;
	}
</style>
