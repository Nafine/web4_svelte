<script module>
	export type Pos = {
		x: number;
		y: number;
	};
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { draw, initGraph, refresh, addDots } from './graph.svelte.js';
	import type { Dot } from './graph.svelte';

	type Props = {
		r: number;
		ondotclick?: (pos: Pos) => void;
	};

	let { r = $bindable(), ondotclick }: Props = $props();

	let canvas: HTMLCanvasElement;

	onMount(() => {
		initGraph();
		draw();
	});

	$effect(() => {
		if (!isNaN(r)) refresh(r);
	});

	export function drawDots(dots: Dot[]) {
		addDots(dots);
	}

	function getCursorPosition(event: MouseEvent) {
		const rect = canvas.getBoundingClientRect();
		const x = (event.clientX - rect.left - 250) / 200;
		const y = (event.clientY - rect.top - 250) / -200;
		return { x: x, y: y, r: r };
	}

	function onclick(event: MouseEvent) {
		if (!ondotclick) return;
		let pos = getCursorPosition(event);
		console.log(pos);
		let dot = { x: pos.x * r, y: pos.y * r };
		console.log(dot);
		ondotclick(dot);
	}
</script>

<canvas bind:this={canvas} {onclick} class="graph shadowed-box" id="graph" width="500" height="500"
></canvas>
