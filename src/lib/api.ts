import axios from 'axios';

const token =
  typeof window !== 'undefined' && typeof localStorage !== 'undefined'
    ? localStorage.getItem('accessToken')
    : null;

let accessToken: string | null = token;

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
			if (accessToken) localStorage.setItem('accessToken', accessToken);
		}
	} catch {
		throw new Error('Failed to refresh access token');
	}
}

export async function logout() {
	try {
		accessToken = null;
		localStorage.removeItem('accessToken');
		await refreshclient.post('/logout');
	} catch {}
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
