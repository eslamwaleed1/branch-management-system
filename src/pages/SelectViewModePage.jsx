import { BriefcaseBusiness, Store, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle.jsx";
const roles = [
	{
		to: "/ceo/main",
		icon: BriefcaseBusiness,
		title: "CEO",
		text: "Company-wide performance, branches, and operations.",
	},
	{
		to: "/regional-manager/main",
		icon: Store,
		title: "Regional manager",
		text: "A focused branch view with an easy branch switcher.",
	},
	{
		to: "/sales-rep",
		icon: UserRound,
		title: "Sales Representative",
		text: "Simple sales rep interface to record and view sales.",
	},
];
export default function SelectViewModePage() {
	return (
		<main className="min-h-dvh bg-slate-50 px-6 py-10 text-slate-900 sm:px-10">
			<div className="mx-auto max-w-6xl">
				<div className="flex justify-end">
					<ThemeToggle />
				</div>
				<div className="mt-12 max-w-2xl">
					<p className="font-semibold text-blue-600">
						Manage your business at home
					</p>
					<h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
						Branch Management System
					</h1>
					<p className="mt-10 text-lg text-slate-500">
						Choose a role to view the system as:
					</p>
				</div>
				<div className="mt-6 grid gap-5 md:grid-cols-3">
					{roles.map((role) => (
						<RoleCard key={role.title} {...role} />
					))}
				</div>
			</div>
		</main>
	);
}
function RoleCard({ to, icon, title, text }) {
	const Icon = icon;
	return (
		<Link
			to={to}
			className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
		>
			<span className="inline-flex rounded-xl bg-blue-50 p-3 text-blue-600">
				<Icon size={25} />
			</span>
			<h2 className="mt-6 text-xl font-bold text-slate-900">{title}</h2>
			<p className="mt-2 leading-6 text-slate-500">{text}</p>
			<p className="mt-6 text-sm font-semibold text-blue-600">
				Explore as this role →
			</p>
		</Link>
	);
}
