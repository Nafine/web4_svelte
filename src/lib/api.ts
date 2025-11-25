import axios from 'axios';

let accessToken: string | null = null;

export const api = axios.create({
	baseURL: '/api',
	withCredentials: true
});

const refreshclient = axios.create({
	baseURL: '/api',
	withCredentials: true
});

export async function refresh() {
	try {
		const res = await refreshclient.post('/refresh');
		if (res.status === 200) {
			accessToken = res.data.token;
		}
	} catch {
		throw new Error('Failed to refresh access token');
	}
}

api.interceptors.request.use((config) => {
	if (accessToken) config.headers.setAuthorization('Bearer ' + accessToken);

	return config;
});

api.interceptors.response.use(
	(res) => res,
	async (error) => {
		const config = error.config;
		if (error.response?.status === 401 && !config.called) {
			config.called = true;
			try {
				await refresh();
				return api(error.config);
			} catch {
				return Promise.reject(error);
			}
		}

		return Promise.reject(error);
	}
);
