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
			className="flex flex-col items-center gap-[10px] pt-[2rem] w-[22rem]"
		>
			<select
				className={inputClass}
				value={employeeName}
				required
				disabled={employeesLoading}
				onChange={(event) => setEmployeeName(event.target.value)}
			>
				<option value="">Select employee</option>
				{employees.map(
					(employee) =>
						employee.position === "Sales Rep" && (
							<option key={employee._id} value={employee.name}>
								{employee.name}
							</option>
						),
				)}
			</select>
			<select
				className={inputClass}
				value={clientName}
				required
				disabled={clientsLoading}
				onChange={(event) => setClientName(event.target.value)}
			>
				<option value="">Select client</option>
				{clients.map(
					(client) =>
						selectedEmployee && client.branch.name === selectedEmployee.branch.name && (
							<option key={client._id} value={client.name}>
								{client.name}
							</option>
						),
				)}
			</select>
			{items.map((item, index) => (
				<div key={index} className="flex w-full gap-[10px]">
					<select
						className={inputClass}
						value={item.productName}
						required
						disabled={productsLoading || !selectedEmployee}
						onChange={(event) =>
							updateItem(index, "productName", event.target.value)
						}
					>
						<option value="">Select product</option>
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
					<input
						className={`${inputClass} w-20`}
						type="number"
						min="1"
						max={item.productName ? stockFor(item.productName) : undefined}
						value={item.quantity}
						required
						disabled={!item.productName}
						onChange={(event) =>
							updateItem(index, "quantity", event.target.value)
						}
					/>
				</div>
			))}
			<button
				type="button"
				className="btn-base border border-blue-300 px-3 py-1 cursor-pointer"
				disabled={
					!selectedEmployee ||
					items.length >= sellableProducts.length ||
					productsLoading
				}
				onClick={() => setItems([...items, { productName: "", quantity: 1 }])}
			>
				+ Add product
			</button>
			<button
				type="button"
				className="btn-base border border-blue-300 px-3 py-1 cursor-pointer"
				onClick={() => setItems((prevState) => prevState.slice(0, -1))}
			>
				- Add product
			</button>
			<button
				type="submit"
				className="btn-base input-submit bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 cursor-pointer"
			>
				Add Sale
			</button>
		</form>
	);
}

const inputClass =
	"btn-base input-field border border-blue-300 focus:ring-blue-300";

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
