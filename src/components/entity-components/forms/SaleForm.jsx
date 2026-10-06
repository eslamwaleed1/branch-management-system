import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBusinessData } from "../../../hooks/useBusinessData.js";
import { useCreateBusinessData } from "../../../hooks/useBusinessMutation.js";

export default function SaleForm({ employee = "", targetPath = "/ceo/sales" }) {
	const [employeeName, setEmployeeName] = useState(employee || "");
	const [clientName, setClientName] = useState("");
	const [items, setItems] = useState([{ productName: "", quantity: 1 }]);
	const { data: employees, loading: employeesLoading } =
		useBusinessData("employees");
	const { data: clients, loading: clientsLoading } = useBusinessData("clients");
	const { data: productResults, loading: productsLoading } =
		useBusinessData("products");
	const products = productResults.map((record) =>
		record.product
			? {
					...record.product,
					branchInventories: record.branchInventories || [],
				}
			: record,
	);
	const navigate = useNavigate();
	const createSale = useCreateBusinessData("sales");
	const selectedEmployee = employees.find(
		(employee) => employee.name === employeeName,
	);
	const employeeBranch = branchOfEmployee(selectedEmployee);

	const branchProducts = useMemo(
		() =>
			selectedEmployee
				? products.filter((product) =>
						inventoryEntries(product).some((inventory) =>
							sameBranch(inventory, employeeBranch),
						),
					)
				: [],
		[selectedEmployee, products, employeeBranch],
	);
	const sellableProducts = branchProducts.filter((product) =>
		inventoryEntries(product).some(
			(inventory) =>
				sameBranch(inventory, employeeBranch) && stockOf(inventory) > 0,
		),
	);

	useEffect(() => {
		setItems([{ productName: "", quantity: 1 }]);
	}, [employeeName]);

	const stockFor = (productName) => {
		const product = sellableProducts.find((item) => item.name === productName);
		const inventory =
			product &&
			inventoryEntries(product).find((entry) =>
				sameBranch(entry, employeeBranch),
			);
		return inventory ? stockOf(inventory) : 0;
	};
	const updateItem = (index, field, value) =>
		setItems((current) =>
			current.map((item, itemIndex) =>
				itemIndex === index
					? {
							...item,
							[field]:
								field === "quantity" && value !== ""
									? Math.min(Number(value), stockFor(item.productName))
									: value,
						}
					: item,
			),
		);
	const handleSubmit = async (event) => {
		event.preventDefault();
		await createSale.mutateAsync({
			employeeName,
			clientName,
			productsInput: items.map((item) => ({
				...item,
				quantity: Number(item.quantity),
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
				<h2 className="text-lg font-semibold text-slate-900">Sale details</h2>
				<p className="mt-1 text-sm text-slate-500">
					Select a sales representative and client, then add products.
				</p>
			</div>
			<div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
				<FormField
					id="sale-employee"
					label="Sales representative"
					example="Choose the employee handling this sale."
				>
					<select
						id="sale-employee"
						className={inputClass}
						value={employeeName}
						required
						disabled={employeesLoading}
						onChange={(event) => setEmployeeName(event.target.value)}
					>
						<option value="" disabled>
							Select employee
						</option>
						{employees.map(
							(employee) =>
								employee.position === "Sales Rep" && (
									<option key={employee._id} value={employee.name}>
										{employee.name}
									</option>
								),
						)}
					</select>
				</FormField>
				<FormField
					id="sale-client"
					label="Client"
					example="Clients are filtered to the selected employee's branch."
				>
					<select
						id="sale-client"
						className={inputClass}
						value={clientName}
						required
						disabled={clientsLoading || !selectedEmployee}
						onChange={(event) => setClientName(event.target.value)}
					>
						<option value="" disabled>
							Select client
						</option>
						{clients.map(
							(client) =>
								selectedEmployee &&
								client.branch.name === selectedEmployee.branch.name && (
									<option key={client._id} value={client.name}>
										{client.name}
									</option>
								),
						)}
					</select>
				</FormField>
			</div>
			<div className="mt-8 space-y-4">
				<div>
					<h3 className="text-sm font-semibold text-slate-900">Products</h3>
					<p className="mt-1 text-xs leading-5 text-slate-500">
						Only products with available stock at the employee's branch are
						shown.
					</p>
				</div>
				{items.map((item, index) => (
					<div
						key={index}
						className="rounded-lg border border-slate-200 bg-slate-50/70 p-4 sm:p-5"
					>
						<p className="mb-4 text-xs font-semibold uppercase text-slate-500">
							Item {index + 1}
						</p>
						<div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-[minmax(0,1fr)_10rem]">
							<FormField
								id={`sale-product-${index}`}
								label="Product"
								example="Choose an in-stock item."
							>
								<select
									id={`sale-product-${index}`}
									className={inputClass}
									value={item.productName}
									required
									disabled={productsLoading || !selectedEmployee}
									onChange={(event) =>
										updateItem(index, "productName", event.target.value)
									}
								>
									<option value="" disabled>
										Select product
									</option>
									{sellableProducts.map((product) => (
										<option
											key={product._id}
											value={product.name}
											disabled={items.some(
												(otherItem, otherIndex) =>
													otherIndex !== index &&
													otherItem.productName === product.name,
											)}
										>
											{product.name}
										</option>
									))}
								</select>
							</FormField>
							<FormField
								id={`sale-quantity-${index}`}
								label="Quantity"
								example={
									item.productName
										? `Up to ${stockFor(item.productName)} available.`
										: "Select a product first."
								}
							>
								<input
									id={`sale-quantity-${index}`}
									className={inputClass}
									type="number"
									min="1"
									max={
										item.productName ? stockFor(item.productName) : undefined
									}
									placeholder="1"
									value={item.quantity}
									required
									disabled={!item.productName}
									onChange={(event) =>
										updateItem(index, "quantity", event.target.value)
									}
								/>
							</FormField>
						</div>
					</div>
				))}
				<div className="flex flex-wrap gap-3">
					<button
						type="button"
						className="inline-flex min-h-11 items-center justify-center rounded-lg border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
						disabled={
							!selectedEmployee ||
							items.length >= sellableProducts.length ||
							productsLoading
						}
						onClick={() =>
							setItems([...items, { productName: "", quantity: 1 }])
						}
					>
						+ Add product
					</button>
					<button
						type="button"
						className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
						onClick={() => setItems((prevState) => prevState.slice(0, -1))}
					>
						Remove last product
					</button>
				</div>
			</div>
			<div className="mt-8 flex justify-end border-t border-slate-100 pt-6">
				<button
					type="submit"
					className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 sm:w-auto"
				>
					Add Sale
				</button>
			</div>
		</form>
	);
}

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

const inventoryEntries = (product) =>
	product.branchInventories ||
	product.branchInventory ||
	product.inventories ||
	[];
const branchReferences = (value) => {
	if (!value) return [];
	if (typeof value !== "object") return [value.toString()];
	return [value._id, value.id, value.name]
		.filter(Boolean)
		.map((reference) => reference.toString());
};
const branchOfEmployee = (employee) =>
	employee?.branch || employee?.branchId || employee?.branchName;
const sameBranch = (inventory, employeeBranch) => {
	const inventoryBranch =
		inventory.branch || inventory.branchId || inventory.branchName;
	const inventoryReferences = branchReferences(inventoryBranch);
	const employeeReferences = branchReferences(employeeBranch);
	return inventoryReferences.some((reference) =>
		employeeReferences.includes(reference),
	);
};
const stockOf = (inventory) =>
	Number(
		inventory.stock ?? inventory.quantity ?? inventory.quantityInStock ?? 0,
	);
