import NoEntityFound from "../NoEntityFound.jsx";

function getInitials(name = "") {
	return name
		.split(" ")
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0].toUpperCase())
		.join("");
}

export default function EmployeeKanban({
	employees,
	openViewModal,
	openEditModal,
	deleteEmployee,
}) {
	if (employees.length === 0) return <NoEntityFound entity="employees" />;

	const employeesByPosition = employees.reduce((groups, employee) => {
		const position = employee.position || "Unassigned";
		groups[position] ??= [];
		groups[position].push(employee);
		return groups;
	}, {});

	return (
		<div className="overflow-x-auto pb-4">
			<div className="flex min-w-max gap-6">
				{Object.entries(employeesByPosition).map(
					([position, positionEmployees]) => (
						<div
							key={position}
							className="w-80 flex-shrink-0 rounded-lg border border-gray-200 bg-gray-50 p-4"
						>
							<div className="mb-4">
								<h3 className="font-semibold text-gray-900">{position}</h3>
								<p className="text-sm text-gray-500">
									{positionEmployees.length} employee
									{positionEmployees.length !== 1 ? "s" : ""}
								</p>
							</div>
							<div className="space-y-3">
								{positionEmployees.map((employee) => (
									<div
										key={employee._id}
										className="rounded-lg border border-gray-200 bg-white p-4 transition hover:shadow-md"
									>
										<div className="mb-3 flex items-start gap-2">
											<div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
												{getInitials(employee.name)}
											</div>
											<div className="min-w-0">
												<p className="truncate text-sm font-medium text-gray-900">
													{employee.name}
												</p>
												<p className="truncate text-xs text-gray-500">
													{employee.email}
												</p>
											</div>
										</div>
										{employee.phone && (
											<p className="mb-2 text-xs text-gray-600">
												{employee.phone}
											</p>
										)}
										{employee.salary && (
											<p className="mb-3 text-xs text-gray-600">
												${Number(employee.salary).toLocaleString()}
											</p>
										)}
										<div className="flex gap-1 border-t border-gray-100 pt-3">
											<button
												onClick={() => openViewModal(employee)}
												type="button"
												className="flex-1 rounded py-1.5 text-xs font-medium text-blue-600 transition hover:bg-blue-50"
											>
												View
											</button>
											<button
												onClick={() => openEditModal(employee)}
												type="button"
												className="flex-1 rounded py-1.5 text-xs font-medium text-amber-600 transition hover:bg-amber-50"
											>
												Edit
											</button>
											<button
												onClick={() => deleteEmployee(employee._id)}
												type="button"
												className="flex-1 rounded py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
											>
												Delete
											</button>
										</div>
									</div>
								))}
							</div>
						</div>
					),
				)}
			</div>
		</div>
	);
}
