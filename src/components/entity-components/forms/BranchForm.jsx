import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateBusinessData } from "../../../hooks/useBusinessMutation.js";

const inputClass =
	"w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

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

export default function BranchForm({ targetPath = "/ceo/main" }) {
	const [form, setForm] = useState({ name: "", location: "", phone: "" });
	const navigate = useNavigate();
	const createBranch = useCreateBusinessData("branches");
	const update = (field, value) =>
		setForm((current) => ({ ...current, [field]: value }));
	const handleSubmit = async (event) => {
		event.preventDefault();
		await createBranch.mutateAsync(form);
		navigate(targetPath);
	};
	return (
		<form
			onSubmit={handleSubmit}
			className="w-full max-w-5xl rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
		>
			<div className="mb-7 border-b border-slate-100 pb-5">
				<h2 className="text-lg font-semibold text-slate-900">Branch details</h2>
				<p className="mt-1 text-sm text-slate-500">
					Set up the branch and its contact information.
				</p>
			</div>
			<div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
				<FormField
					id="branch-name"
					label="Branch name"
					example="Example: Downtown"
				>
					<input
						id="branch-name"
						className={inputClass}
						placeholder="Enter branch name"
						value={form.name}
						required
						onChange={(event) => update("name", event.target.value)}
					/>
				</FormField>
				<FormField
					id="branch-location"
					label="Location"
					example="Example: 25 Market Street, Springfield"
				>
					<input
						id="branch-location"
						className={inputClass}
						placeholder="Enter branch address or area"
						value={form.location}
						autoComplete="street-address"
						onChange={(event) => update("location", event.target.value)}
					/>
				</FormField>
				<FormField
					id="branch-phone"
					label="Phone number"
					example="Example: +1 (555) 010-2040"
				>
					<input
						id="branch-phone"
						className={inputClass}
						type="tel"
						placeholder="Enter branch phone number"
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
					Add Branch
				</button>
			</div>
		</form>
	);
}
