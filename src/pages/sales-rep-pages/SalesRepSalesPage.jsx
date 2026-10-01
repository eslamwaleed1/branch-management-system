import { createElement, useMemo, useState } from "react";
import { CircleDollarSign, Mail, MapPin, ReceiptText } from "lucide-react";
import SalesRepSidebar from "../../components/sidebar/SalesRepSidebar.jsx";
import { useBusinessData } from "../../hooks/useBusinessData.js";

export default function SalesRepSalesPage({ employeeId }) {
	const { data: employees, loading: employeesLoading } =
		useBusinessData("employees");
	const { data: sales, loading: salesLoading } = useBusinessData("sales");
	const [period, setPeriod] = useState("all");
	const salesRep = employees.find((employee) => employee._id === employeeId);
	const repSales = useMemo(
		() => sales.filter((sale) => belongsToEmployee(sale, salesRep)),
		[sales, salesRep],
	);
	const visibleSales = useMemo(
		() => filterByPeriod(repSales, period),
		[repSales, period],
	);
	const totalRevenue = visibleSales.reduce(
		(total, sale) => total + Number(sale.totalAmount || 0),
		0,
	);

	return (
		<div className="flex min-h-dvh bg-[#F5F7F9]">
			<SalesRepSidebar employeeId={employeeId} />
			<main className="w-full overflow-y-auto px-5 py-8 sm:px-8">
				<div className="mx-auto max-w-7xl">
					<header className="mb-8">
						<p className="text-sm font-semibold text-blue-600">
							Sales representative workspace
						</p>
						<h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
							My sales
						</h1>
						<p className="mt-2 text-sm text-slate-500">
							Your performance and transaction history.
						</p>
					</header>

					{employeesLoading || !salesRep ? (
						<p className="text-sm text-slate-500">
							Loading sales representative...
						</p>
					) : (
						<>
							<section className="mb-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
								<div className="flex flex-wrap items-start justify-between gap-5">
									<div>
										<p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
											Currently selected
										</p>
										<h2 className="mt-2 text-2xl font-bold text-slate-900">
											{salesRep.name}
										</h2>
										<div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
											<span className="flex items-center gap-2">
												<Mail size={15} />
												{salesRep.email || "No email listed"}
											</span>
											<span className="flex items-center gap-2">
												<MapPin size={15} />
												{salesRep.branch?.name ||
													salesRep.branchName ||
													"No branch listed"}
											</span>
										</div>
									</div>
									<div className="rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
										{salesRep.position || "Sales Rep"}
									</div>
								</div>
							</section>

							<section className="mb-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
								<div className="mb-5 flex flex-wrap items-center justify-between gap-3">
									<div>
										<h2 className="text-lg font-bold text-slate-900">
											Sales performance
										</h2>
										<p className="mt-1 text-sm text-slate-500">
											Only transactions belonging to {salesRep.name}.
										</p>
									</div>
									<select
										aria-label="Sales period"
										value={period}
										onChange={(event) => setPeriod(event.target.value)}
										className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-blue-500"
									>
										<option value="all">All time</option>
										<option value="day">Today</option>
										<option value="month">This month</option>
										<option value="year">This year</option>
									</select>
								</div>
								<div className="grid gap-4 sm:grid-cols-2">
									<StatCard
										icon={ReceiptText}
										label="Total sales"
										value={visibleSales.length.toLocaleString()}
									/>
									<StatCard
										icon={CircleDollarSign}
										label="Total revenue"
										value={formatMoney(totalRevenue)}
									/>
								</div>
							</section>

							<section>
								<div className="mb-4">
									<h2 className="text-xl font-bold text-slate-900">
										{salesRep.name}&apos;s sales
									</h2>
									<p className="mt-1 text-sm text-slate-500">
										A complete view of this representative&apos;s transactions.
									</p>
								</div>
								{salesLoading ? (
									<p className="text-sm text-slate-500">Loading sales...</p>
								) : (
									<SalesTable sales={visibleSales} />
								)}
							</section>
						</>
					)}
				</div>
			</main>
		</div>
	);
}

function StatCard({ icon: Icon, label, value }) {
	return (
		<article className="rounded-xl border border-slate-100 bg-gradient-to-b from-white to-slate-50/70 p-5">
			<div className="flex items-start justify-between">
				<p className="font-medium text-slate-500">{label}</p>
				<span className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
					{createElement(Icon, { size: 20 })}
				</span>
			</div>
			<p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
				{value}
			</p>
		</article>
	);
}

function SalesTable({ sales }) {
	return (
		<div className="overflow-x-auto rounded-xl border border-slate-100 bg-white shadow-sm">
			<table className="w-full min-w-[680px] text-left text-sm">
				<thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
					<tr>
						<th className="px-5 py-4">Date</th>
						<th className="px-5 py-4">Client</th>
						<th className="px-5 py-4">Branch</th>
						<th className="px-5 py-4 text-right">Total</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-slate-100">
					{sales.length ? (
						sales.map((sale) => (
							<tr className="hover:bg-slate-50" key={sale._id}>
								<td className="px-5 py-4 text-slate-600">
									{formatDate(sale.saleDate)}
								</td>
								<td className="px-5 py-4 font-medium text-slate-800">
									{sale.client?.name || "Walk-in client"}
								</td>
								<td className="px-5 py-4 text-slate-600">
									{sale.branch?.name || "Unassigned branch"}
								</td>
								<td className="px-5 py-4 text-right font-semibold text-slate-900">
									{formatMoney(sale.totalAmount)}
								</td>
							</tr>
						))
					) : (
						<tr>
							<td className="px-5 py-10 text-center text-slate-500" colSpan="4">
								No sales recorded for this period.
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
}

function belongsToEmployee(sale, employee) {
	if (!employee) return false;
	const reference = sale.employee;
	return (
		reference?._id === employee._id ||
		reference === employee._id ||
		reference?.name === employee.name ||
		sale.employeeName === employee.name
	);
}

function filterByPeriod(sales, period) {
	if (period === "all") return sortSales(sales);
	const now = new Date();
	const start = new Date(now);
	if (period === "day") start.setHours(0, 0, 0, 0);
	if (period === "month") {
		start.setDate(1);
		start.setHours(0, 0, 0, 0);
	}
	if (period === "year") {
		start.setMonth(0, 1);
		start.setHours(0, 0, 0, 0);
	}
	return sortSales(sales.filter((sale) => new Date(sale.saleDate) >= start));
}

function sortSales(sales) {
	return [...sales].sort((a, b) => new Date(b.saleDate) - new Date(a.saleDate));
}

function formatMoney(value) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 0,
	}).format(Number(value || 0));
}

function formatDate(value) {
	const date = new Date(value);
	return Number.isNaN(date.getTime())
		? "Unknown date"
		: date.toLocaleDateString();
}
