import { BrowserRouter, Routes, Route } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import MainPage from "./pages/MainPage";
import SalesmanPage from "./pages/SalesmanPage";
import StockPage from "./pages/StockPage";
import SalesPage from "./pages/SalesPage";
import EmployeesPage from "./pages/EmployeesPage";
import BranchPage from "./pages/BranchPage"
import UserProfilePage from "./pages/UserProfilePage";
import SettingsPage from "./pages/SettingsPage";


function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<WelcomePage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/signup" element={<SignupPage />} />
				<Route path="/main" element={<MainPage />} />
				<Route path="/salesman" element={<SalesmanPage />} />
				<Route path="branch/:branchId" element={<BranchPage />}/>
				<Route path="branch/:branchId/employees" element={<EmployeesPage />} />
				<Route path="branch/:branchId/sales" element={<SalesPage />} />
				<Route path="branch/:branchId/stock" element={<StockPage />} />
				<Route path="/profile" element={<UserProfilePage />} />
				<Route path="/settings" element={<SettingsPage />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App;
