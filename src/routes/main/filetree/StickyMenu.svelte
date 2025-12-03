<script>
	import { goto } from '$app/navigation';
	import { logout } from '$lib/api';

	async function onclick() {
		await logout();

		goto('/');
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

	.btn-general {
		color: white;
	}

	.btn-general:hover {
		color: black;
	}
</style>
