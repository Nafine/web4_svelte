<script lang="ts">
	import { fly, slide } from 'svelte/transition';
	import Textfield from '@smui/textfield';
	import { apiFetch } from '$lib/clientApi.svelte';
	import { onMount } from 'svelte';

	let loginName: string | null = $state(null);
	let loginPassword: string | null = $state(null);

	let registerName: string | null = $state(null);
	let registerPassword: string | null = $state(null);

	let visible = $state(false);

	onMount(() => (visible = true));

	async function onregister(event: Event) {
		event.preventDefault();

		const res = await apiFetch('/api/register', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ login: registerName, password: registerPassword })
		});

		if (res.ok) {
			window.location.href = '/main';
		} else {
			alert('Invalid credentials');
		}
	}

	async function onlogin(event: Event) {
		event.preventDefault();

		const res = await apiFetch('/api/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ login: loginName, password: loginPassword })
		});

		if (res.ok) {
			window.location.href = '/main';
		} else {
			alert('Invalid credentials');
		}
	}
</script>

<header>
	<div class="center-aligner">
		<p>Веб программирование 4 Вариант 228322</p>
		<p>
			Выполнил Зенченков Павел Геннадьевич P3215 <a href="https://github.com/Nafine/web4">github</a>
		</p>
	</div>
	<hr />
</header>
<div class="center-aligner">
	{#if visible}
		<div class="main shadowed-box">
			<input type="checkbox" id="chk" aria-hidden="true" />
			<div class="signup">
				<form
					class="center-aligner"
					onsubmit={onregister}
					transition:fly={{ y: 200, duration: 1500 }}
				>
					<label for="chk" aria-hidden="true">Sign up</label>
					<Textfield variant="outlined" bind:value={registerName} label="login" />
					<Textfield variant="outlined" bind:value={registerPassword} label="password" />
					<button type="submit" class="btn-general">Sign up</button>
				</form>
			</div>
			<div class="login">
				<form class="center-aligner" onsubmit={onlogin} transition:fly={{ y: 200, duration: 1500 }}>
					<label for="chk" aria-hidden="true">Login</label>
					<Textfield variant="outlined" bind:value={loginName} label="login" />
					<Textfield variant="outlined" bind:value={loginPassword} label="password" />
					<button type="submit" class="btn-general">Login</button>
				</form>
			</div>
		</div>
	{/if}
</div>

<style>
	.main {
		width: 350px;
		height: 500px;
		overflow: hidden;
		background: linear-gradient(to bottom, #a7a3c1, #d8d7e2, #d0d0ee);
	}
	#chk {
		display: none;
	}
	.signup {
		position: relative;
		width: 100%;
		height: 100%;
	}
	label {
		color: whitesmoke;
		font-size: 2.3em;
		justify-content: center;
		display: flex;
		margin: 50px;
		font-weight: bold;
		cursor: pointer;
		transition: 0.5s ease-in-out;
	}
	.login {
		height: 460px;
		background: whitesmoke;
		border-radius: 60% / 10%;
		transform: translateY(-100px);
		transition: 0.8s ease-in-out;
	}
	.login label {
		color: #573b8a;
		transform: scale(0.6);
	}
	#chk:checked ~ .login {
		transform: translateY(-410px);
	}
	#chk:checked ~ .login label {
		transform: scale(1);
	}
	#chk:checked ~ .signup label {
		transform: scale(0.6);
	}
</style>
