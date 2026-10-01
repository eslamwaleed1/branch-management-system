import {
	BrowserRouter,
	Routes,
	Route,
	Navigate,
	useParams,
} from "react-router-dom";
import { createElement, lazy, Suspense } from "react";
import { useBusinessData } from "./hooks/useBusinessData.js";

const SelectViewModePage = lazy(() => import("./pages/SelectViewModePage.jsx"));

// ---- CEO Pages ----
const CEOMainPage = lazy(() => import("./pages/ceo-pages/CEOMainPage.jsx"));
const CEOBranchMainPage = lazy(
	() => import("./pages/ceo-pages/CEOBranchMainPage.jsx"),
);
const CEOEmployeesPage = lazy(
	() => import("./pages/ceo-pages/CEOEmployeesPage.jsx"),
);
const CEOInventoryPage = lazy(
	() => import("./pages/ceo-pages/CEOInventoryPage.jsx"),
);
const CEOClientsPage = lazy(
	() => import("./pages/ceo-pages/CEOClientsPage.jsx"),
);
const CEOSalesPage = lazy(() => import("./pages/ceo-pages/CEOSalesPage.jsx"));
const CEOAddEntityPage = lazy(
	() => import("./pages/ceo-pages/CEOAddEntityPage.jsx"),
);
// ---- CEO Pages ----

// ---- Regional Manager Pages ----
const RegionalManagerMainPage = lazy(
	() => import("./pages/regional-manager-pages/RegionalManagerMainPage.jsx"),
);
const RegionalManagerEmployeesPage = lazy(
	() =>
		import("./pages/regional-manager-pages/RegionalManagerEmployeesPage.jsx"),
);
const RegionalManagerClientsPage = lazy(
	() => import("./pages/regional-manager-pages/RegionalManagerClientsPage.jsx"),
);
const RegionalManagerSalesPage = lazy(
	() => import("./pages/regional-manager-pages/RegionalManagerSalesPage.jsx"),
);
const RegionalManagerInventoryPage = lazy(
	() =>
		import("./pages/regional-manager-pages/RegionalManagerInventoryPage.jsx"),
);
const RegionalManagerAddEntityPage = lazy(
	() =>
		import("./pages/regional-manager-pages/RegionalManagerAddEntityPage.jsx"),
);
// ---- Regional Manager Pages ----

// ---- Sales Rep Pages ----
const SalesRepAddSalePage = lazy(
	() => import("./pages/sales-rep-pages/SalesRepAddSalePage.jsx"),
);
const SalesRepSalesPage = lazy(
	() => import("./pages/sales-rep-pages/SalesRepSalesPage.jsx"),
);
// ---- Sales Rep Pages ----

function App() {
	return (
		<BrowserRouter>
			<Suspense fallback={<div>Loading page...</div>}>
				<Routes>
					{/* Redirections */}
					<Route path="/" element={<Navigate to="/onboarding" replace />} />
					<Route path="/ceo" element={<Navigate to="/ceo/main" replace />} />

					<Route path="/onboarding" element={<SelectViewModePage />} />

					<Route path="/ceo/main" element={<CEOMainPage />} />
					<Route path="/ceo/employees" element={<CEOEmployeesPage />} />
					<Route path="/ceo/inventory" element={<CEOInventoryPage />} />
					<Route path="/ceo/clients" element={<CEOClientsPage />} />
					<Route path="/ceo/sales" element={<CEOSalesPage />} />
					<Route path="/ceo/employees/new" element={<CEOAddEntityPage />} />
					<Route path="/ceo/inventory/new" element={<CEOAddEntityPage />} />
					<Route path="/ceo/clients/new" element={<CEOAddEntityPage />} />
					<Route path="/ceo/sales/new" element={<CEOAddEntityPage />} />
					<Route path="/ceo/branches/new" element={<CEOAddEntityPage />} />

					<Route
						path="/ceo/branches/:branchId/main"
						element={<BranchRoute component={CEOBranchMainPage} />}
					/>
					<Route
						path="/ceo/branches/:branchId/clients"
						element={<BranchRoute component={CEOClientsPage} />}
					/>
					<Route
						path="/ceo/branches/:branchId/sales"
						element={<BranchRoute component={CEOSalesPage} />}
					/>
					<Route
						path="/ceo/branches/:branchId/employees"
						element={<BranchRoute component={CEOEmployeesPage} />}
					/>
					<Route
						path="/ceo/branches/:branchId/inventory"
						element={<BranchRoute component={CEOInventoryPage} />}
					/>

					<Route
						path="/regional-manager/main"
						element={<RegionalManagerLanding />}
					/>
					<Route
						path="/regional-manager/:branchId/main"
						element={
							<BranchRoute component={RegionalManagerMainPage} role="manager" />
						}
					/>
					<Route
						path="/regional-manager/:branchId/employees"
						element={
							<BranchRoute
								component={RegionalManagerEmployeesPage}
								role="manager"
							/>
						}
					/>
					<Route
						path="/regional-manager/:branchId/clients"
						element={
							<BranchRoute
								component={RegionalManagerClientsPage}
								role="manager"
							/>
						}
					/>
					<Route
						path="/regional-manager/:branchId/sales"
						element={
							<BranchRoute
								component={RegionalManagerSalesPage}
								role="manager"
							/>
						}
					/>
					<Route
						path="/regional-manager/:branchId/inventory"
						element={
							<BranchRoute
								component={RegionalManagerInventoryPage}
								role="manager"
							/>
						}
					/>
					<Route
						path="/regional-manager/:branchId/:entity/new"
						element={
							<BranchRoute
								component={RegionalManagerAddEntityPage}
								role="manager"
							/>
						}
					/>
					<Route path="/sales-rep/" element={<SalesRepLanding />} />
					<Route
						path="/sales-rep/:employeeId/sales"
						element={<SalesRepRoute component={SalesRepSalesPage} />}
					/>
					<Route
						path="/sales-rep/:employeeId/sales/new"
						element={<SalesRepRoute component={SalesRepAddSalePage} />}
					/>
				</Routes>
			</Suspense>
		</BrowserRouter>
	);
}

function BranchRoute({ component: PageComponent, role = "ceo" }) {
	const { branchId } = useParams();
	return createElement(PageComponent, { branchId, role });
}

function RegionalManagerLanding() {
	const { data: branches, loading } = useBusinessData("branches");
	if (loading)
		return (
			<div className="p-8 text-sm text-gray-500">
				Loading Scranton branch...
			</div>
		);
	const scranton =
		branches.find((branch) => branch.name?.toLowerCase() === "scranton") ||
		branches[0];
	return scranton ? (
		<Navigate to={`/regional-manager/${scranton._id}/main`} replace />
	) : (
		<div className="p-8 text-sm text-gray-500">No branches found.</div>
	);
}

function SalesRepRoute({ component: PageComponent }) {
	const { employeeId } = useParams();
	return createElement(PageComponent, { employeeId });
}

function SalesRepLanding() {
	const { data: employees, loading } = useBusinessData("employees");
	if (loading)
		return (
			<div className="p-8 text-sm text-gray-500">
				Loading Sales Representitaitve Page...
			</div>
		);
	const defaultSalesRep =
		employees.find(
			(employee) => employee.name?.toLowerCase() === "jim halpert",
		) || employees[0];
	return defaultSalesRep ? (
		<Navigate to={`/sales-rep/${defaultSalesRep._id}/sales`} replace />
	) : (
		<div className="p-8 text-sm text-gray-500">No branches found.</div>
	);
}

export default App;
