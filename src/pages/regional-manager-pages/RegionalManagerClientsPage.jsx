import { useMemo, useState } from "react";
import DataTable from "../../components/DataTable.jsx";
import AddEntityLink from "../../components/entity-components/AddEntityLink.jsx";
import RegionalManagerSidebar from "../../components/sidebar/RegionalManagerSidebar.jsx";
import {
	filterByBranch,
	useBusinessData,
} from "../../hooks/useBusinessData.js";

export default function RegionalManagerClientsPage({ branchId }) {
	const { data: clients, loading, error } = useBusinessData("clients");
	const [query, setQuery] = useState("");
	const [deletedIds, setDeletedIds] = useState([]);
	const [actionError, setActionError] = useState("");
	const rows = useMemo(
		() =>
			filterByBranch(clients, branchId).filter(
				(client) =>
					!deletedIds.includes(client._id) &&
					`${client.name} ${client.email} ${client.phone || ""}`
						.toLowerCase()
						.includes(query.toLowerCase()),
			),
		[clients, branchId, query, deletedIds],
	);
	const deleteClient = async (client) => {
		if (!window.confirm(`Delete ${client.name}? This cannot be undone.`))
			return;
		try {
			const response = await fetch(
				`http://localhost:5000/api/clients/${client._id}`,
				{ method: "DELETE" },
			);
			if (!response.ok) throw new Error("Unable to delete this client.");
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
		{ key: "email", label: "Email", render: (client) => client.email || "-" },
		{ key: "phone", label: "Phone", render: (client) => client.phone || "-" },
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
		<ManagerShell
			branchId={branchId}
			title="Clients"
			description="Customer relationships for this branch."
			action={<AddEntityLink entity="Client" link="new" />}
		>
			<input
				aria-label="Search clients"
				value={query}
				onChange={(event) => setQuery(event.target.value)}
				placeholder="Search clients..."
				className="mb-4 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-400"
			/>
			{loading && <Loading text="Loading clients..." />}
			{error && <ErrorMessage text={error} />}
			{actionError && <ErrorMessage text={actionError} />}
			{!loading && !error && (
				<DataTable
					columns={columns}
					rows={rows.map((row) => ({ ...row, id: row._id }))}
				/>
			)}
		</ManagerShell>
	);
}

function ManagerShell({ branchId, title, description, action, children }) {
	return (
		<div className="flex min-h-dvh bg-[#F5F7F9]">
			<RegionalManagerSidebar branchId={branchId} />
			<main className="w-full overflow-y-auto px-5 py-8 sm:px-8">
				<div className="mx-auto max-w-7xl">
					<header className="mb-8 flex flex-wrap items-end justify-between gap-4">
						<div>
							<h1 className="text-3xl font-semibold tracking-tight text-gray-900">
								{title}
							</h1>
							<p className="mt-2 text-sm text-gray-500">{description}</p>
						</div>
						{action}
					</header>
					{children}
				</div>
			</main>
		</div>
	);
}
function Loading({ text }) {
	return <p className="text-sm text-gray-500">{text}</p>;
}
function ErrorMessage({ text }) {
	return (
		<p className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">{text}</p>
	);
}
