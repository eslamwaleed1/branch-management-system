import { BrowserRouter, Routes, Route } from "react-router-dom";
import BranchPage from "./pages/BranchPage.jsx"
import EmployeesPage from "./pages/EmployeesPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import MainPage from "./pages/MainPage.jsx";
import SalesmanPage from "./pages/SalesmanPage.jsx";
import SalesPage from "./pages/SalesPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import StockPage from "./pages/StockPage.jsx";
import UserProfilePage from "./pages/UserProfilePage.jsx";
import WelcomePage from "./pages/WelcomePage.jsx";


function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<WelcomePage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/signup" element={<SignUpPage />} />
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
