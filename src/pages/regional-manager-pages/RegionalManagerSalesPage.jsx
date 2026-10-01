import { useMemo, useState } from "react";
import DataTable from "../../components/DataTable.jsx";
import AddEntityLink from "../../components/entity-components/AddEntityLink.jsx";
import RegionalManagerSidebar from "../../components/sidebar/RegionalManagerSidebar.jsx";
import {
	filterByBranch,
	useBusinessData,
} from "../../hooks/useBusinessData.js";

export default function RegionalManagerSalesPage({ branchId }) {
	const { data: sales, loading, error } = useBusinessData("sales");
	const [sort, setSort] = useState("date");
	const [deletedIds, setDeletedIds] = useState([]);
	const [actionError, setActionError] = useState("");
	const rows = useMemo(
		() =>
			[...filterByBranch(sales, branchId)]
				.filter((sale) => !deletedIds.includes(sale._id))
				.sort((a, b) =>
					sort === "revenue"
						? Number(b.totalAmount || 0) - Number(a.totalAmount || 0)
						: new Date(b.saleDate) - new Date(a.saleDate),
				),
		[sales, branchId, sort, deletedIds],
	);
	const deleteSale = async (sale) => {
		if (!window.confirm("Delete this sale? This cannot be undone.")) return;
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
			key: "products",
			label: "Products",
			render: (sale) =>
				sale.products
					?.map(
						(item) => `${item.product?.name || "Product"} x${item.quantity}`,
					)
					.join(", ") || "-",
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
		<ManagerLayout
			branchId={branchId}
			title="Sales"
			description="Revenue activity for this branch."
			action={
				<>
					<select
						aria-label="Sort sales"
						value={sort}
						onChange={(event) => setSort(event.target.value)}
						className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm"
					>
						<option value="date">Most recent</option>
						<option value="revenue">Top revenue</option>
					</select>
					<AddEntityLink entity="Sale" link="new" />
				</>
			}
		>
			<div>
				{loading && <p className="text-sm text-gray-500">Loading sales...</p>}
				{error && (
					<p className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">
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
		</ManagerLayout>
	);
}

function ManagerLayout({ branchId, title, description, action, children }) {
	return (
		<div className="flex min-h-dvh bg-[#F5F7F9]">
			<RegionalManagerSidebar branchId={branchId} />
			<main className="w-full overflow-y-auto px-5 py-8 sm:px-8">
				<div className="mx-auto max-w-7xl">
					<header className="mb-8 flex flex-wrap items-end justify-between gap-4">
						<div>
							<h1 className="text-3xl font-semibold tracking-tight text-gray-900">
								{title}
							</h1>
							<p className="mt-2 text-sm text-gray-500">{description}</p>
						</div>
						<div className="flex flex-wrap gap-2">{action}</div>
					</header>
					{children}
				</div>
			</main>
		</div>
	);
}
