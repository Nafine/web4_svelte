<script lang="ts">
	import { api } from '$lib/api.ts';
	import { fly } from 'svelte/transition';
	import Textfield from '@smui/textfield';
	import HelperText from '@smui/textfield/helper-text';
	import { onMount } from 'svelte';

	let registerName: string | null = $state('');
	let registerPassword: string | null = $state('');

	let validRegisterName: boolean = $derived(registerName.length >= 4);
	let validRegisterPassword: boolean = $derived(registerPassword.length >= 4);

	let loginName: string | null = $state('');
	let loginPassword: string | null = $state('');

	let validLoginName: boolean = $derived(loginName.length >= 4);
	let validLoginPassword: boolean = $derived(loginPassword.length >= 4);

	let visible = $state(false);

	onMount(() => (visible = true));

	async function onregister(event: Event) {
		event.preventDefault();

		const res = await api({
			method: 'post',
			url: '/register',
			headers: { 'Content-Type': 'application/json' },
			data: JSON.stringify({ login: registerName, password: registerPassword })
		});

		if (res.status === 200) {
			window.location.href = '/main';
		} else {
			alert('Invalid credentials');
		}
	}

	async function onlogin(event: Event) {
		event.preventDefault();

		const res = await api({
			method: 'post',
			url: '/login',
			headers: { 'Content-Type': 'application/json' },
			data: JSON.stringify({ login: loginName, password: loginPassword })
		});

		if (res.status === 200) {
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
					<Textfield variant="outlined" bind:value={registerName} label="login">
						{#snippet helper()}
							<HelperText class={!validRegisterName ? '' : 'hidden'} style="color: red;"
								>Login must be at least 4 characters long</HelperText
							>
						{/snippet}
					</Textfield>
					<Textfield
						type="password"
						variant="outlined"
						bind:value={registerPassword}
						label="password"
					>
						{#snippet helper()}
							<HelperText class={!validRegisterPassword ? '' : 'hidden'} style="color: red;"
								>Password must be at least 4 characters long</HelperText
							>
						{/snippet}</Textfield
					>
					<button
						disabled={!(validRegisterName && validRegisterPassword)}
						type="submit"
						class="btn-general">Sign up</button
					>
				</form>
			</div>
			<div class="login">
				<form class="center-aligner" onsubmit={onlogin} transition:fly={{ y: 200, duration: 1500 }}>
					<label for="chk" aria-hidden="true">Login</label>
					<Textfield variant="outlined" bind:value={loginName} label="login">
						{#snippet helper()}
							<HelperText class={!validLoginName ? '' : 'hidden'} style="color: red;"
								>Login must be at least 4 characters long</HelperText
							>
						{/snippet}
					</Textfield>
					<Textfield type="password" variant="outlined" bind:value={loginPassword} label="password">
						{#snippet helper()}
							<HelperText class={!validLoginPassword ? '' : 'hidden'} style="color: red;"
								>Login must be at least 4 characters long</HelperText
							>
						{/snippet}</Textfield
					>
					<button
						disabled={!(validLoginName && validLoginPassword)}
						type="submit"
						class="btn-general">Login</button
					>
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
		margin: 40px;
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
	.center-aligner input {
		gap: 2em;
	}
	:global(.hidden) {
		visibility: hidden;
	}
</style>
