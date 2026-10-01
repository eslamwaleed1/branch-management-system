import { useEffect, useMemo, useState } from "react";
import CEOSidebar from "../../components/sidebar/CEOSidebar.jsx";
import DataTable from "../../components/DataTable.jsx";
import AddEntityLink from "../../components/entity-components/AddEntityLink.jsx";
import ToggleViewModeButtons from "../../components/entity-components/ToggleViewModeButtons.jsx";
import EmployeeCard from "../../components/entity-components/employee-components/EmployeeCard.jsx";
import EmployeeKanban from "../../components/entity-components/employee-components/EmployeeKanban.jsx";
import EmployeeViewModal from "../../components/entity-components/employee-components/EmployeeViewModal.jsx";
import EmployeeEditModal from "../../components/entity-components/employee-components/EmployeeEditModal.jsx";
import {
	filterByBranch,
	useBusinessData,
} from "../../hooks/useBusinessData.js";

export default function CEOEmployeesPage({ branchId }) {
	const { data: employees, loading, error } = useBusinessData("employees");
	const { data: branches } = useBusinessData("branches");
	const [query, setQuery] = useState("");
	const [selectedBranchId, setSelectedBranchId] = useState(branchId || "");
	const [deletedIds, setDeletedIds] = useState([]);
	const [actionError, setActionError] = useState("");
	const [viewMode, setViewMode] = useState("table");
	const [viewingEmployee, setViewingEmployee] = useState(null);
	const [editingEmployee, setEditingEmployee] = useState(null);
	const [editForm, setEditForm] = useState({});
	useEffect(() => setSelectedBranchId(branchId || ""), [branchId]);
	const rows = useMemo(
		() =>
			filterByBranch(employees, selectedBranchId).filter(
				(employee) =>
					!deletedIds.includes(employee._id) &&
					`${employee.name || ""} ${employee.email || ""} ${employee.position || ""} ${employee.branch?.name || ""}`
						.toLowerCase()
						.includes(query.toLowerCase()),
			),
		[employees, selectedBranchId, query, deletedIds],
	);
	const deleteEmployee = async (employeeOrId) => {
		const employee =
			typeof employeeOrId === "string"
				? employees.find((item) => item._id === employeeOrId)
				: employeeOrId;
		if (!employee) return;
		if (!window.confirm(`Delete ${employee.name}? This cannot be undone.`))
			return;
		setActionError("");
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
	const openEditModal = (employee) => {
		setEditingEmployee(employee);
		setEditForm({
			name: employee.name || "",
			position: employee.position || "",
			email: employee.email || "",
			phone: employee.phone || "",
			salary: employee.salary || "",
			dateHired: employee.dateHired || "",
		});
	};
	const updateEmployee = async (employeeId, nextEmployee) => {
		try {
			const response = await fetch(
				`http://localhost:5000/api/employees/${employeeId}`,
				{
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(nextEmployee),
				},
			);
			if (!response.ok) throw new Error("Unable to update this employee.");
			setEditingEmployee(null);
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
			key: "branch",
			label: "Branch",
			render: (employee) => employee.branch?.name || "-",
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
			<CEOSidebar branchId={branchId} />
			<main className="w-full overflow-y-auto px-5 py-8 sm:px-8">
				<div className="mx-auto max-w-7xl">
					<header className="mb-8 flex flex-wrap items-end justify-between gap-4">
						<div>
							<h1 className="text-3xl font-semibold tracking-tight text-gray-900">
								Employees
							</h1>
							<p className="mt-2 text-sm text-gray-500">
								Team members{" "}
								{branchId ? "for this branch" : "across the business"}.
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
							{!branchId && (
								<select
									aria-label="Filter employees by branch"
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
						<AddEntityLink entity="Employee" link="new" />
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
								{rows.map((employee) => (
									<EmployeeCard
										key={employee._id}
										employee={employee}
										openViewModal={setViewingEmployee}
										openEditModal={openEditModal}
										deleteEmployee={deleteEmployee}
									/>
								))}
							</div>
						) : (
							<EmployeeKanban
								employees={rows}
								openViewModal={setViewingEmployee}
								openEditModal={openEditModal}
								deleteEmployee={deleteEmployee}
							/>
						))}
				</div>
			</main>
			{viewingEmployee && (
				<EmployeeViewModal
					employee={viewingEmployee}
					closeViewModal={() => setViewingEmployee(null)}
					openEditModal={(employee) => {
						setViewingEmployee(null);
						openEditModal(employee);
					}}
				/>
			)}
			{editingEmployee && (
				<EmployeeEditModal
					employee={editingEmployee}
					editForm={editForm}
					setEditForm={setEditForm}
					updateEmployee={updateEmployee}
					closeEditModal={() => setEditingEmployee(null)}
				/>
			)}
		</div>
	);
}
