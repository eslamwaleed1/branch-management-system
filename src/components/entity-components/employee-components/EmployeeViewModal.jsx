import { UserCircle, X } from "lucide-react";

export default function EmployeeViewModal({
	employee,
	closeViewModal,
	openEditModal,
}) {
	const details = [
		["Email Address", employee.email],
		["Phone Number", employee.phone],
		[
			"Salary",
			employee.salary && `$${Number(employee.salary).toLocaleString()}`,
		],
		[
			"Date Hired",
			employee.dateHired &&
				new Date(employee.dateHired).toLocaleDateString("en-US", {
					year: "numeric",
					month: "short",
					day: "numeric",
				}),
		],
	];

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 px-4 py-6 backdrop-blur-sm"
			onMouseDown={(event) =>
				event.target === event.currentTarget && closeViewModal()
			}
		>
			<div className="grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl md:grid-cols-3">
				<div className="flex flex-col items-center justify-center border-gray-200 bg-gray-50 p-8 md:col-span-1 md:border-r md:p-10">
					<div className="mb-6 flex h-32 w-32 items-center justify-center overflow-hidden rounded-lg bg-gray-300 shadow-sm md:h-40 md:w-40">
						{employee.photo ? (
							<img
								src={employee.photo}
								alt={employee.name}
								className="h-full w-full object-cover"
							/>
						) : (
							<UserCircle size={96} className="text-gray-500" strokeWidth={1} />
						)}
					</div>
					<h3 className="text-center text-lg font-semibold text-gray-900">
						{employee.name}
					</h3>
					<p className="mt-1 text-center text-sm font-medium text-gray-600">
						{employee.position || employee.jobTitle}
					</p>
				</div>
				<div className="flex flex-col justify-between p-8 md:col-span-2 md:p-10">
					<div>
						<div className="mb-8 flex items-start justify-between">
							<div>
								<p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
									Employee Information
								</p>
								<h2 className="mt-2 text-2xl font-bold text-gray-900">
									Profile Details
								</h2>
							</div>
							<button
								type="button"
								onClick={closeViewModal}
								aria-label="Close"
								className="text-gray-400 transition hover:text-gray-600"
							>
								<X />
							</button>
						</div>
						<div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
							{details
								.filter(([, value]) => value)
								.map(([label, value]) => (
									<div key={label}>
										<p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-600">
											{label}
										</p>
										<p className="break-all text-sm font-medium text-gray-800 md:text-base">
											{value}
										</p>
									</div>
								))}
						</div>
					</div>
					<div className="flex gap-3 border-t border-gray-200 pt-6">
						<button
							type="button"
							onClick={() => openEditModal(employee)}
							className="flex-1 rounded bg-slate-700 px-4 py-2.5 font-medium text-white transition hover:bg-slate-800"
						>
							Edit Employee
						</button>
						<button
							type="button"
							className="flex-1 rounded bg-gray-100 px-4 py-2.5 font-medium text-gray-800 transition hover:bg-gray-200"
						>
							Go to Employee's Page
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
