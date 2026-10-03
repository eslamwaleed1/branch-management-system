import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBusinessData } from "../../../hooks/useBusinessData.js";
import { useCreateBusinessData } from "../../../hooks/useBusinessMutation.js";

const inputClass =
	"w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100";

const positions = [
	"Sales Rep",
	"Regional Manager",
	"Recitipoinest",
	"Quality Assurance",
	"Accountant",
	"HR",
	"Customer Service",
	"Supplier Relations",
	"Intern",
];

function FormField({ id, label, example, children }) {
	return (
		<div className="space-y-2">
			<label htmlFor={id} className="block text-sm font-medium text-slate-800">
				{label}
			</label>
			{children}
			<p className="text-xs leading-5 text-slate-500">{example}</p>
		</div>
	);
}

export default function EmployeeForm({
	targetPath = "/ceo/employees",
	branchId = "",
	allowRegionalManager = false,
}) {
	const [form, setForm] = useState({
		name: "",
		position: "",
		branchName: "",
		email: "",
		phone: "",
		salary: "",
		dateHired: "",
	});
	const { data: branches, loading } = useBusinessData("branches");
	const availableBranches = branchId
		? branches.filter((branch) => branch._id === branchId)
		: branches;
	const availablePositions = allowRegionalManager
		? positions
		: positions.filter((position) => position !== "Regional Manager");
	const navigate = useNavigate();
	const createEmployee = useCreateBusinessData("employees");
	const update = (field, value) =>
		setForm((current) => ({ ...current, [field]: value }));
	const handleSubmit = async (event) => {
		event.preventDefault();
		await createEmployee.mutateAsync(form);
		navigate(targetPath);
	};
	return (
		<form
			onSubmit={handleSubmit}
			className="w-full max-w-5xl rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
		>
			<div className="mb-7 border-b border-slate-100 pb-5">
				<h2 className="text-lg font-semibold text-slate-900">
					Employee details
				</h2>
				<p className="mt-1 text-sm text-slate-500">
					Enter the employee's information and assign their branch.
				</p>
			</div>
			<div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
				<FormField
					id="employee-name"
					label="Full name"
					example="Example: Jordan Lee"
				>
					<input
						id="employee-name"
						className={inputClass}
						placeholder="Enter full name"
						value={form.name}
						required
						autoComplete="name"
						onChange={(event) => update("name", event.target.value)}
					/>
				</FormField>
				<FormField
					id="employee-position"
					label="Position"
					example="Choose the employee's role in the business."
				>
					<select
						id="employee-position"
						className={inputClass}
						value={form.position}
						required
						onChange={(event) => update("position", event.target.value)}
					>
						<option value="" disabled>
							Select a position
						</option>
						{availablePositions.map((position) => (
							<option key={position} value={position}>
								{position}
							</option>
						))}
					</select>
				</FormField>
				<FormField
					id="employee-branch"
					label="Branch"
					example="Example: Downtown branch"
				>
					<select
						id="employee-branch"
						className={inputClass}
						value={form.branchName}
						required
						disabled={loading}
						onChange={(event) => update("branchName", event.target.value)}
					>
						<option value="" disabled>
							Select branch
						</option>
						{availableBranches.map((branch) => (
							<option key={branch._id} value={branch.name}>
								{branch.name}
							</option>
						))}
					</select>
				</FormField>
				<FormField
					id="employee-email"
					label="Email address"
					example="Example: jordan.lee@company.com"
				>
					<input
						id="employee-email"
						className={inputClass}
						type="email"
						placeholder="name@company.com"
						value={form.email}
						required
						autoComplete="email"
						onChange={(event) => update("email", event.target.value)}
					/>
				</FormField>
				<FormField
					id="employee-phone"
					label="Phone number"
					example="Example: +1 (555) 010-2040"
				>
					<input
						id="employee-phone"
						className={inputClass}
						type="tel"
						placeholder="Enter phone number"
						value={form.phone}
						autoComplete="tel"
						onChange={(event) => update("phone", event.target.value)}
					/>
				</FormField>
				<FormField
					id="employee-salary"
					label="Salary"
					example="Enter the annual salary amount, without symbols."
				>
					<input
						id="employee-salary"
						className={inputClass}
						type="number"
						min="0"
						placeholder="Example: 52000"
						value={form.salary}
						onChange={(event) => update("salary", event.target.value)}
					/>
				</FormField>
				<FormField
					id="employee-date-hired"
					label="Date hired"
					example="Select the employee's start date."
				>
					<input
						id="employee-date-hired"
						className={inputClass}
						type="date"
						value={form.dateHired}
						onChange={(event) => update("dateHired", event.target.value)}
					/>
				</FormField>
			</div>
			<div className="mt-8 flex justify-end border-t border-slate-100 pt-6">
				<button
					type="submit"
					className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 sm:w-auto"
				>
					Add Employee
				</button>
			</div>
		</form>
	);
}
