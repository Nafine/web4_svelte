import type { Handle } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

console.log(env.BACKEND_HOST);

export const handle: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/api/')) {
		const backendHost = env.BACKEND_HOST ?? 'http://localhost:9080';

		const targetUrl = new URL(
			event.url.pathname.replace('/api/', '/web4/api/') +
				(event.url.searchParams.toString() ? `?${event.url.searchParams.toString()}` : ''),
			backendHost
		);

		const resp = await event.fetch(targetUrl, event.request);

		return new Response(resp.body, {
			status: resp.status,
			statusText: resp.statusText,
			headers: resp.headers
		});
	}

	return resolve(event);
};
