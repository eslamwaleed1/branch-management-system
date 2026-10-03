import CEOSidebar from "../../components/sidebar/CEOSidebar.jsx";
import { useLocation } from "react-router-dom";
import { capitalizeFirstLetter } from "../../lib/utils.js";
import EmployeeForm from "../../components/entity-components/forms/EmployeeForm.jsx";
import ClientForm from "../../components/entity-components/forms/ClientForm.jsx";
import BranchForm from "../../components/entity-components/forms/BranchForm.jsx";
import SaleForm from "../../components/entity-components/forms/SaleForm.jsx";
import ProductForm from "../../components/entity-components/forms/ProductForm.jsx";

const prepareEntityName = (url) => {
	if (typeof url !== "string") {
		return null;
	}

	const match = url.match(/\/ceo\/([^/]+)\/new/);
	let entity = match ? match[1] : null;
	entity = capitalizeFirstLetter(entity);

	return entity === "Branches"
		? "Branch"
		: entity[entity.length - 1] === "s"
			? entity.slice(0, -1)
			: "Product";
};

export default function CEOAddEntityPage() {
	const entity = prepareEntityName(useLocation().pathname);

	return (
		<div className="flex min-h-dvh bg-[#F5F7F9]">
			<CEOSidebar />
			<main className="w-full bg-[#F5F7F9] px-5 py-8 sm:px-8">
				<header className="mb-8 flex items-center justify-between gap-4">
					<div>
						<h1 className="text-3xl font-semibold tracking-tight text-gray-900">
							Add {entity}
						</h1>
						<p className="mt-2 text-sm text-gray-500">
							Add a new {entity}
							{entity != "Branch" && ` to any branch`}.
						</p>
					</div>
				</header>
				{entity === "Employee" && <EmployeeForm allowRegionalManager />}
				{entity === "Client" && <ClientForm />}
				{entity === "Branch" && <BranchForm />}
				{entity === "Sale" && <SaleForm targetPath="/ceo/sales" />}
				{entity === "Product" && <ProductForm />}
			</main>
		</div>
	);
}
