import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createResource, deleteResource, updateResource } from "../lib/api.js";

function useBusinessMutation(resource, mutationFn) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn,
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ["business-data", resource] }),
	});
}

export function useCreateBusinessData(resource) {
	return useBusinessMutation(resource, (payload) =>
		createResource(resource, payload),
	);
}

export function useUpdateBusinessData(resource) {
	return useBusinessMutation(resource, ({ id, payload }) =>
		updateResource(resource, id, payload),
	);
}

export function useDeleteBusinessData(resource) {
	return useBusinessMutation(resource, (id) => deleteResource(resource, id));
}
