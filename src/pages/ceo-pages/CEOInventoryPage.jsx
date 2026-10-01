import { Fragment, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
	ChevronDown,
	ChevronRight,
	LayoutGrid,
	List,
	Package,
} from "lucide-react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import CEOSidebar from "../../components/sidebar/CEOSidebar.jsx";
import { useBusinessData } from "../../hooks/useBusinessData.js";
import { ToggleButtonGroupStyles } from "../../components/entity-components/ToggleButtonGroup.styles.js";

const inventoryEntries = (product) =>
	product.branchInventories ||
	product.branchInventory ||
	product.inventories ||
	[];
const branchIdOf = (entry) =>
	entry.branch?._id || entry.branch || entry.branchId;
const stockOf = (entry) =>
	entry.stock ?? entry.quantity ?? entry.quantityInStock;
const priceOf = (entry) => entry.price ?? entry.unitPrice ?? entry.sellingPrice;
const money = (value) =>
	value === undefined || value === null || value === ""
		? "-"
		: `$${Number(value).toLocaleString()}`;

export default function CEOInventoryPage({ branchId }) {
	const { data: productRecords, loading, error } = useBusinessData("products");
	const { data: branches } = useBusinessData("branches");
	const [query, setQuery] = useState("");
	const [viewMode, setViewMode] = useState("table");
	const [selectedBranchId, setSelectedBranchId] = useState(branchId || "");

	useEffect(() => setSelectedBranchId(branchId || ""), [branchId]);
	const products = useMemo(
		() =>
			productRecords.map((record) =>
				record.product
					? {
							...record.product,
							branchInventories: record.branchInventories || [],
						}
					: record,
			),
		[productRecords],
	);
	const rows = useMemo(() => {
		const term = query.trim().toLowerCase();
		return products.filter((product) => {
			const matchesBranch =
				!selectedBranchId ||
				inventoryEntries(product).some(
					(entry) => String(branchIdOf(entry)) === String(selectedBranchId),
				);
			return matchesBranch && product.name?.toLowerCase().includes(term);
		});
	}, [products, query, selectedBranchId]);
	const totalStock = (product) =>
		inventoryEntries(product).reduce(
			(total, entry) => total + Number(stockOf(entry) || 0),
			0,
		);

	return (
		<div className="flex min-h-dvh bg-[#F5F7F9]">
			<CEOSidebar branchId={branchId} />
			<main className="w-full overflow-y-auto px-5 py-8 sm:px-8">
				<div className="mx-auto max-w-7xl">
					<header className="mb-8 flex flex-wrap items-end justify-between gap-4">
						<div>
							<h1 className="text-3xl font-semibold tracking-tight text-gray-900">
								Inventory
							</h1>
							<p className="mt-2 text-sm text-gray-500">
								Product catalogue and branch-specific stock and pricing.
							</p>
						</div>
						<div className="flex flex-wrap gap-2">
							<input
								aria-label="Search products"
								value={query}
								onChange={(event) => setQuery(event.target.value)}
								placeholder="Search products..."
								className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-400"
							/>
							{!branchId && (
								<select
									aria-label="Filter inventory by branch"
									value={selectedBranchId}
									onChange={(event) => setSelectedBranchId(event.target.value)}
									className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-400"
								>
									<option value="">All branches</option>
									{branches.map((branch) => (
										<option key={branch._id} value={branch._id}>
											{branch.name}
										</option>
									))}
								</select>
							)}
							<Link
								to="new"
								className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
							>
								+ Add product
							</Link>
						</div>
					</header>
					<ToggleButtonGroup
						className="mb-6"
						value={viewMode}
						exclusive
						onChange={(_, value) => value && setViewMode(value)}
						size="small"
						sx={ToggleButtonGroupStyles}
					>
						<ToggleButton value="table">
							<List size={17} className="mr-2" />
							Table
						</ToggleButton>
						<ToggleButton value="cards">
							<LayoutGrid size={17} className="mr-2" />
							Cards
						</ToggleButton>
					</ToggleButtonGroup>
					{loading && (
						<p className="text-sm text-gray-500">Loading inventory...</p>
					)}
					{error && (
						<p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
							{error}
						</p>
					)}
					{!loading && !error && viewMode === "table" && (
						<InventoryTable products={rows} totalStock={totalStock} />
					)}
					{!loading &&
						!error &&
						viewMode === "cards" &&
						(rows.length ? (
							<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
								{rows.map((product) => (
									<article
										key={product._id}
										className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
									>
										<Package className="mb-4 text-blue-600" size={24} />
										<h2 className="font-semibold text-gray-900">
											{product.name}
										</h2>
										<p className="mt-1 text-sm text-gray-500">
											{product.category || "Uncategorised"}
										</p>
										<div className="mt-5 flex justify-between border-t pt-4 text-sm text-gray-600">
											<span>Stock: {totalStock(product)}</span>
											<span>{inventoryEntries(product).length} branches</span>
										</div>
									</article>
								))}
							</div>
						) : (
							<EmptyInventory />
						))}
				</div>
			</main>
		</div>
	);
}

