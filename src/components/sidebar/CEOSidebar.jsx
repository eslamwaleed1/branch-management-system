import {
	BarChart3,
	Building2,
	Home,
	Plus,
	Users,
	Warehouse,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useBusinessData } from "../../hooks/useBusinessData.js";
import BaseSidebar from "./BaseSidebar.jsx";
import SidebarNav from "./SidebarNav.jsx";

export default function CEOSidebar() {
	const { data: branches } = useBusinessData("branches");
	const links = [
		{ to: "/ceo/main", label: "Main", icon: Home },
		{ to: `/ceo/employees`, label: "Employees", icon: Users },
		{ to: `/ceo//sales`, label: "Sales", icon: BarChart3 },
		{ to: `/ceo//inventory`, label: "Inventory", icon: Warehouse },
		{ to: `/ceo//clients`, label: "Clients", icon: Users },
	];

	return (
		<BaseSidebar
			workspaceLabel="CEO workspace"
			userLabel="Mr. CEO"
			userRole="CEO"
		>
			{(onNavigate) => (
				<>
					<SidebarNav links={links} onNavigate={onNavigate} />
					<div className="mt-8 border-t border-slate-100 pt-5">
						<p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
							Branches
						</p>
						{branches.map((branch) => (
							<NavLink
								key={branch._id}
								to={`/ceo/branches/${branch._id}/main`}
								onClick={onNavigate}
								className={({ isActive }) =>
									`flex items-center rounded-lg px-3 py-2.5 text-sm font-medium ${isActive ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"}`
								}
							>
								<Building2 className="mr-3" size={16} />
								{branch.name}
							</NavLink>
						))}
						<NavLink
							to="/ceo/branches/new"
							onClick={onNavigate}
							className="mt-2 flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
						>
							<Plus size={16} />
							Add branch
						</NavLink>
					</div>
				</>
			)}
		</BaseSidebar>
	);
}
