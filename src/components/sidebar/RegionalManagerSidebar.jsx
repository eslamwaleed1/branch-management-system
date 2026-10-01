import { BarChart3, Home, Users, Warehouse } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useBusinessData } from "../../hooks/useBusinessData.js";
import BaseSidebar from "./BaseSidebar.jsx";
import SidebarNav from "./SidebarNav.jsx";

export default function RegionalManagerSidebar({ branchId }) {
	const navigate = useNavigate();
	const location = useLocation();
	const { data: branches } = useBusinessData("branches");
	const basePath = `/regional-manager/${branchId}`;
	const links = [
		{ to: `${basePath}/main`, label: "Main", icon: Home },
		{ to: `${basePath}/employees`, label: "Employees", icon: Users },
		{ to: `${basePath}/clients`, label: "Clients", icon: Users },
		{ to: `${basePath}/sales`, label: "Sales", icon: BarChart3 },
		{ to: `${basePath}/inventory`, label: "Inventory", icon: Warehouse },
	];

	return (
		<BaseSidebar
			workspaceLabel="Regional Manager"
			userLabel="Mr. Manager"
			userRole="Regional Manager"
		>
			{(onNavigate) => (
				<>
					<label className="mb-5 px-3 text-sm font-semibold tracking-wide text-slate-400">
						The branch you're viewing as its manager:
						<select
							value={branchId || ""}
							onChange={(event) => {
								const section = location.pathname.split("/").pop();
								const nextSection = [
									"main",
									"employees",
									"clients",
									"sales",
									"inventory",
								].includes(section)
									? section
									: "main";
								navigate(
									`/regional-manager/${event.target.value}/${nextSection}`,
								);
								onNavigate();
							}}
							className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium normal-case text-slate-700 outline-none focus:border-blue-400"
						>
							<option value="" disabled>
								Select branch
							</option>
							{branches.map((branch) => (
								<option value={branch._id} key={branch._id}>
									{branch.name}
								</option>
							))}
						</select>
					</label>
					<SidebarNav links={links} onNavigate={onNavigate} />
				</>
			)}
		</BaseSidebar>
	);
}
