import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBusinessData } from "../../../hooks/useBusinessData.js";
import { useCreateBusinessData } from "../../../hooks/useBusinessMutation.js";

const inputClass =
	"btn-base input-field border border-blue-300 focus:ring-blue-300";

export default function ProductForm({
	targetPath = "/ceo/inventory",
	branchId = "",
}) {
	const [form, setForm] = useState({ name: "", category: "" });
	const [inventories, setInventories] = useState([
		{ branchName: "", price: "", stock: "" },
	]);
	const { data: branches, loading } = useBusinessData("branches");
	const availableBranches = branchId
		? branches.filter((branch) => branch._id === branchId)
		: branches;
	const navigate = useNavigate();
	const createProduct = useCreateBusinessData("products");
	const updateInventory = (index, field, value) =>
		setInventories((current) =>
			current.map((item, itemIndex) =>
				itemIndex === index ? { ...item, [field]: value } : item,
			),
		);
	const handleSubmit = async (event) => {
		event.preventDefault();
		console.log(form);
		await createProduct.mutateAsync({
			product: form,
			branchInventories: inventories.map((item) => ({
				...item,
				price: Number(item.price),
				stock: Number(item.stock),
			})),
		});
		navigate(targetPath);
	};
	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col items-center gap-[10px] pt-[2rem] w-[22rem]"
		>
			<input
				className={inputClass}
				placeholder="Product name"
				value={form.name}
				required
				onChange={(event) => setForm({ ...form, name: event.target.value })}
			/>
			<input
				className={inputClass}
				placeholder="Category"
				value={form.category}
				onChange={(event) => setForm({ ...form, category: event.target.value })}
			/>
			{inventories.map((item, index) => (
				<div
					key={index}
					className="flex w-full flex-col gap-[10px] border border-gray-200 p-3"
				>
					<select
						className={inputClass}
						value={item.branchName}
						required
						disabled={loading}
						onChange={(event) =>
							updateInventory(index, "branchName", event.target.value)
						}
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
						type="number"
						min="0"
						step="0.01"
						placeholder="Price"
						value={item.price}
						required
						onChange={(event) =>
							updateInventory(index, "price", event.target.value)
						}
					/>
					<input
						className={inputClass}
						type="number"
						min="0"
						placeholder="Stock"
						value={item.stock}
						required
						onChange={(event) =>
							updateInventory(index, "stock", event.target.value)
						}
					/>
				</div>
			))}
			<button
				type="button"
				className="btn-base border border-blue-300 px-3 py-1"
				onClick={() =>
					setInventories([
						...inventories,
						{ branchName: "", price: "", stock: "" },
					])
				}
			>
				+ Add branch inventory
			</button>
			<button
				type="submit"
				className="btn-base input-submit bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 cursor-pointer"
			>
				Add Product
			</button>
		</form>
	);
}
