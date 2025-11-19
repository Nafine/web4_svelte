<script lang="ts">
	import Textfield from '@smui/textfield';
	import HelperText from '@smui/textfield/helper-text';

	let { onsubmit } = $props();

	let name: string | null = $state(null);
	let password: string | null = $state(null);

	let validName: boolean = $derived((name ?? '').length >= 4);
	let validPassword: boolean = $derived((password ?? '').length >= 4);
</script>

//transition:fly={{ y: 200, duration: 1500 }}
<form class="center-aligner" {onsubmit}>
	<label for="chk" aria-hidden="true">Login</label>
	<Textfield variant="outlined" bind:value={name} label="login">
		{#snippet helper()}
			{#if !validName}
				<HelperText style="color: red;">Login must be at least 4 characters long</HelperText>
			{/if}
		{/snippet}
	</Textfield>
	<Textfield type="password" variant="outlined" bind:value={password} label="password">
		{#snippet helper()}
			{#if !validPassword}
				<HelperText style="color: red;">Login must be at least 4 characters long</HelperText>
			{/if}
		{/snippet}
	</Textfield>
	<button type="submit" class="btn-general">Login</button>
</form>
