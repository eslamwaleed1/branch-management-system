import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createResource } from "../lib/api.js";

export function useCreateBusinessData(resource) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload) => createResource(resource, payload),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ["business-data", resource] }),
	});
}