function InventoryTable({ products, totalStock }) {
	const [expandedProductIds, setExpandedProductIds] = useState([]);
	const toggleProduct = (id) =>
		setExpandedProductIds((ids) =>
			ids.includes(id)
				? ids.filter((productId) => productId !== id)
				: [...ids, id],
		);
	if (!products.length) return <EmptyInventory />;
	return (
		<div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
			<table className="w-full min-w-[720px] text-left text-sm">
				<thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
					<tr>
						<th className="w-10 px-4 py-4" />
						<th className="px-5 py-4">Product</th>
						<th className="px-5 py-4">Category</th>
						<th className="px-5 py-4">Total stock</th>
						<th className="px-5 py-4">Branches</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-gray-100">
					{products.map((product) => {
						const expanded = expandedProductIds.includes(product._id);
						const entries = inventoryEntries(product);
						return (
							<Fragment key={product._id}>
								<tr
									onClick={() => toggleProduct(product._id)}
									className="cursor-pointer transition hover:bg-blue-50"
								>
									<td className="px-4 py-4 text-gray-500">
										{expanded ? (
											<ChevronDown size={18} />
										) : (
											<ChevronRight size={18} />
										)}
									</td>
									<td className="px-5 py-4 font-medium text-gray-900">
										{product.name}
									</td>
									<td className="px-5 py-4 text-gray-700">
										{product.category || "-"}
									</td>
									<td className="px-5 py-4 text-gray-700">
										{totalStock(product)}
									</td>
									<td className="px-5 py-4 text-gray-700">{entries.length}</td>
								</tr>
								{expanded && (
									<tr>
										<td colSpan={5} className="bg-blue-50/60 px-10 py-3">
											<table className="w-full rounded-lg border border-blue-100 bg-white text-sm">
												<thead className="bg-blue-50 text-xs uppercase tracking-wide text-gray-500">
													<tr>
														<th className="px-4 py-2.5 text-left">Branch</th>
														<th className="px-4 py-2.5 text-left">Stock</th>
														<th className="px-4 py-2.5 text-left">Price</th>
													</tr>
												</thead>
												<tbody>
													{entries.map((entry, index) => (
														<tr
															key={entry._id || index}
															className="border-t border-gray-100"
														>
															<td className="px-4 py-3 font-medium text-gray-800">
																{entry.branch?.name ||
																	entry.branchName ||
																	"Unknown branch"}
															</td>
															<td className="px-4 py-3 text-gray-700">
																{stockOf(entry) ?? "-"}
															</td>
															<td className="px-4 py-3 text-gray-700">
																{money(priceOf(entry))}
															</td>
														</tr>
													))}
												</tbody>
											</table>
										</td>
									</tr>
								)}
							</Fragment>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}

function EmptyInventory() {
	return (
		<p className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center text-sm text-gray-500">
			No products found.
		</p>
	);
}
