import { Eye, Trash2 } from "lucide-react";

export default function ClientCard({ client, openViewModal, deleteClient }) {
	return (
		<article className="flex min-h-[220px] flex-col justify-between rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
			<div>
				<div className="flex items-start justify-between gap-4">
					<div className="flex min-w-0 items-center gap-3">
						<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-base font-semibold text-blue-700">
							{getInitials(client.name)}
						</div>
						<div className="min-w-0">
							<h2 className="truncate text-lg font-semibold text-gray-900">
								{client.name}
							</h2>
							<p className="truncate text-sm text-gray-500">
								{client.email || "No email"}
							</p>
						</div>
					</div>
					<span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
						Active
					</span>
				</div>
				<div className="mt-6 border-t border-gray-100 pt-4">
					<p className="text-xs font-medium uppercase tracking-wide text-gray-400">
						Phone
					</p>
					<p className="mt-1 text-sm font-medium text-gray-700">
						{client.phone || "-"}
					</p>
				</div>
			</div>
			<div className="mt-6 flex items-center gap-2 border-t border-gray-100 pt-4">
				<button
					type="button"
					onClick={() => openViewModal(client)}
					className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-blue-50 hover:text-blue-700"
				>
					<Eye size={16} />
					View
				</button>
				<button
					type="button"
					onClick={() => deleteClient(client)}
					className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
					title="Delete client"
				>
					<Trash2 size={17} />
				</button>
			</div>
		</article>
	);
}

function getInitials(name = "") {
	return name
		.split(" ")
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0].toUpperCase())
		.join("");
}
