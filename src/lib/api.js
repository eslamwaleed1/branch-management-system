const API_BASE_URL = "https://branch-management-system-backend-express.onrender.com/api";

export async function apiFetch(path, options) {
	const response = await fetch(`${API_BASE_URL}${path}`, options);
	if (!response.ok) {
		const payload = await response.json().catch(() => ({}));
		throw new Error(payload.message || "Request failed");
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

export const api = {
	branches: () => apiFetch("/branches"),
	employees: () => apiFetch("/employees"),
	clients: () => apiFetch("/clients"),
	sales: () => apiFetch("/sales"),
	products: () => apiFetch("/products"),
};
