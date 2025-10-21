import { UserIcon, DollarSignIcon, PercentIcon, TruckIcon } from "lucide-react";
import { useState, useEffect } from "react";

export default function StatCards(props) {
	const [clients, setClients] = useState(parseInt(props.clients));
	const [revenue, setRevenue] = useState(parseInt(props.revenue));
	const [profit, setProfit] = useState(parseFloat(props.profit));
	const [shipments, setshipments] = useState(parseFloat(props.shipments));

	useEffect(() => {
		const intervalId = setInterval(() => {
			setClients((prev) => prev + 1);
			setRevenue((prev) => prev + 500);
			setProfit((prev) => prev + 0.5);
			setshipments((prev) => prev + 2);
		}, 5000);

		return () => clearInterval(intervalId);
	}, []);

	return (
		<div className="flex gap-[30px] justify-evenly mt-[10px]">
			<div className="stat-card">
				<p className="stat-card-title">Clients</p>
				<p className="stat-card-value">{clients}</p>
				<p className="stat-card-memo">
					<span className="text-red-500">-16%</span> from yesterday
				</p>
				<div className="stat-card-ico">
					<UserIcon size="20" className="text-blue-400 " />
				</div>
			</div>
			<div className="stat-card">
				<p className="stat-card-title">Revenue</p>
				<p className="stat-card-value">${revenue}</p>
				<p className="stat-card-memo">
					<span className="text-green-500">+10%</span> from yesterday
				</p>
				<div className="stat-card-ico">
					<DollarSignIcon size="20" className="text-green-400" />
				</div>
			</div>
			<div className="stat-card">
				<p className="stat-card-title">Profit</p>
				<p className="stat-card-value">{profit}%</p>
				<p className="stat-card-memo">
					<span className="text-green-500">+10%</span> from yesterday
				</p>
				<div className="stat-card-ico">
					<PercentIcon size="20" className="text-yellow-400" />
				</div>
				
			</div>
			<div className="stat-card">
				<p className="stat-card-title">Shipments</p>
				<p className="stat-card-value">{shipments}</p>
				<p className="stat-card-memo">
					<span className="text-red-500">-12%</span> from yesterday
				</p>
				<div className="stat-card-ico">
					<TruckIcon size="20" className="text-red-400" />
				</div>
			</div>
		</div>
	);
}
