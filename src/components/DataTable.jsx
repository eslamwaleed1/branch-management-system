export default function DataTable({
	columns,
	rows,
	emptyMessage = "No data found",
}) {
	return (
		<div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
			<table className="w-full min-w-[640px] text-left text-sm">
				<thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
					<tr>
						{columns.map((column) => (
							<th className="px-5 py-4" key={column.key}>
								{column.label}
							</th>
						))}
					</tr>
				</thead>
				<tbody className="divide-y divide-gray-100">
					{rows.length === 0 ? (
						<tr>
							<td
								className="px-5 py-10 text-center text-gray-500"
								colSpan={columns.length}
							>
								{emptyMessage}
							</td>
						</tr>
					) : (
						rows.map((row) => (
							<tr className="hover:bg-gray-50" key={row.id}>
								{columns.map((column) => (
									<td className="px-5 py-4 text-gray-700" key={column.key}>
										{column.render(row)}
									</td>
								))}
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	);
}
