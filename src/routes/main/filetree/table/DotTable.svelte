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

<div class="table-container">
	<DataTable stickyHeader>
		<Head>
			<Row>
				<Cell numeric style="width: 13%;">X</Cell>
				<Cell numeric style="width: 13%;">Y</Cell>
				<Cell numeric style="width: 13%;">R</Cell>
				<Cell>Hit</Cell>
				<Cell style="width: 30%;">Time</Cell>
				<Cell numeric style="width: 20%">Execution time</Cell>
			</Row>
		</Head>

		<Body>
			{#each items as item (item.timestamp)}
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
	:global(table) {
		width: 100%;
	}

	@media (max-width: 760px) {
		:global(table){
			width: auto;
		}

		.table-container {
			width: 100%;
			max-width: 400px;
			overflow-x: auto;
		}
	}
</style>
