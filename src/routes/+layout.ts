import { goto } from '$app/navigation';
import type { LayoutLoad } from './$types';
import { api } from '$lib/api';

export const ssr = false;
export const load: LayoutLoad = async ({ url }) => {
	await api({
		method: 'post',
		url: '/check'
	})
		.then((res) => {
			if (res.status == 200 && url.pathname != '/main') {
				goto('/main');
			}
		})
		.catch(() =>{
			if (url.pathname != '/') {
				goto('/');
			}
		});
};
