<script lang="ts">
	import { onMount } from 'svelte';
	import NumberInput from './NumberInput.svelte';
	import { draw, initGraph} from './graph.svelte.js';

	let validX = $state(true);
	let validY = $state(true);
	let validR = $state(true);

	let disabled = $derived.by(() => !(validR && validX && validY));

  onMount(() => {
		initGraph();
		draw();
	});
</script>

<main class="grid-layout">
	<div class="grid-item">
		<canvas class="graph shadowed-box" id="graph" width="550" height="550"></canvas>
		<NumberInput
			min={-3}
			max={5}
			onvalid={() => (validR = true)}
			oninvalid={() => (validR = false)}
			placeholder="R"
		/>
	</div>

	<div class="grid-item center-aligner">
		<div class="center-aligner">
			<form id="form" method="POST" action="/api/dot">
				<fieldset class="shadowed-box center-aligner">
					<NumberInput
						name="Y"
						placeholder="Y"
						min={-5}
						max={3}
						onvalid={() => (validY = true)}
						oninvalid={() => (validY = false)}
					/>
					<NumberInput
						name="X"
						placeholder="X"
						min={-3}
						max={5}
						onvalid={() => (validX = true)}
						oninvalid={() => (validX = false)}
					/>
					<div class="center-aligner">
						<button onclick={() => (location.href = '/')} class="btn-submit" {disabled}
							>Submit</button
						>
					</div>
				</fieldset>
			</form>
		</div>
	</div>
</main>
