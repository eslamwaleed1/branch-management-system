import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import RegionalManagerSidebar from "../../components/sidebar/RegionalManagerSidebar.jsx";
import { useBusinessData } from "../../hooks/useBusinessData.js";

const entriesOf = (product) =>
	product.branchInventories ||
	product.branchInventory ||
	product.inventories ||
	[];
const branchOf = (entry) =>
	entry.branch?._id || entry.branch?.id || entry.branch || entry.branchId;
const stockOf = (entry) =>
	entry.stock ?? entry.quantity ?? entry.quantityInStock ?? 0;

export default function RegionalManagerInventoryPage({ branchId }) {
	const { data: records, loading, error } = useBusinessData("products");
	const [query, setQuery] = useState("");
	const products = useMemo(
		() =>
			records
				.map((record) =>
					record.product
						? {
								...record.product,
								branchInventories: record.branchInventories || [],
							}
						: record,
				)
				.filter((product) =>
					entriesOf(product).some(
						(entry) => String(branchOf(entry)) === String(branchId),
					),
				)
				.filter((product) =>
					product.name?.toLowerCase().includes(query.toLowerCase()),
				),
		[records, branchId, query],
	);
	return (
		<div className="flex min-h-dvh bg-[#F5F7F9]">
			<RegionalManagerSidebar branchId={branchId} />
			<main className="w-full overflow-y-auto px-5 py-8 sm:px-8">
				<div className="mx-auto max-w-7xl">
					<header className="mb-8 flex flex-wrap items-end justify-between gap-4">
						<div>
							<h1 className="text-3xl font-semibold tracking-tight text-gray-900">
								Inventory
							</h1>
							<p className="mt-2 text-sm text-gray-500">
								Products and stock for this branch.
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
							<Link
								to="new"
								className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white"
							>
								+ Add product
							</Link>
						</div>
					</header>
					{loading && (
						<p className="text-sm text-gray-500">Loading inventory...</p>
					)}
					{error && (
						<p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
							{error}
						</p>
					)}
					{!loading && !error && (
						<div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
							<table className="w-full min-w-[640px] text-left text-sm">
								<thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
									<tr>
										<th className="px-5 py-4">Product</th>
										<th className="px-5 py-4">Category</th>
										<th className="px-5 py-4">Stock</th>
										<th className="px-5 py-4">Price</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-100">
									{products.length ? (
										products.map((product) => {
											const entry = entriesOf(product).find(
												(item) => String(branchOf(item)) === String(branchId),
											);
											return (
												<tr key={product._id}>
													<td className="px-5 py-4 font-medium text-gray-900">
														{product.name}
													</td>
													<td className="px-5 py-4 text-gray-700">
														{product.category || "-"}
													</td>
													<td className="px-5 py-4 text-gray-700">
														{stockOf(entry)}
													</td>
													<td className="px-5 py-4 text-gray-700">
														{entry?.price == null
															? "-"
															: `$${Number(entry.price).toLocaleString()}`}
													</td>
												</tr>
											);
										})
									) : (
										<tr>
											<td
												colSpan="4"
												className="px-5 py-12 text-center text-gray-500"
											>
												No products found for this branch.
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>
					)}
				</div>
			</main>
		</div>
	);
}
