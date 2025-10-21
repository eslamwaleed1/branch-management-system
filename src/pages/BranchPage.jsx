import { useParams } from "react-router-dom";
import TopPerformingSalesmen from "../components/TopPerformingSalesmen.jsx";
import TotalsSalesCard from "../components/TotalSalesCard.jsx";
import Sidebar from "../components/Sidebar.jsx";
import StatCards from "../components/StatCards.jsx";
import LatestSalesTable from "../components/LatestSalesTable.jsx";
import SendAnnouncementCard from "../components/SendAnnouncementCard.jsx";
import BranchesData from "../assets/branches.json"

export default function BranchPage() {
	const { branchId } = useParams();
	const branches = BranchesData
	const MenuData = [
		{ to: `/branch/${branchId}`, linkName: branches[branchId-1].title, icon: "0" },
		{ to: `/branch/${branchId}/employees`, linkName: "Employees", icon: "1" },
		{ to: `/branch/${branchId}/sales`, linkName: "Sales", icon: "2" },
		{ to: `/branch/${branchId}/stock`, linkName: "Stock", icon: "3" },
		branches.map((branch) => {
			(branch.id !== branchId) ? { to: `/branch/${branch.id}`, linkName: branch.title, icon: "0" } : ""
		})
	];
	const Salesmen = [
		{ name: "Jim Halpert", revenue: 5000, profit: 30 },
		{ name: "Jim Halpert", revenue: 5000, profit: 30 },
		{ name: "Jim Halpert", revenue: 5000, profit: 30 },
		{ name: "Jim Halpert", revenue: 5000, profit: 30 },
		{ name: "Jim Halpert", revenue: 5000, profit: 30 },
	];

	return (
		<div className="bg-[#F5F7F9] flex max-h-dvh">
			<Sidebar branchId={branchId} />
			<main className="flex flex-col gap-[14px] mx-[14px] pt-[10px] overflow-hidden">
				<article aria-label="Company-wide Sellings">
					<StatCards clients="75" revenue={300000} profit="46" shipments="54" />
				</article>
				<article className="flex justify-between w-full max-h-[15rem]">
					<TotalsSalesCard className="w-[58%]" />
					<LatestSalesTable className="w-[37%]" />
				</article>
				<article className="flex justify-between w-full">
					<TopPerformingSalesmen  data={Salesmen} />
					<SendAnnouncementCard />
				</article>
			</main>
		</div>
	);
}
