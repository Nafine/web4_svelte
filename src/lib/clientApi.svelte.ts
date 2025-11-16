let accessToken: String | null = $state(null);

export function revokeAccessToken() {
	console.log('token revoked');
	accessToken = null;
}

export async function apiFetch(url: string, options: any = {}, providedFetch = fetch) {
	options.headers = options.headers ?? {};

	if (accessToken != null) {
		options.headers['Authorization'] = 'Bearer ' + accessToken;
	}

	let response = await providedFetch(url, options);

	if (response.status === 401) {
		const refreshResp = await providedFetch('/api/refresh', {
			method: 'POST',
			credentials: 'include'
		});

		if (refreshResp.ok) {
			const newToken = (await refreshResp.json()).token;
			accessToken = newToken;

			options.headers['Authorization'] = 'Bearer ' + newToken;
			response = await providedFetch(url, options);
		}
	}

	return response;
}
