import { apiFetch } from '$lib/clientApi.svelte';

export type Dot = {
	x: number;
	y: number;
	r: number;
	result: boolean;
	timestamp: string;
	executionTime: number;
};

export type DotDto = {
	x: number;
	y: number;
	r: number;
	timestamp: string;
};

export type Page = {
	dots: Dot[];
	hasNext: boolean;
	page: number;
};

export async function sendDot(dot: DotDto) {
	return apiFetch('/api/hit', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(dot)
	});
}

export async function fetchPage(page: number, size: number): Promise<Page> {
	return apiFetch(`/api/dots?page=${page}&size=${size}`).then((r) => r.json());
}

export async function fetchLastPage(size: number): Promise<Page> {
	return apiFetch(`/api/dots/last?size=${size}`).then((r) => r.json());
}
