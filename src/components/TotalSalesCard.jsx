import { useState, useEffect } from "react";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Filler,
	Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Filler,
	Legend
);

export default function TotalSalesCard() {
	const [timeRange, setTimeRange] = useState("monthly");
	const [chartData, setChartData] = useState([]);
	const [totalSales, setTotalSales] = useState(463602.39);
	const [percentChange, setPercentChange] = useState(18);

	function generateMockData(points) {
		return Array.from({ length: points }, () =>
			Math.floor(10000 + Math.random() * 40000)
		);
	}

	useEffect(() => {
		let interval = setInterval(() => {
			let newData;
			if (timeRange === "daily") newData = generateMockData(7);
			else if (timeRange === "monthly") newData = generateMockData(12);
			else newData = generateMockData(12);

			setChartData(newData);
			setTotalSales(400000 + Math.random() * 100000);
			setPercentChange(Math.floor(5 + Math.random() * 20));
		}, 3000);

		return () => clearInterval(interval);
	}, [timeRange]);

	const labels =
		timeRange === "daily"
			? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
			: timeRange === "monthly"
			? ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
			: ["2020", "2021", "2022", "2023", "2024", "2025"];

	const data = {
		labels,
		datasets: [
			{
				label: "Total Sales",
				data: chartData,
				borderColor: "rgba(34, 197, 94, 1)",
				backgroundColor: "rgba(34, 197, 94, 0.1)",
				tension: 0.4,
				fill: true,
				pointRadius: 3,
				pointBackgroundColor: "#22c55e",
			},
		],
	};

	const options = {
		responsive: true,
		plugins: {
			legend: { display: false },
			tooltip: { enabled: false },
		},
		scales: {
			y: {
				beginAtZero: true,
				grid: { color: "rgba(0,0,0,0.05)" },
				ticks: { color: "#999" },
			},
			x: {
				grid: { display: false },
				ticks: { color: "#999" },
			},
		},
	};

	return (
		<div className="bg-white rounded-2xl shadow-md p-5 w-full max-w-[600px]">
			<div className="flex justify-between items-center mb-3">
				<div>
					<h2 className="text-lg font-semibold text-gray-700">Total Sales</h2>
					<p className="text-2xl font-bold text-gray-900">
						${totalSales.toLocaleString()}
					</p>
					<p className="text-sm text-green-600">
						↑ {percentChange}% <span className="text-gray-500">from last month</span>
					</p>
				</div>
				<div className="flex gap-2">
					{["daily", "monthly", "yearly"].map((t) => (
						<button
							key={t}
							onClick={() => setTimeRange(t)}
							className={`px-3 py-1 rounded-full text-sm capitalize ${
								timeRange === t
									? "bg-green-100 text-green-700 font-medium"
									: "bg-gray-100 text-gray-600 hover:bg-gray-200"
							}`}
						>
							{t}
						</button>
					))}
				</div>
			</div>
			<Line data={data} options={options} height={70} />
		</div>
	);
}
