import { useEffect, useMemo, useState } from "react";
import CEOSidebar from "../../components/sidebar/CEOSidebar.jsx";
import DataTable from "../../components/DataTable.jsx";
import {
	filterByBranch,
	useBusinessData,
} from "../../hooks/useBusinessData.js";
import AddEntityLink from "../../components/entity-components/AddEntityLink.jsx";

export default function CEOSalesPage({ branchId }) {
	const { data: sales, loading, error } = useBusinessData("sales");
	const { data: branches } = useBusinessData("branches");
	const [sort, setSort] = useState("date");
	const [selectedBranchId, setSelectedBranchId] = useState(branchId || "");
	const [deletedIds, setDeletedIds] = useState([]);
	const [actionError, setActionError] = useState("");

	useEffect(() => setSelectedBranchId(branchId || ""), [branchId]);
	const rows = useMemo(
		() =>
			[...filterByBranch(sales, selectedBranchId)]
				.filter((sale) => !deletedIds.includes(sale._id))
				.sort((a, b) =>
					sort === "revenue"
						? b.totalAmount - a.totalAmount
						: new Date(b.saleDate) - new Date(a.saleDate),
				),
		[sales, selectedBranchId, sort, deletedIds],
	);
	const deleteSale = async (sale) => {
		if (!window.confirm("Delete this sale? This cannot be undone.")) return;
		setActionError("");
		try {
			const response = await fetch(
				`http://localhost:5000/api/sales/${sale._id}`,
				{ method: "DELETE" },
			);
			if (!response.ok) throw new Error("Unable to delete this sale.");
			setDeletedIds((ids) => [...ids, sale._id]);
		} catch (requestError) {
			setActionError(requestError.message);
		}
	};
	const columns = [
		{
			key: "date",
			label: "Date",
			render: (sale) => new Date(sale.saleDate).toLocaleDateString(),
		},
		{
			key: "client",
			label: "Client",
			render: (sale) => sale.client?.name || "-",
		},
		{
			key: "employee",
			label: "Salesperson",
			render: (sale) => sale.employee?.name || "-",
		},
		{
			key: "branch",
			label: "Branch",
			render: (sale) => sale.branch?.name || "-",
		},
		{
			key: "products",
			label: "Products",
			render: (sale) =>
				sale.products?.length
					? sale.products
							.map(
								(item) =>
									`${item.product?.name || "Product"} ×${item.quantity}`,
							)
							.join(", ")
					: "-",
		},
		{
			key: "revenue",
			label: "Revenue",
			render: (sale) => (
				<span className="font-semibold text-gray-900">
					${Number(sale.totalAmount || 0).toLocaleString()}
				</span>
			),
		},
		{
			key: "actions",
			label: "Actions",
			render: (sale) => (
				<button
					type="button"
					onClick={() => deleteSale(sale)}
					className="rounded-md px-2 py-1 text-sm font-medium text-rose-600 hover:bg-rose-50"
				>
					Delete
				</button>
			),
		},
	];
	return (
		<div className="flex min-h-dvh bg-[#F5F7F9]">
			<CEOSidebar branchId={branchId} />
			<main className="w-full overflow-y-auto px-5 py-8 sm:px-8">
				<div className="mx-auto max-w-7xl">
					<header className="mb-8 flex flex-wrap items-end justify-between gap-4">
						<div>
							<h1 className="text-3xl font-semibold tracking-tight text-gray-900">
								Sales
							</h1>
							<p className="mt-2 text-sm text-gray-500">
								Revenue activity{" "}
								{branchId ? "for this branch" : "across every branch"}.
							</p>
						</div>
						<div className="flex flex-wrap gap-2">
							<select
								value={sort}
								onChange={(event) => setSort(event.target.value)}
								className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm"
							>
								<option value="date">Most recent</option>
								<option value="revenue">Top revenue</option>
							</select>
							{!branchId && (
								<select
									aria-label="Filter sales by branch"
									value={selectedBranchId}
									onChange={(event) => setSelectedBranchId(event.target.value)}
									className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm"
								>
									<option value="">All branches</option>
									{branches.map((branch) => (
										<option key={branch._id} value={branch._id}>
											{branch.name}
										</option>
									))}
								</select>
							)}
						</div>
						<AddEntityLink entity="Sale" link="new" />
					</header>
					{loading && <p className="text-sm text-gray-500">Loading sales...</p>}
					{error && (
						<p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
							{error}
						</p>
					)}
					{actionError && (
						<p className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">
							{actionError}
						</p>
					)}
					{!loading && !error && (
						<DataTable
							columns={columns}
							rows={rows.map((row) => ({ ...row, id: row._id }))}
						/>
					)}
				</div>
			</main>
		</div>
	);
}
