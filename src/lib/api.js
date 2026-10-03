// const API_BASE_URL =
// 	import.meta.env.VITE_API_BASE_URL ||
// 	"https://branch-management-system-backend-express.onrender.com/api";

const API_BASE_URL = "http://localhost:5000/api"

export async function apiFetch(path, options = {}) {
	const response = await fetch(`${API_BASE_URL}${path}`, {
		...options,
		credentials: options.credentials || "include",
	});
	if (!response.ok) {
		const payload = await response.json().catch(() => ({}));
		const error = new Error(payload.message || "Request failed");
		error.code = payload.code;
		error.status = response.status;
		throw error;
	}
	if (response.status === 204) return null;
	return response.json();
}

export function createResource(resource, payload) {
	return apiFetch(`/${resource}`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});
}

export function updateResource(resource, id, payload) {
	return apiFetch(`/${resource}/${id}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});
}

export function deleteResource(resource, id) {
	return apiFetch(`/${resource}/${id}`, { method: "DELETE" });
}

const postJson = (path, payload, csrfToken) =>
	apiFetch(path, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"X-CSRF-Token": csrfToken,
		},
		body: JSON.stringify(payload),
	});

export const authApi = {
	csrfToken: () => apiFetch("/auth/csrf"),
	session: () => apiFetch("/auth/session"),
	login: (credentials, csrfToken) =>
		postJson("/auth/login", credentials, csrfToken),
	logout: (csrfToken) => postJson("/auth/logout", {}, csrfToken),
	signup: (credentials, csrfToken) =>
		postJson("/auth/signup", credentials, csrfToken),
	verifyEmail: (email, code, csrfToken) =>
		postJson("/auth/verification/confirm", { email, code }, csrfToken),
	resendVerification: (email, csrfToken) =>
		postJson("/auth/verification/resend", { email }, csrfToken),
	googleUrl: (intent) =>
		`${API_BASE_URL}/auth/google?intent=${encodeURIComponent(intent)}`,
};

export const api = {
	branches: () => apiFetch("/branches"),
	employees: () => apiFetch("/employees"),
	clients: () => apiFetch("/clients"),
	sales: () => apiFetch("/sales"),
	products: () => apiFetch("/products"),
};
