import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBusinessData } from "../../../hooks/useBusinessData.js";
import { useCreateBusinessData } from "../../../hooks/useBusinessMutation.js";

const inputClass =
	"w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100";

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

export default function ClientForm({
	targetPath = "/ceo/clients",
	branchId = "",
}) {
	const [form, setForm] = useState({
		name: "",
		branchName: "",
		email: "",
		phone: "",
	});
	const { data: branches, loading } = useBusinessData("branches");
	const availableBranches = branchId
		? branches.filter((branch) => branch._id === branchId)
		: branches;
	const navigate = useNavigate();
	const createClient = useCreateBusinessData("clients");
	const update = (field, value) =>
		setForm((current) => ({ ...current, [field]: value }));
	const handleSubmit = async (event) => {
		event.preventDefault();
		console.log(JSON.stringify(form));
		await createClient.mutateAsync(form);
		navigate(targetPath);
	};
	return (
		<form
			onSubmit={handleSubmit}
			className="w-full max-w-5xl rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
		>
			<div className="mb-7 border-b border-slate-100 pb-5">
				<h2 className="text-lg font-semibold text-slate-900">Client details</h2>
				<p className="mt-1 text-sm text-slate-500">
					Add the client's contact information and branch.
				</p>
			</div>
			<div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
				<FormField
					id="client-name"
					label="Full name"
					example="Example: Morgan Rivera"
				>
					<input
						id="client-name"
						className={inputClass}
						placeholder="Enter full name"
						value={form.name}
						required
						autoComplete="name"
						onChange={(event) => update("name", event.target.value)}
					/>
				</FormField>
				<FormField
					id="client-branch"
					label="Branch"
					example="Example: Downtown branch"
				>
					<select
						id="client-branch"
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
					id="client-email"
					label="Email address"
					example="Example: morgan.rivera@email.com"
				>
					<input
						id="client-email"
						className={inputClass}
						type="email"
						placeholder="name@email.com"
						value={form.email}
						required
						autoComplete="email"
						onChange={(event) => update("email", event.target.value)}
					/>
				</FormField>
				<FormField
					id="client-phone"
					label="Phone number"
					example="Example: +1 (555) 010-2040"
				>
					<input
						id="client-phone"
						className={inputClass}
						type="tel"
						placeholder="Enter phone number"
						value={form.phone}
						autoComplete="tel"
						onChange={(event) => update("phone", event.target.value)}
					/>
				</FormField>
			</div>
			<div className="mt-8 flex justify-end border-t border-slate-100 pt-6">
				<button
					type="submit"
					className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 sm:w-auto"
				>
					Add Client
				</button>
			</div>
		</form>
	);
}
