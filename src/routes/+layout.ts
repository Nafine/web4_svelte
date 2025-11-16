import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { apiFetch } from '$lib/clientApi.svelte';

export const ssr = false;
export const load: LayoutLoad = async ({ url, fetch }) => {
	const res = await apiFetch('/api/check', { method: 'POST' }, fetch);
	if (res.status != 200 && url.pathname != '/') {
		redirect(302, '/');
	} else if (res.status == 200 && url.pathname != '/main') {
		redirect(302, '/main');
	}
};
