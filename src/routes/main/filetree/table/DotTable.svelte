<script lang="ts">
	import { onMount } from 'svelte';
	import { fetchPage, fetchLastPage, type Dot, type Page } from '$lib/dotApi';
	import DataTable, { Head, Body, Row, Cell, Pagination } from '@smui/data-table';
	import IconButton from '@smui/icon-button';

	type Props = {
		items: Dot[];
		pageSize: number;
	};

	let { items = $bindable(), pageSize }: Props = $props();

	let currentPage = $state(1);
	let fetching = $state(false);
	let hasNext = $state(false);

	onMount(setLastPage);

	async function fetchBy(fetchingFunction: (...args: any[]) => Promise<Page>, ...args: any[]) {
		fetching = true;
		let json = await fetchingFunction(...args);
		items = json.dots;
		hasNext = json.hasNext;
		currentPage = json.page;
		fetching = false;
	}

	export async function setPage(page: number) {
		await fetchBy(fetchPage, page, pageSize);
	}

	export async function setLastPage() {
		await fetchBy(fetchLastPage, pageSize);
	}
</script>

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
					{(currentPage - 1) * pageSize + 1}-{(currentPage - 1) * pageSize +
						Math.min(currentPage * pageSize, items.length)}
				{/snippet}

				<IconButton
					class="material-icons"
					action="first-page"
					title="First page"
					onclick={() => {
						setPage(1);
					}}
					disabled={currentPage === 1 || fetching}>first_page</IconButton
				>
				<IconButton
					class="material-icons"
					action="prev-page"
					title="Prev page"
					onclick={() => {
						setPage(currentPage - 1);
					}}
					disabled={currentPage === 1 || fetching}>chevron_left</IconButton
				>
				<IconButton
					class="material-icons"
					action="next-page"
					title="Next page"
					onclick={() => {
						setPage(currentPage + 1);
					}}
					disabled={!hasNext || fetching}>chevron_right</IconButton
				>
				<IconButton
					class="material-icons"
					action="last-page"
					title="Next page"
					onclick={() => {
						setLastPage();
					}}
					disabled={!hasNext || fetching}>last_page</IconButton
				>
			</Pagination>
		{/snippet}
	</DataTable>
</div>

<style>
	.table-wrapper {
		width: 100%;
		overflow-y: auto;
	}
</style>
