<script lang="ts">
	import { onMount } from 'svelte';
	import NumberInput from '$lib/ui-toolkit/NumberInput.svelte';
	import DataTable, { Head, Body, Row, Cell, Pagination } from '@smui/data-table';
	import Select, { Option } from '@smui/select';
	import IconButton from '@smui/icon-button'
	import { Label } from '@smui/common';
	import { draw, initGraph, refresh } from './graph.svelte.js';
	import { apiFetch, revokeAccessToken } from '$lib/clientApi.svelte.js';

	let validX = $state(true);
	let validY = $state(true);
	let validR = $state(true);

	let x = $state(0);
	let y = $state(0);
	let r = $state(1);

	let disabled = $derived(!(validR && validX && validY));

	type Dot = {
		x: number;
		y: number;
		r: number;
		result: boolean;
		timestamp: string;
		executionTime: number;
	};

	let items: Dot[] = $state([]);
	let perPage = $state(10);
	let currentPage = $state(1);

	const start = $derived((currentPage - 1) * perPage);
	const end = $derived(Math.min(start + perPage, items.length));
	const slice = $derived(items.slice(start, end));
	const lastPage = $derived(Math.max(Math.ceil(items.length / perPage) - 1, 1));

	onMount(() => {
		initGraph();
		draw();
		loadDots();
	});

	$effect(() => {
		if (currentPage > lastPage) {
			currentPage = lastPage;
		}
	});

	$effect(() => {
		if (validR) {
			refresh(r);
		}
	});

	async function onclick() {
		await apiFetch('/api/logout', {
			method: 'POST'
		});

		revokeAccessToken();
		location.href = '/';
	}

	async function onsubmit(event: Event) {
		event.preventDefault();

		await apiFetch('/api/hit', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ x: x, y: y, r: r, timestamp: new Date().toISOString() })
		});

		loadDots();
	}

	function loadDots() {
		apiFetch(`/api/dots?page=${currentPage}&size=${perPage}`)
			.then((response) => response.json())
			.then((json) => items = json);
	}
</script>

<main class="grid-layout">
	<div class="grid-item">
		<canvas class="graph shadowed-box" id="graph" width="550" height="550"></canvas>
		<NumberInput
			bind:value={r}
			input$maxlength={12}
			min={1}
			max={5}
			onvalid={() => (validR = true)}
			oninvalid={() => (validR = false)}
			placeholder="R"
		/>
	</div>

	<div class="grid-item center-aligner">
		<div class="center-aligner">
			<form id="form" {onsubmit}>
				<fieldset class="shadowed-box center-aligner">
					<NumberInput
						bind:value={x}
						input$maxlength={12}
						placeholder="X"
						min={-3}
						max={5}
						onvalid={() => (validX = true)}
						oninvalid={() => (validX = false)}
					/>
					<NumberInput
						bind:value={y}
						input$maxlength={12}
						placeholder="Y"
						min={-5}
						max={3}
						onvalid={() => (validY = true)}
						oninvalid={() => (validY = false)}
					/>
					<div class="center-aligner">
						<button type="submit" class="btn-general" {disabled}>Submit</button>
					</div>
				</fieldset>
			</form>
		</div>
	</div>

	<div class="grid-item">
		<button class="btn-general center-aligner" {onclick}>Logout</button>
		<DataTable>
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
				{#each slice as item}
					<Row>
						<Cell numeric>{item.x}</Cell>
						<Cell numeric>{item.y}</Cell>
						<Cell numeric>{item.r}</Cell>
						<Cell>{item.result}</Cell>
						<Cell>{item.timestamp}</Cell>
						<Cell numeric>{item.executionTime}</Cell>
					</Row>
				{/each}
			</Body>

			{#snippet paginate()}
				<Pagination>
					{#snippet pageSize()}
						<Label>Page size</Label>
						<Select variant="outlined" bind:value={perPage} noLabel>
							<Option value={5}>5</Option>
							<Option value={10}>10</Option>
							<Option value={15}>15</Option>
						</Select>
					{/snippet}
					{#snippet total()}
						{start + 1}-{end} of {items.length}
					{/snippet}

					<IconButton 
						class="material-icons" 
						action="first-page" 
						title="First page" 
						onclick={() => {currentPage = 1}} 
						disabled={currentPage === 1}>first_page</IconButton
						>
					<IconButton 
						class="material-icons" 
						action="prev-page" 
						title="Prev page" 
						onclick={() => currentPage--} 
						disabled={currentPage === 1}>chevron_left</IconButton>
					<IconButton 
						class="material-icons" 
						action="next-page" 
						title="Next page" 
						onclick={() => currentPage++} 
						disabled={currentPage === 0}>chevron_right</IconButton>
					<IconButton 
						class="material-icons" 
						action="last-page" 
						title="Next page" 
						onclick={() => currentPage++} 
						disabled={currentPage === 0}>last_page</IconButton>
				</Pagination>
			{/snippet}
		</DataTable>
	</div>
</main>
