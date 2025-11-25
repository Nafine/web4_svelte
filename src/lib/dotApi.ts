import { api } from '$lib/api';

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

export function sendDot(dot: DotDto) {
	return api({
		method: 'post',
		url: '/hit',
		headers: { 'Content-Type': 'application/json' },
		data: JSON.stringify(dot)
	});
}

export function fetchPage(page: number, size: number): Promise<Page> {
	return api.get(`/dots?page=${page}&size=${size}`).then((r) => r.data);
}

export function fetchLastPage(size: number): Promise<Page> {
	return api.get(`/dots/last?size=${size}`).then((r) => r.data);
}
