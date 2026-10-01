export default function EmployeeEditModal({
	employee,
	editForm,
	setEditForm,
	updateEmployee,
	closeEditModal,
}) {
	const fields = ["name", "position", "email", "phone", "salary", "dateHired"];

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/30 px-5 py-8 backdrop-blur-[2px]"
			onMouseDown={(event) =>
				event.target === event.currentTarget && closeEditModal()
			}
		>
			<form
				className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
				onSubmit={(event) => {
					event.preventDefault();
					updateEmployee(employee._id, editForm);
				}}
			>
				<div className="mb-6 flex items-start justify-between gap-4">
					<div>
						<p className="text-sm font-medium text-blue-500">
							Employee details
						</p>
						<h2 className="mt-1 text-xl font-semibold text-gray-900">
							Edit employee
						</h2>
					</div>
					<button
						type="button"
						onClick={closeEditModal}
						aria-label="Close edit employee window"
						className="text-2xl leading-none text-gray-400 transition hover:text-gray-700"
					>
						&times;
					</button>
				</div>
				<div className="space-y-4">
					{fields.map((field) => (
						<label
							key={field}
							className="block text-sm font-medium capitalize text-gray-700"
						>
							{field}
							<input
								type={
									field === "email"
										? "email"
										: field === "dateHired"
											? "date"
											: "text"
								}
								value={editForm[field]}
								onChange={(event) =>
									setEditForm({ ...editForm, [field]: event.target.value })
								}
								className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
							/>
						</label>
					))}
				</div>
				<div className="mt-7 flex justify-end gap-3">
					<button
						type="button"
						onClick={closeEditModal}
						className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
					>
						Cancel
					</button>
					<button
						type="submit"
						className="rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-600"
					>
						Save changes
					</button>
				</div>
			</form>
		</div>
	);
}
