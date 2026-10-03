import { useState } from "react";
import { ArrowLeft, LogOut, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../ThemeToggle.jsx";
import { authApi } from "../../lib/api.js";

export default function BaseSidebar({
	workspaceLabel,
	userLabel,
	children,
	userRole,
	mobileScrollable = false,
}) {
	const [open, setOpen] = useState(false);
	const [logoutPending, setLogoutPending] = useState(false);
	const [logoutError, setLogoutError] = useState("");
	const navigate = useNavigate();

	const closeSidebar = () => setOpen(false);

	const handleLogout = async () => {
		setLogoutError("");
		setLogoutPending(true);
		try {
			const { csrfToken } = await authApi.csrfToken();
			if (!csrfToken) throw new Error("Missing CSRF token");
			await authApi.logout(csrfToken);
			window.dispatchEvent(new Event("bms:logout"));
			navigate("/login", { replace: true });
		} catch (error) {
			setLogoutError(error.message || "Unable to log out. Please try again.");
		} finally {
			setLogoutPending(false);
		}
	};

	return (
		<>
			<button
				type="button"
				aria-label="Open navigation"
				onClick={() => setOpen(true)}
				className="fixed left-4 top-4 z-30 cursor-pointer rounded-lg border border-slate-200 bg-white p-2 text-slate-700 shadow-sm xl:hidden"
			>
				<Menu size={21} />
			</button>
			<div
				className={`fixed inset-0 z-40 bg-slate-950/35 transition xl:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
				onClick={closeSidebar}
			/>
			<aside
				className={`fixed inset-y-0 left-0 z-50 flex w-72 shrink-0 flex-col border-r border-slate-100 bg-white px-3 py-5 shadow-xl transition-transform xl:static xl:min-h-dvh xl:w-64 xl:translate-x-0 xl:shadow-none ${mobileScrollable ? "overflow-y-auto xl:overflow-visible" : ""} ${open ? "translate-x-0" : "-translate-x-full"}`}
			>
				<button
					type="button"
					onClick={() => {
						navigate("/onboarding");
						closeSidebar();
					}}
					className="mb-8 flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-50"
				>
					<ArrowLeft size={18} />
					Back to roles
				</button>
				<div className="mb-8 px-3">
					<p className="text-lg font-bold text-slate-900">Branch Management</p>
					<p className="mt-1 text-sm text-slate-500">{workspaceLabel}</p>
				</div>
				{children(closeSidebar)}
				<div className="mt-auto border-t border-slate-100 pt-4">
					<div className="mb-4 px-3">
						<ThemeToggle compact />
					</div>
					<p className="truncate px-3 text-sm font-medium text-slate-800">
						{userLabel}
					</p>
					<p className="px-3 text-xs text-slate-400">{userRole}</p>
					{logoutError && (
						<p role="alert" className="px-3 pt-2 text-xs text-red-600">
							{logoutError}
						</p>
					)}
					<button
						type="button"
						onClick={handleLogout}
						disabled={logoutPending}
						className="mt-3 flex min-h-10 w-full items-center gap-2 rounded-lg px-3 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-700 disabled:cursor-wait disabled:opacity-60"
					>
						<LogOut size={17} />
						{logoutPending ? "Logging out..." : "Log out"}
					</button>
				</div>
				<button
					type="button"
					aria-label="Close navigation"
					onClick={closeSidebar}
					className="absolute right-4 top-4 cursor-pointer rounded-md p-1 text-slate-500 xl:hidden"
				>
					<X size={20} />
				</button>
			</aside>
		</>
	);
}
