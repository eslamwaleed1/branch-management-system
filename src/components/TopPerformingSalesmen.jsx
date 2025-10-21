export default function TopPerformingSalesmen(props) {
	return (
		<div className="bg-blue-50 rounded-[8px] shadow-md p-[2px]">
			<table className="w-full text-left">
				<thead className="">
					<tr>
						<th className="py-3 px-8 font-semibold text-gray-700">#</th>
						<th className="py-3 px-8 font-semibold text-gray-700">Salesman</th>
						<th className="py-3 px-8 font-semibold text-gray-700">Revenue</th>
						<th className="py-3 px-8 font-semibold text-gray-700">Profit</th>
					</tr>
				</thead>
				<tbody>
					{
						props.data.map(
							(record, index) => {
								return <tr className="even:bg-gray-50 odd:bg-white" key={index}>
									<td className="py-2 px-4">{index+1}</td>
									<td className="py-2 px-4">{record.name}</td>
									<td className="py-2 px-4">${record.revenue}</td>
									<td className="py-2 px-4">{record.profit}%</td>
								</tr>
							}
						)
					}
				</tbody>
			</table>
		</div>
	);
}