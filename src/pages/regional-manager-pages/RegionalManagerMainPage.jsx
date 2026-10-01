import { createElement, useMemo, useState } from "react";
import { CircleDollarSign, ReceiptText } from "lucide-react";
import RegionalManagerSidebar from "../../components/sidebar/RegionalManagerSidebar.jsx";
import {
	filterByBranch,
	useBusinessData,
} from "../../hooks/useBusinessData.js";

export default function RegionalManagerMainPage({ branchId }) {
	const [period, setPeriod] = useState("month");
	const { data: branches, loading: branchesLoading } =
		useBusinessData("branches");
	const { data: sales, loading: salesLoading } = useBusinessData("sales");
	const { data: clients } = useBusinessData("clients");
	const { data: employees } = useBusinessData("employees");
	const branch = branches.find((item) => item._id === branchId);
	const branchSales = filterByBranch(sales, branchId);
	const { currentStart, previousStart } = periodBounds(period);
	const currentSales = branchSales.filter((sale) =>
		between(sale.saleDate, currentStart, new Date()),
	);
	const previousSales = branchSales.filter((sale) =>
		between(sale.saleDate, previousStart, currentStart),
	);
	const latestSales = useMemo(
		() =>
			[...branchSales]
				.sort((a, b) => new Date(b.saleDate) - new Date(a.saleDate))
				.slice(0, 8),
		[branchSales],
	);
	const loading = branchesLoading || salesLoading;
	return (
		<div className="flex min-h-dvh bg-[#f5f7f9]">
			<RegionalManagerSidebar branchId={branchId} />
			<main className="w-full overflow-y-auto px-5 py-8 sm:px-8">
				<div className="mx-auto max-w-7xl">
					<header className="mb-7">
						<p className="text-sm font-semibold text-blue-600">
							Regional manager workspace
						</p>
						<h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
							{branch?.name || "Branch performance"}
						</h1>
						<p className="mt-2 text-sm text-slate-500">
							A focused view of this branch&apos;s activity and operations.
						</p>
					</header>
					{loading ? (
						<p className="text-sm text-slate-500">
							Loading branch dashboard...
						</p>
					) : (
						<>
							<section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
								<div className="mb-5 flex flex-wrap items-center justify-between gap-3">
									<div>
										<h2 className="text-lg font-bold text-slate-900">
											Branch performance
										</h2>
										<p className="mt-1 text-sm text-slate-500">
											Metrics are limited to {branch?.name || "this branch"}.
										</p>
									</div>
									<select
										aria-label="Dashboard period"
										value={period}
										onChange={(event) => setPeriod(event.target.value)}
										className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700"
									>
										<option value="day">Today</option>
										<option value="month">This month</option>
										<option value="quarter">This quarter</option>
										<option value="year">This year</option>
									</select>
								</div>
								<div className="grid gap-4 md:grid-cols-3">
									<Metric
										label={`${periodLabel(period)} sales`}
										value={currentSales.length}
										previous={previousSales.length}
										icon={ReceiptText}
									/>
									<Metric
										label={`${periodLabel(period)} revenue`}
										value={sumRevenue(currentSales)}
										previous={sumRevenue(previousSales)}
										icon={CircleDollarSign}
										money
									/>
								</div>
							</section>
							<section className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.95fr]">
								<article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
									<h2 className="text-lg font-bold text-slate-900">
										Recent branch sales
									</h2>
									<div className="mt-4 divide-y divide-slate-100">
										{latestSales.length ? (
											latestSales.map((sale) => (
												<div
													className="flex items-center justify-between gap-3 py-3"
													key={sale._id}
												>
													<div>
														<p className="font-semibold text-slate-800">
															{sale.client?.name || "Walk-in client"}
														</p>
														<p className="mt-1 text-xs text-slate-500">
															{sale.employee?.name || "Unassigned"} ·{" "}
															{formatDate(sale.saleDate)}
														</p>
													</div>
													<strong className="text-slate-900">
														{formatMoney(sale.totalAmount)}
													</strong>
												</div>
											))
										) : (
											<p className="py-10 text-center text-sm text-slate-500">
												No sales recorded yet.
											</p>
										)}
									</div>
								</article>
								<article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
									<h2 className="text-lg font-bold text-slate-900">
										Branch snapshot
									</h2>
									<div className="mt-6 space-y-4 text-sm">
										<Snapshot label="Sales" value={branchSales.length} />
										<Snapshot
											label="Revenue"
											value={formatMoney(sumRevenue(branchSales))}
										/>
										<Snapshot
											label="Clients"
											value={filterByBranch(clients, branchId).length}
										/>
										<Snapshot
											label="Employees"
											value={filterByBranch(employees, branchId).length}
										/>
									</div>
								</article>
							</section>
						</>
					)}
				</div>
			</main>
		</div>
	);
}

function Metric({ label, value, previous, icon: Icon, money }) {
	const change = previous
		? Math.round(((value - previous) / previous) * 100)
		: value
			? 100
			: 0;
	return (
		<article className="rounded-xl border border-slate-100 bg-gradient-to-b from-white to-slate-50/70 p-5">
			<div className="flex items-start justify-between">
				<p className="font-medium text-slate-500">{label}</p>
				<span className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
					{createElement(Icon, { size: 20 })}
				</span>
			</div>
			<p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
				{money ? formatMoney(value) : value.toLocaleString()}
			</p>
			<p
				className={`mt-3 text-sm font-semibold ${change >= 0 ? "text-emerald-600" : "text-rose-600"}`}
			>
				{Math.abs(change)}%{" "}
				<span className="font-normal text-slate-500">from previous period</span>
			</p>
		</article>
	);
}
function Snapshot({ label, value }) {
	return (
		<div className="flex items-center justify-between border-b border-slate-100 pb-3">
			<span className="text-slate-500">{label}</span>
			<strong className="text-slate-800">{value}</strong>
		</div>
	);
}
function periodLabel(period) {
	return {
		day: "Today",
		month: "This month",
		quarter: "This quarter",
		year: "This year",
	}[period];
}
function periodBounds(period) {
	const now = new Date();
	const start = new Date(now);
	if (period === "day") start.setHours(0, 0, 0, 0);
	if (period === "month") {
		start.setDate(1);
		start.setHours(0, 0, 0, 0);
	}
	if (period === "quarter") {
		start.setMonth(Math.floor(start.getMonth() / 3) * 3, 1);
		start.setHours(0, 0, 0, 0);
	}
	if (period === "year") {
		start.setMonth(0, 1);
		start.setHours(0, 0, 0, 0);
	}
	const previous = new Date(start);
	if (period === "day") previous.setDate(previous.getDate() - 1);
	if (period === "month") previous.setMonth(previous.getMonth() - 1);
	if (period === "quarter") previous.setMonth(previous.getMonth() - 3);
	if (period === "year") previous.setFullYear(previous.getFullYear() - 1);
	return { currentStart: start, previousStart: previous };
}
function between(value, start, end) {
	const date = new Date(value);
	return !Number.isNaN(date.getTime()) && date >= start && date < end;
}
function sumRevenue(sales) {
	return sales.reduce(
		(total, sale) => total + Number(sale.totalAmount || 0),
		0,
	);
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
