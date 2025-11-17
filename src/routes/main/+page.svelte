<script lang="ts">
	import NumberInput from '$lib/ui-toolkit/NumberInput.svelte';
	import StickyMenu from '$lib/ui-toolkit/StickyMenu.svelte';
	import MarkCanvas from '$lib/ui-toolkit/MarkCanvas/MarkCanvas.svelte';
	import type { Pos } from '$lib/ui-toolkit/MarkCanvas/MarkCanvas.svelte';
	import DataTable, { Head, Body, Row, Cell, Pagination } from '@smui/data-table';
	import IconButton from '@smui/icon-button';
	import { apiFetch } from '$lib/clientApi.svelte.js';
	import { onMount } from 'svelte';

	type TableCell = {
		x: number;
		y: number;
		r: number;
		result: boolean;
		timestamp: string;
		executionTime: number;
	};

	type DotDto = {
		x: number;
		y: number;
		r: number;
		timestamp: string;
	};

	let validX = $state(true);
	let validY = $state(true);
	let validR = $state(true);

	let x = $state(0);
	let y = $state(0);
	let r = $state(1);

	let disabled = $derived(!(validR && validX && validY));

	let canvas: MarkCanvas;

	let items: TableCell[] = $state([]);
	let pageSize = 10;
	let currentPage = $state(1);
	let hasNext = $state(false);
	let fetching = $state(false);

	const start = $derived((currentPage - 1) * pageSize);
	const end = $derived(start + Math.min(start + pageSize, items.length));

	onMount(loadLastPage);

	$effect(() => {
		canvas.drawDots(items);
	});

	async function handleDotClick(pos: Pos) {
		await sendDot({ x: pos.x, y: pos.y, r: r, timestamp: new Date().toISOString() });
		loadLastPage();
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

		loadLastPage();
	}

	async function loadPage() {
		fetching = true;
		let res = await apiFetch(`/api/dots?page=${currentPage}&size=${pageSize}`)
			.then((response) => response.json())
			.then((json) => {
				items = json.dots;
				hasNext = json.hasNext;
			});
		fetching = false;
	}

	async function loadLastPage() {
		fetching = true;
		let res = await apiFetch(`/api/dots/last?size=${pageSize}`)
			.then((response) => response.json())
			.then((json) => {
				items = json.dots;
				hasNext = json.hasNext;
				currentPage = json.page;
			});
		fetching = false;
	}
</script>

<StickyMenu />
<main class="app-container">
	<div class="left-panel">
		<div class="center-aligner">
			<MarkCanvas bind:r bind:this={canvas} ondotclick={handleDotClick} />
			<form id="form" {onsubmit}>
				<fieldset class="shadowed-box form-grid">
					<div class="center-aligner">
						<NumberInput
							bind:value={r}
							input$maxlength={12}
							min={1}
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
		</div>
	</div>

	<div class="right-panel">
		<div class="table-wrapper">
			<DataTable stickyHeader>
				<Head>
					<Row>
						<Cell numeric>X</Cell>
						<Cell numeric>Y</Cell>
						<Cell numeric>R</Cell>
						<Cell>Hit</Cell>
						<Cell>Time</Cell>
						<Cell numeric>Execution time</Cell>
					</Row>
				</Head>

				<Body>
					{#each items as item}
						<Row>
							<Cell numeric>{item.x.toFixed(3)}</Cell>
							<Cell numeric>{item.y.toFixed(3)}</Cell>
							<Cell numeric>{item.r.toFixed(3)}</Cell>
							<Cell>{item.result}</Cell>
							<Cell>{new Date(item.timestamp).toLocaleString()}</Cell>
							<Cell numeric>{item.executionTime}ms</Cell>
						</Row>
					{/each}
				</Body>
				{#snippet paginate()}
					<Pagination>
						{#snippet total()}
							{start + 1}-{end}
						{/snippet}

						<IconButton
							class="material-icons"
							action="first-page"
							title="First page"
							onclick={() => {
								currentPage = 1;
								loadPage();
							}}
							disabled={currentPage === 1 || fetching}>first_page</IconButton
						>
						<IconButton
							class="material-icons"
							action="prev-page"
							title="Prev page"
							onclick={() => {
								currentPage--;
								loadPage();
							}}
							disabled={currentPage === 1 || fetching}>chevron_left</IconButton
						>
						<IconButton
							class="material-icons"
							action="next-page"
							title="Next page"
							onclick={() => {
								currentPage++;
								loadPage();
							}}
							disabled={!hasNext || fetching}>chevron_right</IconButton
						>
						<IconButton
							class="material-icons"
							action="last-page"
							title="Next page"
							onclick={loadLastPage}
							disabled={!hasNext || fetching}>last_page</IconButton
						>
					</Pagination>
				{/snippet}
			</DataTable>
		</div>
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

	.table-wrapper {
		width: 100%;
		overflow-y: auto;
	}

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

	@media (max-width: 1100px) {
		.app-container {
			flex-direction: column;
			padding: 1rem;
		}

		.left-panel,
		.right-panel {
			flex: none;
		}
	}

	main {
		padding-top: 90px !important;
	}
</style>
