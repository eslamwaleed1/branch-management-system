import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api.js";

export function useBusinessData(resource) {
	const query = useQuery({
		queryKey: ["business-data", resource],
		queryFn: () => api[resource](),
		select: (result) => (Array.isArray(result) ? result : result?.value || []),
		staleTime: 30_000,
		gcTime: 5 * 60_000,
		retry: 1,
	});

	return {
		data: query.data || [],
		loading: query.isPending,
		error: query.error?.message || "",
	};
}

export function filterByBranch(items, branchId) {
	if (!branchId) return items;
	return items.filter((item) => {
		const branch = item.branch?._id || item.branch;
		return branch?.toString() === branchId.toString();
	});
}
