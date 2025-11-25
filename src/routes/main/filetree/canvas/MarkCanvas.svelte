<script module lang="ts">
	export type Pos = {
		x: number;
		y: number;
	};
</script>

<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { draw, initGraph, refresh, addDots } from './graph.svelte.js';
	import type { Dot } from './graph.svelte.js';

	type Props = {
		r: number;
		ondotclick?: (pos: Pos) => void;
	};

	let { r = $bindable(), ondotclick }: Props = $props();

	let canvas: HTMLCanvasElement;
	
	onMount(() => {
		initGraph();
		draw();
		resizeCanvasToFit();
		window.addEventListener('resize', resizeCanvasToFit);
	});

	onDestroy(() => window.removeEventListener('resize', resizeCanvasToFit));

	$effect(() => {
		if (!isNaN(r) && r > 0 && r <= 5) refresh(r);
	});


	const BASE_SIZE = 550;

	function resizeCanvasToFit() {
		if (!canvas) return;
		const dpr = window.devicePixelRatio || 1;

		const cssSize = window.innerWidth < 760 ? Math.floor(BASE_SIZE * 0.8) : BASE_SIZE;

		canvas.style.width = cssSize + 'px';
		canvas.style.height = cssSize + 'px';

		const pixelWidth = Math.max(1, Math.floor(cssSize * dpr));
		const pixelHeight = Math.max(1, Math.floor(cssSize * dpr));

		if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
			canvas.width = pixelWidth;
			canvas.height = pixelHeight;
		}

		draw();
	}

	export function drawDots(dots: Dot[]) {
		addDots(dots);
	}

	function getCursorPosition(event: MouseEvent) {
		const rect = canvas.getBoundingClientRect();
		const x = (event.clientX - rect.left - rect.width / 2) / (rect.width * 0.4);
		const y = (event.clientY - rect.top - rect.height / 2) / -(rect.width * 0.4);
		return { x: x, y: y, r: r };
	}

	function onclick(event: MouseEvent) {
		if (!ondotclick) return;
		if (r <= 0 || r > 5) {
			alert('Select valid radius');
			return;
		}
		let pos = getCursorPosition(event);
		let dot = { x: pos.x * r, y: pos.y * r };
		ondotclick(dot);
	}
</script>

<canvas bind:this={canvas} {onclick} id="graph" width="550" height="550"></canvas>
