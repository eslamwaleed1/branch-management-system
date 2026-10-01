import CEOSidebar from "./sidebar/CEOSidebar.jsx";
import RegionalManagerSidebar from "./sidebar/RegionalManagerSidebar.jsx";
import SalesRepSidebar from "./sidebar/SalesRepSidebar.jsx";

export default function Sidebar({ role = "ceo", branchId }) {
	if (role === "manager") return <RegionalManagerSidebar branchId={branchId} />;
	if (role === "sales-rep") return <SalesRepSidebar />;
	return <CEOSidebar branchId={branchId} />;
}
