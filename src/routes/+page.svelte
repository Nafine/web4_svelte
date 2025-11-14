<script lang="ts">
	import Textfield from '@smui/textfield';

	let login: string | null = $state(null);
	let password: string | null = $state(null);

	async function submitForm(event: Event) {
		event.preventDefault();

		const res = await fetch('/api/auth', {
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
			Выполнил Зенченков Павел Геннадьевич P3215 <a href="https://github.com/Nafine/web4">github</a>
		</p>
	</div>
	<hr />
</header>
<div class="center-aligner">
	<form method="POST" onsubmit={submitForm}>
		<fieldset class="shadowed-box center-aligner">
			<Textfield variant="outlined" input$name="login" bind:value={login} label="login" />
			<Textfield variant="outlined" input$name="password" bind:value={password} label="password" />
			<button type="submit" class="btn-submit">Log in</button>
		</fieldset>
	</form>
</div>
