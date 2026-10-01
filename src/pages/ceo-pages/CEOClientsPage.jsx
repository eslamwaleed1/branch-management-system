import { useEffect, useMemo, useState } from "react";
import CEOSidebar from "../../components/sidebar/CEOSidebar.jsx";
import DataTable from "../../components/DataTable.jsx";
import {
	filterByBranch,
	useBusinessData,
} from "../../hooks/useBusinessData.js";
import { useDeleteBusinessData } from "../../hooks/useBusinessMutation.js";
import AddEntityLink from "../../components/entity-components/AddEntityLink.jsx";
import ToggleViewModeButtons from "../../components/entity-components/ToggleViewModeButtons.jsx";
import ClientCard from "../../components/entity-components/client-components/ClientCard.jsx";
import ClientKanban from "../../components/entity-components/client-components/ClientKanban.jsx";

export default function CEOClientsPage({ branchId }) {
	const { data: clients, loading, error } = useBusinessData("clients");
	const { data: branches } = useBusinessData("branches");
	const deleteClientMutation = useDeleteBusinessData("clients");
	const [query, setQuery] = useState("");
	const [selectedBranchId, setSelectedBranchId] = useState(branchId || "");
	const [deletedIds, setDeletedIds] = useState([]);
	const [actionError, setActionError] = useState("");
	const [viewMode, setViewMode] = useState("table");
	const [viewingClient, setViewingClient] = useState(null);
	useEffect(() => setSelectedBranchId(branchId || ""), [branchId]);
	const rows = useMemo(
		() =>
			filterByBranch(clients, selectedBranchId).filter(
				(client) =>
					!deletedIds.includes(client._id) &&
					`${client.name} ${client.email} ${client.branch?.name || ""}`
						.toLowerCase()
						.includes(query.toLowerCase()),
			),
		[clients, selectedBranchId, query, deletedIds],
	);
	const deleteClient = async (client) => {
		if (!window.confirm(`Delete ${client.name}? This cannot be undone.`))
			return;
		setActionError("");
		try {
			await deleteClientMutation.mutateAsync(client._id);
			setDeletedIds((ids) => [...ids, client._id]);
		} catch (requestError) {
			setActionError(requestError.message);
		}
	};
	const columns = [
		{
			key: "name",
			label: "Client",
			render: (client) => (
				<span className="font-medium text-gray-900">{client.name}</span>
			),
		},
		{ key: "email", label: "Email", render: (client) => client.email },
		{ key: "phone", label: "Phone", render: (client) => client.phone || "-" },
		{
			key: "branch",
			label: "Branch",
			render: (client) => client.branch?.name || "-",
		},
		{
			key: "actions",
			label: "Actions",
			render: (client) => (
				<button
					type="button"
					onClick={() => deleteClient(client)}
					className="rounded-md px-2 py-1 text-sm font-medium text-rose-600 hover:bg-rose-50"
				>
					Delete
				</button>
			),
		},
	];
	return (
		<div className="flex min-h-dvh bg-[#F5F7F9]">
			<CEOSidebar branchId={branchId} />
			<main className="w-full overflow-y-auto px-5 py-8 sm:px-8">
				<div className="mx-auto max-w-7xl">
					<header className="mb-8 flex flex-wrap items-end justify-between gap-4">
						<div>
							<h1 className="text-3xl font-semibold tracking-tight text-gray-900">
								Clients
							</h1>
							<p className="mt-2 text-sm text-gray-500">
								Customer relationships{" "}
								{branchId ? "for this branch" : "across the business"}.
							</p>
						</div>
						<div className="flex flex-wrap gap-2">
							<input
								aria-label="Search clients"
								value={query}
								onChange={(event) => setQuery(event.target.value)}
								placeholder="Search clients..."
								className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-400"
							/>
							{!branchId && (
								<select
									aria-label="Filter clients by branch"
									value={selectedBranchId}
									onChange={(event) => setSelectedBranchId(event.target.value)}
									className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-400"
								>
									<option value="">All branches</option>
									{branches.map((branch) => (
										<option key={branch._id} value={branch._id}>
											{branch.name}
										</option>
									))}
								</select>
							)}
						</div>
						<AddEntityLink entity="Client" link="new" />
					</header>
					{loading && (
						<p className="text-sm text-gray-500">Loading clients...</p>
					)}
					{error && (
						<p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
							{error}
						</p>
					)}
					{actionError && (
						<p className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">
							{actionError}
						</p>
					)}
					{!loading && !error && (
						<ToggleViewModeButtons
							viewMode={viewMode}
							setViewMode={setViewMode}
						/>
					)}
					{!loading &&
						!error &&
						(viewMode === "table" ? (
							<DataTable
								columns={columns}
								rows={rows.map((row) => ({ ...row, id: row._id }))}
							/>
						) : viewMode === "cards" ? (
							<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
								{rows.map((client) => (
									<ClientCard
										key={client._id}
										client={client}
										openViewModal={setViewingClient}
										deleteClient={deleteClient}
									/>
								))}
							</div>
						) : (
							<ClientKanban
								clients={rows}
								openViewModal={setViewingClient}
								deleteClient={deleteClient}
							/>
						))}
				</div>
			</main>
			{viewingClient && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 px-4"
					onMouseDown={(event) =>
						event.target === event.currentTarget && setViewingClient(null)
					}
				>
					<div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xl">
						<div className="flex items-start justify-between gap-4">
							<div>
								<p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
									Client information
								</p>
								<h2 className="mt-2 text-2xl font-bold text-gray-900">
									{viewingClient.name}
								</h2>
							</div>
							<button
								type="button"
								onClick={() => setViewingClient(null)}
								className="text-2xl leading-none text-gray-400"
							>
								&times;
							</button>
						</div>
						<div className="mt-6 space-y-4 text-sm">
							<p>
								<span className="font-semibold text-gray-500">Email:</span>{" "}
								{viewingClient.email || "-"}
							</p>
							<p>
								<span className="font-semibold text-gray-500">Phone:</span>{" "}
								{viewingClient.phone || "-"}
							</p>
							<p>
								<span className="font-semibold text-gray-500">Branch:</span>{" "}
								{viewingClient.branch?.name || viewingClient.branch || "-"}
							</p>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
