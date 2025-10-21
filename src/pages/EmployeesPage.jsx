import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";


export default function EmployeesPage() {
    const { branchId } = useParams()

    return (
        <div className="bg-[#F5F7F9] flex max-h-dvh">
            <Sidebar branchId={branchId} />
        </div>
    )
}




