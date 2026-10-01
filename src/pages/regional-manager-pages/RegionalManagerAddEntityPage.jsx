import RegionalManagerSidebar from "../../components/sidebar/RegionalManagerSidebar.jsx";
import { useLocation } from "react-router-dom";
import { capitalizeFirstLetter } from "../../lib/utils.js";
import EmployeeForm from "../../components/entity-components/forms/EmployeeForm.jsx";
import ClientForm from "../../components/entity-components/forms/ClientForm.jsx";
import BranchForm from "../../components/entity-components/forms/BranchForm.jsx";
import SaleForm from "../../components/entity-components/forms/SaleForm.jsx";
import ProductForm from "../../components/entity-components/forms/ProductForm.jsx";

const extractEntityName = (url) => {
	if (typeof url !== "string") {
		return null;
	}

	const match = url.match(/\/regional-manager\/[^/]+\/([^/]+)\/new/);
	let entity = match ? match[1] : null;

	if (!entity) return "Product";

	entity = capitalizeFirstLetter(entity);

	if (entity === "Inventory") return "Product";
	return entity[entity.length - 1] === "s" ? entity.slice(0, -1) : entity;
};

const extractBranchId = (url) => {
	if (typeof url !== "string") {
		return null;
	}

	const match = url.match(/\/regional-manager\/([^/]+)/);
	return match ? match[1] : null;
};

export default function RegionalManagerAddEntityPage() {
	const pathname = useLocation().pathname;
	const entity = extractEntityName(pathname);
	const branchId = extractBranchId(pathname);
	const targetPath = `/regional-manager/${branchId}`;

	return (
		<div className="flex max-h-dvh bg-[#F5F7F9]">
			<RegionalManagerSidebar branchId={branchId} />
			<main className="min-h-dvh w-full overflow-y-auto bg-[#F5F7F9] px-5 py-8 sm:px-8">
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
				{entity === "Employee" && (
					<EmployeeForm
						branchId={branchId}
						targetPath={`${targetPath}/employees`}
					/>
				)}
				{entity === "Client" && (
					<ClientForm
						branchId={branchId}
						targetPath={`${targetPath}/clients`}
					/>
				)}
				{entity === "Branch" && (
					<BranchForm targetPath={`${targetPath}/main`} />
				)}
				{entity === "Sale" && <SaleForm targetPath={`${targetPath}/sales`} />}
				{entity === "Product" && (
					<ProductForm
						branchId={branchId}
						targetPath={`${targetPath}/inventory`}
					/>
				)}
			</main>
		</div>
	);
}
