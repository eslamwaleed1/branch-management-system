import SaleForm from "../../components/entity-components/forms/SaleForm.jsx";
import SalesRepSidebar from "../../components/sidebar/SalesRepSidebar.jsx";
import { useBusinessData } from "../../hooks/useBusinessData";

export default function SalesRepAddSalePage({ employeeId }) {
	const { data: employees } = useBusinessData("employees");
	const salesRep = getDefaultSalesRep();

	function getDefaultSalesRep() {
		return employees.find((employee) => employee._id === employeeId);
	}

	return (
		<div className="flex min-h-dvh bg-[#F5F7F9]">
			<SalesRepSidebar employeeId={employeeId} />
			<main className="min-h-dvh w-full overflow-y-auto bg-[#F5F7F9] px-5 py-8 sm:px-8">
				<header className="mb-8 flex items-center justify-between gap-4">
					<div>
						<h1 className="text-3xl font-semibold tracking-tight text-gray-900">
							Add a new sale
						</h1>
						<p className="mt-2 text-sm text-gray-500">
							Add a new sale to this branch.
						</p>
					</div>
				</header>
				<SaleForm employee={salesRep.name} targetPath={`/sales-rep/${salesRep._id}/sales`} />
			</main>
		</div>
	);
}
