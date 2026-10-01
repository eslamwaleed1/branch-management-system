import { createElement, useMemo, useState } from "react";
import {
	Banknote,
	CircleDollarSign,
	DollarSign,
	ReceiptText,
	TrendingDown,
	TrendingUp,
	Users,
} from "lucide-react";
import CEOSidebar from "../../components/sidebar/CEOSidebar.jsx";
import { Card } from "../../components/ui/card.jsx";
import { Badge } from "../../components/ui/badge.jsx";
import {
	filterByBranch,
	useBusinessData,
} from "../../hooks/useBusinessData.js";

const periods = {
	day: "Today",
	month: "This month",
	quarter: "This quarter",
	year: "This year",
};

export default function CEOMainPage({ branchId }) {
	const [period, setPeriod] = useState("day");
	const { data: branches, loading: branchesLoading } =
		useBusinessData("branches");
	const { data: sales, loading: salesLoading } = useBusinessData("sales");
	const { data: employees } = useBusinessData("employees");
	const { data: clients } = useBusinessData("clients");
	const scopedSales = filterByBranch(sales, branchId);
	const selectedBranch = branches.find((branch) => branch._id === branchId);
	const metrics = useMemo(() => {
		const { currentStart, previousStart } = periodBounds(period);
		const current = scopedSales.filter((sale) =>
			between(sale.saleDate, currentStart, new Date()),
		);
		const previous = scopedSales.filter((sale) =>
			between(sale.saleDate, previousStart, currentStart),
		);
		const revenue = sumRevenue(current);
		return [
			{
				label: `${periods[period]} sales`,
				value: current.length,
				previous: previous.length,
				icon: ReceiptText,
				money: false,
			},
			{
				label: `${periods[period]} revenue`,
				value: revenue,
				previous: sumRevenue(previous),
				icon: CircleDollarSign,
				money: true,
			},
			{
				label: `${periods[period]} profit`,
				value: revenue * 0.25,
				previous: sumRevenue(previous) * 0.25,
				icon: Banknote,
				money: true,
			},
		];
	}, [period, scopedSales]);
	const latestSales = useMemo(
		() => [...scopedSales].sort(byDate).slice(0, 8),
		[scopedSales],
	);
	const branchPerformance = useMemo(
		() => getBranchPerformance(branches, sales, employees, period),
		[branches, sales, employees, period],
	);
	const loading = branchesLoading || salesLoading;

	return (
		<div className="flex min-h-dvh bg-[#f5f7f9]">
			<CEOSidebar branchId={branchId} />
			<main className="w-full overflow-y-auto px-5 py-8 sm:px-8">
				<div className="mx-auto max-w-7xl">
					<header className="mb-7">
						<p className="text-sm font-semibold text-blue-600">
							{selectedBranch?.name || "Executive dashboard"}
						</p>
						<h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
							{selectedBranch ? "Branch performance" : "Good morning, Mr. CEO"}
						</h1>
						<p className="mt-2 text-sm text-slate-500">
							A live view of sales activity and operating performance.
						</p>
					</header>
					{loading ? (
						<p className="text-sm text-slate-500">Loading dashboard...</p>
					) : (
						<>
							<section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
								<div className="mb-5 flex flex-wrap items-center justify-between gap-3">
									<div>
										<h2 className="text-lg font-bold text-slate-900">
											Performance overview
										</h2>
										<p className="mt-1 text-sm text-slate-500">
											Compare the selected period with the previous one.
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
									{metrics.map((metric) => (
										<MetricCard key={metric.label} metric={metric} />
									))}
								</div>
							</section>
							<section className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.95fr]">
								<article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
									<h2 className="text-lg font-bold text-slate-900">
										Recent sales
									</h2>
									<p className="mt-1 text-sm text-slate-500">
										The latest transactions across the selected scope.
									</p>
									<div className="mt-4 divide-y divide-slate-100">
										{latestSales.length ? (
											latestSales.map((sale) => (
												<SaleRow key={sale._id} sale={sale} />
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
										Business snapshot
									</h2>
									<p className="mt-1 text-sm text-slate-500">
										Current records in the system.
									</p>
									<div className="mt-6 space-y-4 text-sm">
										<Snapshot
											label="Branches"
											value={branchId ? 1 : branches.length}
										/>
										<Snapshot
											label="Clients"
											value={
												branchId
													? filterByBranch(clients, branchId).length
													: clients.length
											}
										/>
										<Snapshot
											label="Employees"
											value={
												branchId
													? filterByBranch(employees, branchId).length
													: employees.length
											}
										/>
										<Snapshot
											label="Revenue"
											value={formatMoney(sumRevenue(scopedSales))}
										/>
									</div>
								</article>
							</section>
							{!branchId && (
								<section className="mt-6">
									<div className="mb-4 flex items-end justify-between">
										<div>
											<h2 className="text-xl font-bold text-slate-900">
												Branches
											</h2>
											<p className="mt-1 text-sm text-slate-500">
												A quick comparison of branch performance.
											</p>
										</div>
									</div>
									<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
										{branchPerformance.map((branch) => (
											<BranchPerformanceCard key={branch.id} branch={branch} />
										))}
									</div>
								</section>
							)}
						</>
					)}
				</div>
			</main>
		</div>
	);
}

function MetricCard({ metric }) {
	const change = metric.previous
		? Math.round(((metric.value - metric.previous) / metric.previous) * 100)
		: metric.value
			? 100
			: 0;
	return (
		<article className="rounded-xl border border-slate-100 bg-gradient-to-b from-white to-slate-50/70 p-5">
			<div className="flex items-start justify-between">
				<p className="font-medium text-slate-500">{metric.label}</p>
				<span className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
					{createIcon(metric.icon)}
				</span>
			</div>
			<p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
				{metric.money
					? formatMoney(metric.value)
					: metric.value.toLocaleString()}
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
function SaleRow({ sale }) {
	return (
		<div className="flex items-center justify-between gap-3 py-3">
			<div className="min-w-0">
				<p className="truncate font-semibold text-slate-800">
					{sale.client?.name || "Walk-in client"}
				</p>
				<p className="mt-0.5 text-xs text-slate-500">
					{sale.employee?.name || "Unassigned salesperson"} ·{" "}
					{formatDate(sale.saleDate)}
				</p>
			</div>
			<p className="shrink-0 font-bold text-slate-900">
				{formatMoney(sale.totalAmount)}
			</p>
		</div>
	);
}
function Snapshot({ label, value }) {
	return (
		<div className="flex items-center justify-between border-b border-slate-100 pb-3">
			<span className="text-slate-500">{label}</span>
			<span className="font-semibold text-slate-800">{value}</span>
		</div>
	);
}
function BranchPerformanceCard({ branch }) {
	const growthIcon = branch.growth >= 0 ? TrendingUp : TrendingDown;
	return (
		<Card className="min-w-[300px] flex-shrink-0 rounded-3xl bg-white p-6 shadow">
			<div className="mb-4 flex items-start justify-between">
				<div>
					<div className="mb-1 flex items-center gap-2">
						<h3 className="text-lg font-medium text-slate-900">
							{branch.title}
						</h3>
						<Badge variant="secondary" className="h-5">
							#{branch.rank}
						</Badge>
					</div>
					<p className="text-[13px] text-gray-400">{branch.location}</p>
				</div>
			</div>
			<div className="space-y-3">
				<BranchMetric
					icon={DollarSign}
					label="Revenue"
					value={branch.revenue}
				/>
				<BranchMetric
					icon={growthIcon}
					label="Growth"
					value={`${branch.growth >= 0 ? "+" : ""}${branch.growth}%`}
					valueClass={branch.growth >= 0 ? "text-green-600" : "text-red-600"}
				/>
				<BranchMetric icon={Users} label="Employees" value={branch.employees} />
			</div>
		</Card>
	);
}
function BranchMetric({ icon, label, value, valueClass = "text-slate-900" }) {
	return (
		<div className="flex items-center justify-between">
			<div className="flex items-center gap-2 text-slate-500">
				{createElement(icon, { size: 16 })}
				<span>{label}</span>
			</div>
			<span className={valueClass}>{value}</span>
		</div>
	);
}
function createIcon(Icon) {
	return createElement(Icon, { size: 20 });
}
function getBranchPerformance(branches, sales, employees, period) {
	const { currentStart, previousStart } = periodBounds(period);
	return branches
		.map((branch) => {
			const branchSales = filterByBranch(sales, branch._id);
			const currentRevenue = sumRevenue(
				branchSales.filter((sale) =>
					between(sale.saleDate, currentStart, new Date()),
				),
			);
			const previousRevenue = sumRevenue(
				branchSales.filter((sale) =>
					between(sale.saleDate, previousStart, currentStart),
				),
			);
			const totalRevenue = sumRevenue(branchSales);
			return {
				id: branch._id,
				title: branch.name,
				location: branch.location || branch.address || "Operating branch",
				revenue: formatMoney(totalRevenue),
				revenueValue: totalRevenue,
				growth: previousRevenue
					? Number(
							(
								((currentRevenue - previousRevenue) / previousRevenue) *
								100
							).toFixed(1),
						)
					: currentRevenue
						? 100
						: 0,
				employees: filterByBranch(employees, branch._id).length,
			};
		})
		.sort((a, b) => b.revenueValue - a.revenueValue)
		.slice(0, 4)
		.map((branch, index) => ({ ...branch, rank: index + 1 }));
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
function byDate(a, b) {
	return new Date(b.saleDate) - new Date(a.saleDate);
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
