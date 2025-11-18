<script lang="ts">
	import StickyMenu from './filetree/StickyMenu.svelte';
	import MarkCanvas from './filetree/canvas/MarkCanvas.svelte';
	import type { Pos } from './filetree/canvas/MarkCanvas.svelte';
	import { type Dot, type DotDto } from '$lib/dotApi';
	import { apiFetch } from '$lib/clientApi.svelte.js';
	import DotForm from './filetree/DotForm.svelte';
	import DotTable from './filetree/table/DotTable.svelte';

	let table: DotTable;

	let x = $state(0);
	let y = $state(0);
	let r = $state(1);

	let canvas: MarkCanvas;

	let items: Dot[] = $state([]);

	$effect(() => {
		canvas.drawDots(items);
	});

	async function handleDotClick(pos: Pos) {
		await sendDot({ x: pos.x, y: pos.y, r: r, timestamp: new Date().toISOString() });
		table.setLastPage();
	}

	async function sendDot(dot: DotDto) {
		await apiFetch('/api/hit', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(dot)
		});
	}

	async function onsubmit(event: Event) {
		event.preventDefault();

		await sendDot({ x: x, y: y, r: r, timestamp: new Date().toISOString() });

		table.setLastPage();
	}
</script>

<StickyMenu />
<main class="app-container">
	<div class="left-panel">
		<div class="center-aligner">
			<MarkCanvas bind:r bind:this={canvas} ondotclick={handleDotClick} />
			<DotForm bind:x bind:y bind:r {onsubmit} />
		</div>
	</div>

	<div class="right-panel">
		<DotTable bind:this={table} bind:items pageSize={10} />
	</div>
</main>

<style>
	.app-container {
		display: flex;
		gap: 2rem;
		padding: 2rem;
		margin: 0 auto;
		align-items: center;
		flex-direction: row;
	}

	.left-panel,
	.right-panel {
		flex: 1;
		display: flex;
		flex-direction: row;
		gap: 1.5rem;
	}

	.right-panel,
	.left-panel {
		align-items: flex-start;
		align-self: flex-start;
	}

	@media (max-width: 1196px) {
		.app-container {
			flex-direction: column;
			justify-items: center;
			padding: 1rem;
		}

		.left-panel,
		.right-panel {
			flex-direction: column;
			align-items: center;
			align-self: center;
		}

		main {
			justify-items: center;
		}
	}

	@media (max-width: 760px) {
    .app-container {
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .left-panel,
    .right-panel {
        flex-direction: column;
        align-items: center !important;
        align-self: center !important;
        width: 100%;
    }

    main {
        justify-items: center;
    }
}

	main {
		padding-top: 90px !important;
	}
</style>
