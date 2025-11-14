<script lang="ts">
  import Textfield from "@smui/textfield";

  let value: string | null = $state(null);

  const { min, max, onvalid, oninvalid, ...stuff } = $props();

  oninvalid();

  function oninput(event: Event) {
    let numericValue = value === null ? NaN : parseFloat(value);

    if (isNaN(numericValue)) {
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
