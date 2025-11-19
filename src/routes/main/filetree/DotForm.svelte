<script lang="ts">
	import NumberInput from '$lib/NumberInput.svelte';

	type Props = {
		x: number;
		y: number;
		r: number;
		onsubmit: (event: Event) => void;
	};

	let { x = $bindable(), y = $bindable(), r = $bindable(), onsubmit }: Props = $props();

	let validX = $state(true);
	let validY = $state(true);
	let validR = $state(true);

	let disabled = $derived(!(validR && validX && validY));
</script>

<form id="form" {onsubmit}>
	<fieldset class="form-grid">
		<div class="center-aligner">
			<NumberInput
				bind:value={r}
				input$maxlength={12}
				min={0.0000000001}
				max={5}
				onvalid={() => (validR = true)}
				oninvalid={() => (validR = false)}
				placeholder="R (+0–5)"
			/>
		</div>

		<div class="xy-row">
			<NumberInput
				bind:value={x}
				input$maxlength={12}
				min={-3}
				max={5}
				onvalid={() => (validX = true)}
				oninvalid={() => (validX = false)}
				placeholder="X (-3..5)"
			/>
			<NumberInput
				bind:value={y}
				input$maxlength={12}
				min={-5}
				max={3}
				onvalid={() => (validY = true)}
				oninvalid={() => (validY = false)}
				placeholder="Y (-5..3)"
			/>
		</div>
		<div class="center-aligner">
			<button type="submit" class="btn-general" {disabled}> Submit </button>
		</div>
	</fieldset>
</form>

<style>
	#form {
		margin-top: 20px;
		width: 90%;
	}

	.form-grid {
		display: grid;
		gap: 1rem;
		justify-items: center;
		max-width: 400px;
		margin: 0 auto;
	}

	.xy-row {
		display: flex;
		gap: 1rem;
		width: 100%;
		max-width: 400px;
	}

	@media (max-width: 480px) {
		.xy-row {
			flex-direction: column;
		}
	}
</style>
