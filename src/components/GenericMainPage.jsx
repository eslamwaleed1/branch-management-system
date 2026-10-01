import { useMemo, useState } from "react";
import {
	Chart as ChartJS,
	CategoryScale,
	Filler,
	LinearScale,
	LineElement,
	PointElement,
	Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import {
	ArrowDownRight,
	ArrowUpRight,
	Banknote,
	BriefcaseBusiness,
	ChartNoAxesCombined,
	CircleDollarSign,
	PackageCheck,
	ReceiptText,
	UsersRound,
} from "lucide-react";
import CEOSidebar from "./sidebar/CEOSidebar.jsx";
import RegionalManagerSidebar from "./sidebar/RegionalManagerSidebar.jsx";
import SalesRepSidebar from "./sidebar/SalesRepSidebar.jsx";
import { filterByBranch, useBusinessData } from "../hooks/useBusinessData.js";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Filler,
	Tooltip,
);

const PERIODS = {
	day: { label: "Today", previous: "yesterday" },
	month: { label: "This month", previous: "last month" },
	quarter: { label: "This quarter", previous: "last quarter" },
	year: { label: "This year", previous: "last year" },
};
const PROFIT_MARGIN = 0.25;

export default function GenericMainPage({ role, branchId }) {
	const [period, setPeriod] = useState("day");
	const branches = useBusinessData("branches");
	const clients = useBusinessData("clients");
	const employees = useBusinessData("employees");
	const sales = useBusinessData("sales");
	const products = useBusinessData("products");
	const allLoading = [branches, clients, employees, sales, products].some(
		(resource) => resource.loading,
	);
	const selectedBranches = branchId
		? branches.data.filter((branch) => branch._id === branchId)
		: branches.data;
	const scopedSales = filterByBranch(sales.data, branchId);

	const dashboard = useMemo(() => {
		const { currentStart, previousStart } = getPeriodBounds(period);
		const currentSales = scopedSales.filter((sale) =>
			isBetween(sale.saleDate, currentStart, new Date()),
		);
		const previousSales = scopedSales.filter((sale) =>
			isBetween(sale.saleDate, previousStart, currentStart),
		);
		const currentRevenue = sumRevenue(currentSales);
		const previousRevenue = sumRevenue(previousSales);
		return {
			currentSales,
			metrics: [
				{
					label: `${PERIODS[period].label} sales`,
					value: currentSales.length,
					previous: previousSales.length,
					icon: ReceiptText,
					accent: "blue",
					kind: "count",
				},
				{
					label: `${PERIODS[period].label} revenue`,
					value: currentRevenue,
					previous: previousRevenue,
					icon: CircleDollarSign,
					accent: "emerald",
					kind: "money",
				},
				{
					label: `${PERIODS[period].label} profit`,
					value: currentRevenue * PROFIT_MARGIN,
					previous: previousRevenue * PROFIT_MARGIN,
					icon: Banknote,
					accent: "violet",
					kind: "money",
				},
			],
			chart: makeChartData(scopedSales, period, currentStart),
		};
	}, [period, scopedSales]);
	const latestSales = useMemo(
		() =>
			[...scopedSales]
				.sort((a, b) => new Date(b.saleDate) - new Date(a.saleDate))
				.slice(0, 5),
		[scopedSales],
	);

	return (
		<div className="flex min-h-dvh bg-[#f5f7f9]">
			{role === "ceo" ? (
				<CEOSidebar branchId={branchId} />
			) : role === "manager" ? (
				<RegionalManagerSidebar branchId={branchId} />
			) : (
				<SalesRepSidebar />
			)}
			<main className="w-full overflow-y-auto px-5 py-8 sm:px-8">
				<div className="mx-auto max-w-7xl">
					<header className="mb-7">
						<p className="text-sm font-semibold text-blue-600">
							{branchId
								? selectedBranches[0]?.name || "Branch overview"
								: "Executive dashboard"}
						</p>
						<h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
							{branchId ? "Branch performance" : "Good morning, Mr. CEO"}
						</h1>
						<p className="mt-2 text-sm text-slate-500">
							A live view of your sales activity and operating performance.
						</p>
					</header>
					{allLoading ? (
						<p className="text-sm text-slate-500">Loading dashboard...</p>
					) : (
						<>
							<section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
								<div className="mb-5 flex flex-wrap items-center justify-between gap-3">
									<div>
										<h2 className="text-lg font-bold text-slate-900">
											Today&apos;s numbers
										</h2>
										<p className="mt-1 text-sm text-slate-500">
											Track the metrics that matter most.
										</p>
									</div>
									<select
										aria-label="Dashboard period"
										value={period}
										onChange={(event) => setPeriod(event.target.value)}
										className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500"
									>
										<option value="day">Today</option>
										<option value="month">This month</option>
										<option value="quarter">This quarter</option>
										<option value="year">This year</option>
									</select>
								</div>
								<div className="grid gap-4 md:grid-cols-3">
									{dashboard.metrics.map((metric) => (
										<MetricCard
											key={metric.label}
											metric={metric}
											period={period}
										/>
									))}
								</div>
							</section>

							<section className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.95fr]">
								<article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
									<div className="flex items-start justify-between gap-4">
										<div>
											<div className="flex items-center gap-2">
												<span className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
													<ChartNoAxesCombined size={18} />
												</span>
												<h2 className="text-lg font-bold text-slate-900">
													Sales performance
												</h2>
											</div>
											<p className="mt-2 text-sm text-slate-500">
												Revenue across {PERIODS[period].label.toLowerCase()}.
											</p>
										</div>
										<p className="text-right text-lg font-bold text-slate-900">
											{formatMoney(sumRevenue(dashboard.currentSales))}
											<span className="mt-1 block text-xs font-medium text-slate-400">
												revenue
											</span>
										</p>
									</div>
									<div className="mt-6 h-64">
										<Line
											data={{
												labels: dashboard.chart.labels,
												datasets: [
													{
														data: dashboard.chart.values,
														borderColor: "#10b981",
														backgroundColor: "rgba(16, 185, 129, 0.12)",
														fill: true,
														tension: 0.38,
														pointRadius: 3,
														pointHoverRadius: 5,
														pointBackgroundColor: "#10b981",
														borderWidth: 3,
													},
												],
											}}
											options={chartOptions}
										/>
									</div>
								</article>
								<article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
									<div className="flex items-center justify-between">
										<div>
											<h2 className="text-lg font-bold text-slate-900">
												Latest sales
											</h2>
											<p className="mt-1 text-sm text-slate-500">
												Most recent transactions.
											</p>
										</div>
										<span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
											Live
										</span>
									</div>
									<div className="mt-4 divide-y divide-slate-100">
										{latestSales.length === 0 ? (
											<p className="py-10 text-center text-sm text-slate-500">
												No sales recorded yet.
											</p>
										) : (
											latestSales.map((sale) => (
												<div
													className="flex items-center justify-between gap-3 py-3"
													key={sale._id}
												>
													<div className="min-w-0">
														<p className="truncate font-semibold text-slate-800">
															{sale.client?.name || "Walk-in client"}
														</p>
														<p className="mt-0.5 text-xs text-slate-500">
															{sale.branch?.name || "Unassigned branch"} ·{" "}
															{timeAgo(sale.saleDate)}
														</p>
													</div>
													<p className="shrink-0 font-bold text-slate-900">
														{formatMoney(sale.totalAmount)}
													</p>
												</div>
											))
										)}
									</div>
								</article>
							</section>

							<section className="mt-6">
								<div className="mb-4 flex items-end justify-between">
									<div>
										<h2 className="text-xl font-bold text-slate-900">
											Branch snapshot
										</h2>
										<p className="mt-1 text-sm text-slate-500">
											Live performance by operating location.
										</p>
									</div>
									<span className="hidden text-sm font-medium text-slate-400 sm:block">
										{PERIODS[period].label}
									</span>
								</div>
								<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
									{selectedBranches.map((branch) => (
										<BranchCard
											key={branch._id}
											branch={branch}
											sales={sales.data}
											clients={clients.data}
											employees={employees.data}
											period={period}
										/>
									))}
								</div>
							</section>
						</>
					)}
				</div>
			</main>
		</div>
	);
}

