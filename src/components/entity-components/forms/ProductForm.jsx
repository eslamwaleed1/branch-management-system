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
	const canAddInventory =
		!loading && inventories.length < availableBranches.length;
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
			className="w-full max-w-5xl rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
		>
			<div className="mb-7 border-b border-slate-100 pb-5">
				<h2 className="text-lg font-semibold text-slate-900">
					Product details
				</h2>
				<p className="mt-1 text-sm text-slate-500">
					Describe the product, then set its price and stock for each branch.
				</p>
			</div>
			<div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
				<FormField
					id="product-name"
					label="Product name"
					example="Example: Wireless headphones"
				>
					<input
						id="product-name"
						className={inputClass}
						placeholder="Enter product name"
						value={form.name}
						required
						onChange={(event) => setForm({ ...form, name: event.target.value })}
					/>
				</FormField>
				<FormField
					id="product-category"
					label="Category"
					example="Example: Electronics"
				>
					<input
						id="product-category"
						className={inputClass}
						placeholder="Enter product category"
						value={form.category}
						onChange={(event) =>
							setForm({ ...form, category: event.target.value })
						}
					/>
				</FormField>
			</div>
			<div className="mt-8 space-y-4">
				<div>
					<h3 className="text-sm font-semibold text-slate-900">
						Branch inventory
					</h3>
					<p className="mt-1 text-xs leading-5 text-slate-500">
						Add the selling price and available quantity for each branch.
					</p>
				</div>
				{inventories.map((item, index) => (
					<div
						key={index}
						className="rounded-lg border border-slate-200 bg-slate-50/70 p-4 sm:p-5"
					>
						<p className="mb-4 text-xs font-semibold uppercase text-slate-500">
							Branch {index + 1}
						</p>
						<div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-3">
							<FormField
								id={`product-branch-${index}`}
								label="Branch"
								example="Choose a location."
							>
								<select
									id={`product-branch-${index}`}
									className={inputClass}
									value={item.branchName}
									required
									disabled={loading}
									onChange={(event) =>
										updateInventory(index, "branchName", event.target.value)
									}
								>
									<option value="" disabled>
										Select branch
									</option>
									{availableBranches
										.filter(
											(branch) =>
												branch.name === item.branchName ||
												!inventories.some(
													(otherItem, otherIndex) =>
														otherIndex !== index &&
														otherItem.branchName === branch.name,
												),
										)
										.map((branch) => (
											<option key={branch._id} value={branch.name}>
												{branch.name}
											</option>
										))}
								</select>
							</FormField>
							<FormField
								id={`product-price-${index}`}
								label="Price"
								example="Example: 49.99"
							>
								<input
									id={`product-price-${index}`}
									className={inputClass}
									type="number"
									min="0"
									step="0.01"
									placeholder="0.00"
									value={item.price}
									required
									onChange={(event) =>
										updateInventory(index, "price", event.target.value)
									}
								/>
							</FormField>
							<FormField
								id={`product-stock-${index}`}
								label="Stock quantity"
								example="Example: 24 units"
							>
								<input
									id={`product-stock-${index}`}
									className={inputClass}
									type="number"
									min="0"
									placeholder="Enter quantity"
									value={item.stock}
									required
									onChange={(event) =>
										updateInventory(index, "stock", event.target.value)
									}
								/>
							</FormField>
						</div>
					</div>
				))}
				<button
					type="button"
					className="inline-flex min-h-11 items-center justify-center rounded-lg border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
					disabled={!canAddInventory}
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
					type="button"
					className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
					disabled={inventories.length <= 1}
					onClick={() =>
						setInventories((current) =>
							current.length > 1 ? current.slice(0, -1) : current,
						)
					}
				>
					Remove last branch
				</button>
			</div>
			<div className="mt-8 flex justify-end border-t border-slate-100 pt-6">
				<button
					type="submit"
					className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 sm:w-auto"
				>
					Add Product
				</button>
			</div>
		</form>
	);
}
