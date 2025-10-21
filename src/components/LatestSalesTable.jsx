import { useEffect, useState } from "react";

export default function LatestSalesTable() {
	const [sales, setSales] = useState([]);

	const mockClients = [
		"John Smith",
		"Jane Doe",
		"Michael Brown",
		"Emily Johnson",
		"Chris Evans",
		"Sarah Parker",
		"Tom Lee",
		"Nina Davis",
		"Ali Hassan",
		"Mona Youssef",
	];

	const mockStatuses = ["Completed", "Pending", "Refunded"];

	function generateMockSale() {
		const id = Math.floor(100000 + Math.random() * 900000);
		const client = mockClients[Math.floor(Math.random() * mockClients.length)];
		const total = (50 + Math.random() * 500).toFixed(2);
		const status = mockStatuses[Math.floor(Math.random() * mockStatuses.length)];
		const date = new Date().toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		});
		return { id, client, total, status, date };
	}

	useEffect(() => {
		const interval = setInterval(() => {
			setSales((prev) => {
				const newSale = generateMockSale();
				const updated = [newSale, ...prev];
				return updated.slice(0, 10); // keep latest 10
			});
		}, 2000); // new sale every 2 seconds

		return () => clearInterval(interval);
	}, []);

	return (
		<div className="bg-white rounded-2xl shadow-md p-5 w-full max-w-[600px] overflow-hidden">
			<h2 className="text-lg font-semibold text-gray-700 mb-3">
				Latest Sales
			</h2>
			<div className="overflow-x-auto">
				<table className="w-full text-sm text-left border-collapse">
					<thead>
						<tr className="text-gray-600 border-b">
							<th className="py-2 px-3">Sale ID</th>
							<th className="py-2 px-3">Client</th>
							<th className="py-2 px-3">Total ($)</th>
							<th className="py-2 px-3">Status</th>
							<th className="py-2 px-3">Time</th>
						</tr>
					</thead>
					<tbody>
						{sales.map((sale, index) => (
							<tr
								key={sale.id}
								className={`transition-all ${
									index === 0
										? "bg-green-50 animate-pulse"
										: "hover:bg-gray-50"
								}`}
							>
								<td className="py-2 px-3 text-gray-800">{sale.id}</td>
								<td className="py-2 px-3 text-gray-700">{sale.client}</td>
								<td className="py-2 px-3 font-medium text-gray-900">
									${sale.total}
								</td>
								<td className="py-2 px-3">
									<span
										className={`px-2 py-1 text-xs rounded-full ${
											sale.status === "Completed"
												? "bg-green-100 text-green-700"
												: sale.status === "Pending"
												? "bg-yellow-100 text-yellow-700"
												: "bg-red-100 text-red-700"
										}`}
									>
										{sale.status}
									</span>
								</td>
								<td className="py-2 px-3 text-gray-500">{sale.date}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
