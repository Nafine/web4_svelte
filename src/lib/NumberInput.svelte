<script lang="ts">
	import Textfield from '@smui/textfield';

	let { min, max, onvalid, oninvalid, value = $bindable(null), ...stuff } = $props();

	if (value === null) {
		oninvalid();
	}

	function oninput(event: Event) {
		let numericValue = parseFloat(value);

		if (isNaN(value) || value === '') {
			oninvalid();
		} else if (min !== undefined && numericValue < min) {
			oninvalid();
		} else if (max !== undefined && numericValue > max) {
			oninvalid();
		} else {
			onvalid();
		}
	}
</script>

<Textfield
	variant="outlined"
	style="margin: 1em;"
	label={stuff.placeholder}
	bind:value
	{oninput}
	{...stuff}
/>
