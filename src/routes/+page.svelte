<script lang="ts">
	import { api } from '$lib/api.ts';
	import Textfield from '@smui/textfield';
	import HelperText from '@smui/textfield/helper-text';

	let registerName: string | null = $state('');
	let registerPassword: string | null = $state('');

	let validRegisterName: boolean = $derived(registerName.length >= 4);
	let validRegisterPassword: boolean = $derived(registerPassword.length >= 4);

	let loginName: string | null = $state('');
	let loginPassword: string | null = $state('');

	let validLoginName: boolean = $derived(loginName.length >= 4);
	let validLoginPassword: boolean = $derived(loginPassword.length >= 4);

	async function sendCredentials(credentials: { login: string; password: string }, url: string) {
		await api({
			method: 'post',
			url: url,
			headers: { 'Content-Type': 'application/json' },
			data: JSON.stringify(credentials)
		})
			.then((res) => {
				if (res.status === 200) {
					window.location.href = '/main';
				}
			})
			.catch((error) => {
				alert(error.response.data);
			});
	}

	async function onregister(event: Event) {
		event.preventDefault();

		sendCredentials({ login: registerName ?? '', password: registerPassword ?? '' }, '/register');
	}

	async function onlogin(event: Event) {
		event.preventDefault();

		sendCredentials({ login: loginName ?? '', password: loginPassword ?? '' }, '/login');
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
	<div class="main">
		<input type="checkbox" id="chk" aria-hidden="true" />
		<div class="signup">
			<form
				class="center-aligner flyIn"
				onsubmit={onregister}
				style:--delay="100ms"
				style:--y="-200px"
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
			<form class="center-aligner flyIn" onsubmit={onlogin} style:--delay="100ms" style:--y="200px">
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
				<button disabled={!(validLoginName && validLoginPassword)} type="submit" class="btn-general"
					>Login</button
				>
			</form>
		</div>
	</div>
</div>

<style>
	.main {
		width: 350px;
		height: 500px;
		overflow: hidden;
		background-color: rgb(240, 245, 250);
		border-radius: 4px;
		border: 1px solid #e8eaed;
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
		background-color: white;
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
	a {
		color: #573b8a;
		text-decoration: none;
	}

	@media (prefers-reduced-motion: no-preference) {
		.flyIn {
			--delay: 0s;
			transition-property: opacity, transform;
			transition-duration: 1s;
			transition-timing-function: ease-in-out;
			opacity: 1;
			transform: translateY(0);
			transition-delay: var(--delay, 0s);

			--y: 0;

			@starting-style {
				opacity: 0;
				transform: translateY(var(--y));
			}
		}
	}
</style>
