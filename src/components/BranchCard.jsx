import { Card } from "./ui/card";
import {
	TrendingUp,
	TrendingDown,
	Users,
	DollarSign,
	Package,
} from "lucide-react";
import { Badge } from "./ui/badge";

export function BranchCard(props) {
	const isPositiveGrowth = props.info.growth >= 0;


	return (
		<Card className="bg-white rounded-3xl p-6 min-w-[300px] flex-shrink-0 shadow">
			<div className="flex items-start justify-between mb-4">
				<div>
					<div className="flex items-center gap-2 mb-1">
						<h3>{props.info.title}</h3>
						<Badge variant="secondary" className="h-5">
							#{props.info.rank}
						</Badge>
					</div>
					<p className="text-muted-foreground text-[13px] text-gray-400">{props.info.location}</p>
				</div>
			</div>

			<div className="space-y-3">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2 text-muted-foreground">
						<DollarSign className="w-4 h-4" />
						<span>Revenue</span>
					</div>
					<span>{props.info.revenue}</span>
				</div>

				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2 text-muted-foreground">
						{isPositiveGrowth ? (
							<TrendingUp className="w-4 h-4" />
						) : (
							<TrendingDown className="w-4 h-4" />
						)}
						<span>Growth</span>
					</div>
					<span
						className={isPositiveGrowth ? "text-green-600" : "text-red-600"}
					>
						{isPositiveGrowth ? "+" : ""}
						{props.info.growth}%
					</span>
				</div>

				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2 text-muted-foreground">
						<Users className="w-4 h-4" />
						<span>Employees</span>
					</div>
					<span>{props.info.employees}</span>
				</div>

				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2 text-muted-foreground">
						<Package className="w-4 h-4" />
						<span>Orders</span>
					</div>
					<span>{props.info.orders.toLocaleString()}</span>
				</div>
			</div>
		</Card>
	);
}