function MetricCard({ metric, period }) {
	const Icon = metric.icon;
	const change = percentChange(metric.value, metric.previous);
	const positive = change >= 0;
	const accent = {
		blue: "bg-blue-50 text-blue-600",
		emerald: "bg-emerald-50 text-emerald-600",
		violet: "bg-violet-50 text-violet-600",
	}[metric.accent];
	return (
		<article className="rounded-xl border border-slate-100 bg-gradient-to-b from-white to-slate-50/70 p-5">
			<div className="flex items-start justify-between">
				<p className="font-medium text-slate-500">{metric.label}</p>
				<span className={`rounded-xl p-2.5 ${accent}`}>
					<Icon size={20} />
				</span>
			</div>
			<p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
				{metric.kind === "money"
					? formatMoney(metric.value)
					: metric.value.toLocaleString()}
			</p>
			<p
				className={`mt-3 flex items-center gap-1 text-sm font-semibold ${positive ? "text-emerald-600" : "text-rose-600"}`}
			>
				{positive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
				{Math.abs(change)}%{" "}
				<span className="font-normal text-slate-500">
					from {PERIODS[period].previous}
				</span>
			</p>
		</article>
	);
}
function BranchCard({ branch, sales, clients, employees, period }) {
	const { currentStart } = getPeriodBounds(period);
	const branchSales = sales.filter(
		(sale) =>
			sale.branch?._id === branch._id &&
			isBetween(sale.saleDate, currentStart, new Date()),
	);
	return (
		<article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
			<div className="flex items-start justify-between gap-3">
				<div>
					<h3 className="font-bold text-slate-900">{branch.name}</h3>
					<p className="mt-1 text-sm text-slate-400">
						{branch.location || branch.address || "Operating branch"}
					</p>
				</div>
				<span className="rounded-lg bg-slate-100 p-2 text-slate-500">
					<BriefcaseBusiness size={17} />
				</span>
			</div>
			<div className="my-5 h-px bg-slate-100" />
			<div className="space-y-3 text-sm">
				<Detail
					icon={CircleDollarSign}
					label="Revenue"
					value={formatMoney(sumRevenue(branchSales))}
				/>
				<Detail
					icon={ReceiptText}
					label="Sales"
					value={branchSales.length.toLocaleString()}
				/>
				<Detail
					icon={UsersRound}
					label="Clients"
					value={filterByBranch(clients, branch._id).length.toLocaleString()}
				/>
				<Detail
					icon={PackageCheck}
					label="Employees"
					value={filterByBranch(employees, branch._id).length.toLocaleString()}
				/>
			</div>
		</article>
	);
}
function Detail({ icon, label, value }) {
	const Icon = icon;
	return (
		<div className="flex items-center justify-between gap-3">
			<span className="flex items-center gap-2 text-slate-500">
				<Icon size={15} />
				{label}
			</span>
			<span className="font-semibold text-slate-800">{value}</span>
		</div>
	);
}
function getPeriodBounds(period) {
	const now = new Date();
	const currentStart = new Date(now);
	if (period === "day") currentStart.setHours(0, 0, 0, 0);
	if (period === "month") {
		currentStart.setDate(1);
		currentStart.setHours(0, 0, 0, 0);
	}
	if (period === "quarter") {
		currentStart.setMonth(Math.floor(now.getMonth() / 3) * 3, 1);
		currentStart.setHours(0, 0, 0, 0);
	}
	if (period === "year") {
		currentStart.setMonth(0, 1);
		currentStart.setHours(0, 0, 0, 0);
	}
	const previousStart = new Date(currentStart);
	if (period === "day") previousStart.setDate(previousStart.getDate() - 1);
	if (period === "month") previousStart.setMonth(previousStart.getMonth() - 1);
	if (period === "quarter")
		previousStart.setMonth(previousStart.getMonth() - 3);
	if (period === "year")
		previousStart.setFullYear(previousStart.getFullYear() - 1);
	return { currentStart, previousStart };
}
function isBetween(date, start, end) {
	const value = new Date(date);
	return !Number.isNaN(value.getTime()) && value >= start && value < end;
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
function percentChange(current, previous) {
	if (!previous) return current ? 100 : 0;
	return Math.round(((current - previous) / previous) * 100);
}
function makeChartData(sales, period, currentStart) {
	const now = new Date();
	let labels;
	let starts;
	if (period === "day") {
		starts = Array.from({ length: 8 }, (_, index) => {
			const point = new Date(currentStart);
			point.setHours(index * 3);
			return point;
		});
		labels = starts.map((point) =>
			point.toLocaleTimeString([], { hour: "numeric" }),
		);
	} else if (period === "month") {
		starts = Array.from(
			{ length: Math.max(1, now.getDate()) },
			(_, index) => new Date(now.getFullYear(), now.getMonth(), index + 1),
		);
		labels = starts.map((point) => point.getDate());
	} else {
		const count = period === "quarter" ? 3 : 12;
		const firstMonth = period === "quarter" ? currentStart.getMonth() : 0;
		starts = Array.from(
			{ length: count },
			(_, index) => new Date(now.getFullYear(), firstMonth + index, 1),
		);
		labels = starts.map((point) =>
			point.toLocaleDateString([], { month: "short" }),
		);
	}
	return {
		labels,
		values: starts.map((start, index) =>
			sumRevenue(
				sales.filter((sale) =>
					isBetween(sale.saleDate, start, starts[index + 1] || new Date()),
				),
			),
		),
	};
}
function timeAgo(dateString) {
	const minutes = Math.round(
		(Date.now() - new Date(dateString).getTime()) / 60000,
	);
	if (minutes < 1) return "Just now";
	if (minutes < 60) return `${minutes}m ago`;
	const hours = Math.round(minutes / 60);
	if (hours < 24) return `${hours}h ago`;
	return `${Math.round(hours / 24)}d ago`;
}
const chartOptions = {
	responsive: true,
	maintainAspectRatio: false,
	plugins: {
		legend: { display: false },
		tooltip: {
			callbacks: { label: (context) => formatMoney(context.raw) },
			displayColors: false,
			backgroundColor: "#0f172a",
			padding: 10,
		},
	},
	scales: {
		x: {
			grid: { display: false },
			border: { display: false },
			ticks: { color: "#94a3b8", font: { size: 11 }, maxTicksLimit: 8 },
		},
		y: {
			beginAtZero: true,
			grid: { color: "#eef2f7" },
			border: { display: false },
			ticks: {
				color: "#94a3b8",
				font: { size: 11 },
				callback: (value) => `$${Number(value).toLocaleString()}`,
			},
		},
	},
};
