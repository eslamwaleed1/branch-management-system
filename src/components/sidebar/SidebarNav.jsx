import { createElement } from "react";
import { NavLink } from "react-router-dom";

export default function SidebarNav({ links, onNavigate }) {
	return (
		<nav className="space-y-1">
			{links.map(({ to, label, icon: NavIcon }) => (
				<NavLink
					key={to}
					to={to}
					end
					// end={label === "Main"}
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
	);
}
