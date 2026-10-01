import { useMemo, useState } from "react";
import DataTable from "../../components/DataTable.jsx";
import AddEntityLink from "../../components/entity-components/AddEntityLink.jsx";
import RegionalManagerSidebar from "../../components/sidebar/RegionalManagerSidebar.jsx";
import {
	filterByBranch,
	useBusinessData,
} from "../../hooks/useBusinessData.js";

export default function RegionalManagerEmployeesPage({ branchId }) {
	const { data: employees, loading, error } = useBusinessData("employees");
	const [query, setQuery] = useState("");
	const [deletedIds, setDeletedIds] = useState([]);
	const [actionError, setActionError] = useState("");
	const rows = useMemo(
		() =>
			filterByBranch(employees, branchId).filter(
				(employee) =>
					!deletedIds.includes(employee._id) &&
					`${employee.name || ""} ${employee.position || ""} ${employee.email || ""}`
						.toLowerCase()
						.includes(query.toLowerCase()),
			),
		[employees, branchId, query, deletedIds],
	);
	const deleteEmployee = async (employee) => {
		if (!window.confirm(`Delete ${employee.name}? This cannot be undone.`))
			return;
		try {
			const response = await fetch(
				`http://localhost:5000/api/employees/${employee._id}`,
				{ method: "DELETE" },
			);
			if (!response.ok) throw new Error("Unable to delete this employee.");
			setDeletedIds((ids) => [...ids, employee._id]);
		} catch (requestError) {
			setActionError(requestError.message);
		}
	};
	const columns = [
		{
			key: "name",
			label: "Employee",
			render: (employee) => (
				<span className="font-medium text-gray-900">{employee.name}</span>
			),
		},
		{
			key: "position",
			label: "Position",
			render: (employee) => employee.position || "-",
		},
		{
			key: "email",
			label: "Email",
			render: (employee) => employee.email || "-",
		},
		{
			key: "phone",
			label: "Phone",
			render: (employee) => employee.phone || "-",
		},
		{
			key: "actions",
			label: "Actions",
			render: (employee) => (
				<button
					type="button"
					onClick={() => deleteEmployee(employee)}
					className="rounded-md px-2 py-1 text-sm font-medium text-rose-600 hover:bg-rose-50"
				>
					Delete
				</button>
			),
		},
	];
	return (
		<div className="flex min-h-dvh bg-[#F5F7F9]">
			<RegionalManagerSidebar branchId={branchId} />
			<main className="w-full overflow-y-auto px-5 py-8 sm:px-8">
				<div className="mx-auto max-w-7xl">
					<header className="mb-8 flex flex-wrap items-end justify-between gap-4">
						<div>
							<h1 className="text-3xl font-semibold tracking-tight text-gray-900">
								Employees
							</h1>
							<p className="mt-2 text-sm text-gray-500">
								Team members assigned to this branch.
							</p>
						</div>
						<div className="flex flex-wrap gap-2">
							<input
								aria-label="Search employees"
								value={query}
								onChange={(event) => setQuery(event.target.value)}
								placeholder="Search employees..."
								className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-400"
							/>
							<AddEntityLink entity="Employee" link="new" />
						</div>
					</header>
					{loading && (
						<p className="text-sm text-gray-500">Loading employees...</p>
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
						<DataTable
							columns={columns}
							rows={rows.map((row) => ({ ...row, id: row._id }))}
						/>
					)}
				</div>
			</main>
		</div>
	);
}
