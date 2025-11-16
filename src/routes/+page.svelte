<script lang="ts">
	import { fly, slide } from 'svelte/transition';
	import Textfield from '@smui/textfield';
	import { apiFetch } from '$lib/clientApi.svelte';
	import { onMount } from 'svelte';

	let login: string | null = $state(null);
	let password: string | null = $state(null);

	let visible = $state(false);

	onMount(() => (visible = true));

	async function onsubmit(event: Event) {
		event.preventDefault();

		const res = await apiFetch('/api/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ login, password })
		});

		if (res.ok) {
			window.location.href = '/main';
		} else {
			alert('Invalid credentials');
		}
	}
</script>

<header>
	<div id="main-header" class="center-aligner">
		<p>Веб программирование 4 Вариант 228322</p>
		<p>
			Выполнил Зенченков Павел Геннадьевич P3215 <a href="https://github.com/Nafine/web4"
				>github</a
			>
		</p>
	</div>
	<hr />
</header>
<div class="center-aligner">
	{#if visible}
		<form {onsubmit} transition:fly={{ y: 200, duration: 1500 }}>
			<fieldset class="shadowed-box center-aligner">
				<Textfield variant="outlined" bind:value={login} label="login" />
				<Textfield variant="outlined" bind:value={password} label="password" />
				<button type="submit" class="btn-general">Log in</button>
			</fieldset>
		</form>
	{/if}
</div>
