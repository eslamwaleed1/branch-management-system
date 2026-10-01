import { PlusCircle, BookUser } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import BaseSidebar from "./BaseSidebar.jsx";
import { useBusinessData } from "../../hooks/useBusinessData.js";
import { createElement } from "react";

export default function SalesRepSidebar({ employeeId }) {
	const navigate = useNavigate();
	const { data: employees } = useBusinessData("employees");
	const basePath = `/sales-rep/${employeeId}`;
	const links = [
		{ to: `${basePath}/sales`, label: "My Sales", icon: BookUser },
		{ to: `${basePath}/sales/new`, label: "Add Sale", icon: PlusCircle },
	];

	return (
		<BaseSidebar
			workspaceLabel="Sales Representative"
			userLabel="Sales Representative"
			userRole="Sales Rep"
		>
			{(onNavigate) => (
				<>
					<label className="mb-5 px-3 text-sm font-semibold tracking-wide text-slate-400">
						The sales rep you're viewing as:
						<select
							value={employeeId || ""}
							onChange={(event) => {
								navigate(`/sales-rep/${event.target.value}/sales`);
								onNavigate();
							}}
							className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium normal-case text-slate-700 outline-none focus:border-blue-400"
						>
							<option value="" disabled>
								Select Sales Rep
							</option>
							{employees.map(
								(employee) =>
									employee.position === "Sales Rep" && (
										<option value={employee._id} key={employee._id}>
											{employee.name}
										</option>
									),
							)}
						</select>
					</label>
					<nav className="space-y-1">
						{links.map(({ to, label, icon: NavIcon }) => (
							<NavLink
								key={to}
								end={label === "My Sales"}
								to={to}
								onClick={onNavigate}
								className={({ isActive }) =>
									`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${isActive ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"}`
								}
							>
								{createElement(NavIcon, { size: 19 })}
								{label}
							</NavLink>
						))}
					</nav>
				</>
			)}
		</BaseSidebar>
	);
}
