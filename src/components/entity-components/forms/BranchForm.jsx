import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateBusinessData } from "../../../hooks/useBusinessMutation.js";

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
			className="flex flex-col items-center gap-[10px] pt-[2rem] w-[18rem]"
		>
			<input
				className="btn-base input-field border border-blue-300 focus:ring-blue-300"
				placeholder="Branch name"
				value={form.name}
				required
				onChange={(event) => update("name", event.target.value)}
			/>
			<input
				className="btn-base input-field border border-blue-300 focus:ring-blue-300"
				placeholder="Location"
				value={form.location}
				onChange={(event) => update("location", event.target.value)}
			/>
			<input
				className="btn-base input-field border border-blue-300 focus:ring-blue-300"
				placeholder="Phone"
				value={form.phone}
				onChange={(event) => update("phone", event.target.value)}
			/>
			<button
				type="submit"
				className="btn-base input-submit bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 cursor-pointer"
			>
				Add Branch
			</button>
		</form>
	);
}
