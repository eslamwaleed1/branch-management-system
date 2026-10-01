import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBusinessData } from "../../../hooks/useBusinessData.js";
import { useCreateBusinessData } from "../../../hooks/useBusinessMutation.js";

const inputClass =
	"btn-base input-field border border-blue-300 focus:ring-blue-300";

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
			className="flex flex-col items-center gap-[10px] pt-[2rem] w-[18rem]"
		>
			<input
				className={inputClass}
				placeholder="Name"
				value={form.name}
				required
				onChange={(event) => update("name", event.target.value)}
			/>
			<select
				className={inputClass}
				value={form.branchName}
				required
				disabled={loading}
				onChange={(event) => update("branchName", event.target.value)}
			>
				<option value="">Select branch</option>
				{availableBranches.map((branch) => (
					<option key={branch._id} value={branch.name}>
						{branch.name}
					</option>
				))}
			</select>
			<input
				className={inputClass}
				type="email"
				placeholder="Email"
				value={form.email}
				required
				onChange={(event) => update("email", event.target.value)}
			/>
			<input
				className={inputClass}
				placeholder="Phone number"
				value={form.phone}
				onChange={(event) => update("phone", event.target.value)}
			/>
			<button
				type="submit"
				className="btn-base input-submit bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 cursor-pointer"
			>
				Add Client
			</button>
		</form>
	);
}
