import { BranchCard } from "../components/BranchCard.jsx";
import TotalsSalesCard from "../components/TotalSalesCard.jsx";
import Sidebar from "../components/Sidebar.jsx";
import StatCards from "../components/StatCards.jsx";
import LatestSalesTable from "../components/LatestSalesTable.jsx";
import BranchesData from "../assets/branches.json";

export default function MainPage() {
	const branches = BranchesData;

	return (
		<div className="bg-[#F5F7F9] flex max-h-dvh">
			<Sidebar />
			<main className="flex flex-col gap-[14px] mx-[14px] pt-[10px] overflow-hidden">
				<article aria-label="Company-wide Sellings">
					<StatCards clients="75" revenue={300000} profit="46" shipments="54" />
				</article>
				<article className="flex justify-between w-full max-h-[15rem]">
					<TotalsSalesCard className="w-[58%]" />
					<LatestSalesTable className="w-[37%]" />
				</article>
				<article aria-label="Top Performing Branches">
					<div className="flex justify-evenly flex-wrap gap-[10px]">
						{branches.map((branch) => {
							return <BranchCard info={branch} />
						})}
					</div>
				</article>
			</main>
		</div>
	);
}