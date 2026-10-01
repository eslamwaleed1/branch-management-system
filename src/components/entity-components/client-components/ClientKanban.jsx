import NoEntityFound from "../NoEntityFound.jsx";

export default function ClientKanban({ clients, openViewModal, deleteClient }) {
	if (clients.length === 0) return <NoEntityFound entity="clients" />;

	const clientsByBranch = clients.reduce((groups, client) => {
		const branch = client.branch?.name || client.branch || "Unassigned";
		groups[branch] ??= [];
		groups[branch].push(client);
		return groups;
	}, {});

	return (
		<div className="overflow-x-auto pb-4">
			<div className="flex min-w-max gap-6">
				{Object.entries(clientsByBranch).map(([branch, branchClients]) => (
					<section
						key={branch}
						className="w-80 flex-shrink-0 rounded-lg border border-gray-200 bg-gray-50 p-4"
					>
						<div className="mb-4">
							<h3 className="font-semibold text-gray-900">{branch}</h3>
							<p className="text-sm text-gray-500">
								{branchClients.length} client
								{branchClients.length !== 1 ? "s" : ""}
							</p>
						</div>
						<div className="space-y-3">
							{branchClients.map((client) => (
								<article
									key={client._id}
									className="rounded-lg border border-gray-200 bg-white p-4 transition hover:shadow-md"
								>
									<p className="truncate text-sm font-medium text-gray-900">
										{client.name}
									</p>
									<p className="mt-1 truncate text-xs text-gray-500">
										{client.email || "No email"}
									</p>
									{client.phone && (
										<p className="mt-2 text-xs text-gray-600">{client.phone}</p>
									)}
									<div className="mt-3 flex gap-1 border-t border-gray-100 pt-3">
										<button
											type="button"
											onClick={() => openViewModal(client)}
											className="flex-1 rounded py-1.5 text-xs font-medium text-blue-600 transition hover:bg-blue-50"
										>
											View
										</button>
										<button
											type="button"
											onClick={() => deleteClient(client)}
											className="flex-1 rounded py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
										>
											Delete
										</button>
									</div>
								</article>
							))}
						</div>
					</section>
				))}
			</div>
		</div>
	);
}
