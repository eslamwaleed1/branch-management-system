import { useState, useEffect, useRef, Fragment } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import BranchesData from "../assets/branches.json";
import {
	HomeIcon,
	UserIcon,
	WarehouseIcon,
	DollarSignIcon,
	SplitIcon,
	ArrowLeftIcon,
	UserStarIcon,
	SettingsIcon,
	ChevronDownIcon,
} from "lucide-react";

export default function Sidebar(props) {
	const branches = BranchesData;

	const [openedBranch, setOpenedBranch] = useState(null); //
	const [floatingPos, setFloatingPos] = useState({ top: 0, left: 0 });
	const menuRef = useRef(null);

	// Compute floating menu position based on arrow button rect.
	function openFloatingMenuForBranch(branchId, buttonRect) {
		const MENU_WIDTH_PX = 240;
		const maxLeft = Math.max(8, window.innerWidth - MENU_WIDTH_PX - 8);
		let left = Math.min(
			Math.max(8, Math.round(buttonRect.right - MENU_WIDTH_PX)),
			maxLeft
		);
		// Place just under the button.
		const top = Math.round(buttonRect.bottom + 6);
		setFloatingPos({ top, left });
		setOpenedBranch(branchId);
	}

	// Outside menu click handler: close floating menu when clicking outside menu or its toggle button.
	useEffect(() => {
		function handleDocMouseDown(e) {
			if (!openedBranch) return;
			const target = e.target;
			const menuEl = menuRef.current;
			const toggleSel = `[data-toggle-id="${openedBranch}"]`;
			if (menuEl && menuEl.contains(target)) return;
			if (target.closest(toggleSel)) return;
			setOpenedBranch(null);
		}
		document.addEventListener("mousedown", handleDocMouseDown);
		return () => document.removeEventListener("mousedown", handleDocMouseDown);
	}, [openedBranch]);

	return (
		<>
			<aside className="bg-white h-dvh mr-[20px] flex flex-col items-center ">
				<GoBackButton
					className="flex items-center gap-3 px-3 py-4
                            transition-all duration-200 hover:bg-gray-100 rounded-3xl"
				>
					<div className="w-6">
						<ArrowLeftIcon size="20" />
					</div>
				</GoBackButton>
				<div className=" flex justify-center items-center gap-4 w-full px-[10px] pr-[20px] mb-[15px]">
					<img src="https://placehold.co/50" className="rounded-3xl" />
					<div>
						<p>David Wallace</p>
						<p className="text-sm text-gray-400 text-center">CEO</p>
					</div>
				</div>
				<nav className="flex flex-col justify-between w-60 gap-[20px] h-full py-[5px]">
					<ul className="w-full">
						<li className="nav-link-text-color">
							<NavLink
								to="/main"
								className={({ isActive }) =>
									`nav-link ${isActive ? "bg-main" : "hover-bg"}`
								}
							>
								<div className="icon-wrap">
									<HomeIcon size="20" />
								</div>
								<span className="label-sm-medium">Main</span>
							</NavLink>
						</li>

						{branches.map((branch) => {
							// Active means one of the branch links is clicked right now.
							// Opened means one of the children links [employees, sales, stock] inside a branch link is clicked.
							const isBranchActive = Number(props.branchId) === branch.id;
							const isBranchOpened = openedBranch === branch.id;

							return (
								<Fragment key={branch.id}>
									<li className="nav-link-text-color">
										<div className="flex items-center justify-between">
											<NavLink
												to={`/branch/${branch.id}`}
												end
												onClick={() => {
													// When navigating to a branch, close the floating menu.
													// This is the same behaviour as clicking on a blank space to close the menu.
													setOpenedBranch(null);
												}}
												className={({ isActive }) =>
													`nav-link ${isActive ? "bg-main" : "hover-bg"}`
												}
											>
												<div className="icon-wrap">
													<SplitIcon size="20" />
												</div>
												<span className="label-sm-medium">{branch.title}</span>
											</NavLink>

											{/* dropdown toggle - hide arrow when branch is active */}
											{!isBranchActive && (
												<button
													type="button"
													data-toggle-id={branch.id}
													aria-expanded={isBranchOpened}
													onClick={(e) => {
														const rect = e.currentTarget.getBoundingClientRect();
														if (openedBranch === branch.id) {
															setOpenedBranch(null);
														} else {
															openFloatingMenuForBranch(branch.id, rect);
														}
													}}
													className="p-2 mr-2 rounded-full hover:bg-gray-100 transition-colors"
												>
													<ChevronDownIcon
														size="16"
														className={`transition-transform duration-200 ${
															isBranchOpened ? "rotate-180" : "rotate-0"
														}`}
													/>
												</button>
											)}
										</div>

										{/* inline sublinks only for active branch (old behavior) */}
										{isBranchActive && <BranchSubLinks branchId={branch.id} />}
									</li>
								</Fragment>
							);
						})}
					</ul>

					<div className="w-full">
						<div className="nav-link-text-color">
							<NavLink
								to="/profile"
								className={({ isActive }) =>
									`nav-link ${isActive ? "bg-main" : "hover-bg"}`
								}
							>
								<div className="icon-wrap">
									<UserStarIcon size="20" />
								</div>
								<span className="label-sm-medium">My Profile</span>
							</NavLink>
						</div>
						<div className="nav-link-text-color">
							<NavLink
								to="/settings"
								className={({ isActive }) =>
									`nav-link ${isActive ? "bg-main" : "hover-bg"}`
								}
							>
								<div className="icon-wrap">
									<SettingsIcon size="20" />
								</div>
								<span className="label-sm-medium">Settings</span>
							</NavLink>
						</div>
					</div>
				</nav>
			</aside>

			{/* Floating dropdown (only for non-active branches) */}
			{branches.map((branch) => {
				const isOpened = openedBranch === branch.id;

				return (
					<div
						key={`floating-${branch.id}`}
						ref={isOpened ? menuRef : null}
						style={{
							left: floatingPos.left,
							top: floatingPos.top,
						}}
						className={`fixed w-[240px] z-40
							pointer-events-auto transition-all duration-150 transform origin-top-left ${
							isOpened
								? "opacity-100 translate-y-0"
								: "opacity-0 -translate-y-2 pointer-events-none"
						}`}
						aria-hidden={!isOpened}
					>
						{/* render content always to avoid mount/layout jitter; visibility handled via classes */}
						<div className="w-full bg-white rounded-md shadow-lg border border-gray-100 overflow-hidden">
							<div className={`py-1 ${isOpened ? "block" : "hidden"}`}>
								<ul className="px-2">
									<li>
										<NavLink
											to={`/branch/${branch.id}/employees`}
											className={({ isActive }) =>
												`drop-menu-nav-link ${
													isActive ? "bg-main" : "hover-bg"
												}`
											}
											onClick={() => setOpenedBranch(null)}
										>
											<div className="icon-wrap">
												<UserIcon size="16" />
											</div>
											<span className="text-sm">Employees</span>
										</NavLink>
									</li>
									<li>
										<NavLink
											to={`/branch/${branch.id}/stock`}
											className={({ isActive }) =>
												`drop-menu-nav-link ${
													isActive ? "bg-main" : "hover-bg"
												}`
											}
											onClick={() => setOpenedBranch(null)}
										>
											<div className="icon-wrap">
												<WarehouseIcon size="16" />
											</div>
											<span className="text-sm">Stock</span>
										</NavLink>
									</li>
									<li>
										<NavLink
											to={`/branch/${branch.id}/sales`}
											className={({ isActive }) =>
												`drop-menu-nav-link ${
													isActive ? "bg-main" : "hover-bg"
												}`
											}
											onClick={() => setOpenedBranch(null)}
										>
											<div className="icon-wrap">
												<DollarSignIcon size="16" />
											</div>
											<span className="text-sm">Sales</span>
										</NavLink>
									</li>
								</ul>
							</div>
						</div>
					</div>
				);
			})}
		</>
	);
}

function GoBackButton(props) {
	const navigate = useNavigate();
	const location = useLocation();

	const handleGoBack = () => {
		const path = location.pathname;
		let parent = path.split("/").slice(0, -1).join("/") || "/";
		parent = parent === "/branch" ? "/home" : parent;

		navigate(parent);
	};

	return (
		<button className={props.className} onClick={handleGoBack}>
			{props.children}
		</button>
	);
}

function BranchSubLinks({ branchId }) {
	return (
		<div
			className={`overflow-hidden transition-[max-height,opacity,transform] duration-200 ease-in-out
                    ${
											Number(branchId) === branchId
												? "max-h-[12rem] opacity-100 translate-y-0"
												: "max-h-0 opacity-0 -translate-y-1"
										}`}
		>
			<ul className="pl-6">
				<li className="text-gray-700">
					<NavLink
						to={`/branch/${branchId}/employees`}
						className={({ isActive }) =>
							`nav-link ${isActive ? "bg-main" : "hover-bg"}`
						}
					>
						<div className="icon-wrap">
							<UserIcon size="18" />
						</div>
						<span className="label-sm-medium">Employees</span>
					</NavLink>
				</li>
				<li className="text-gray-700">
					<NavLink
						to={`/branch/${branchId}/stock`}
						className={({ isActive }) =>
							`nav-link ${isActive ? "bg-main" : "hover-bg"}`
						}
					>
						<div className="icon-wrap">
							<WarehouseIcon size="18" />
						</div>
						<span className="label-sm-medium">Stock</span>
					</NavLink>
				</li>
				<li className="text-gray-700">
					<NavLink
						to={`/branch/${branchId}/sales`}
						className={({ isActive }) =>
							`nav-link ${isActive ? "bg-main" : "hover-bg"}`
						}
					>
						<div className="icon-wrap">
							<DollarSignIcon size="18" />
						</div>
						<span className="label-sm-medium">Sales</span>
					</NavLink>
				</li>
			</ul>
		</div>
	);
}

/*
import { HomeIcon, UserIcon, WarehouseIcon, DollarSignIcon, SplitIcon, ArrowLeftIcon } from "lucide-react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

export default function Sidebar({ data }) {
    const icons = [
        <SplitIcon size="20" />,
        <UserIcon size="20" />,
        <WarehouseIcon size="20" />,
        <DollarSignIcon size="20" />,
    ]

    return (
        <aside className="fixed left-0 top-1/2 -translate-y-1/2 group z-50">
            <nav
                className="flex flex-col items-center bg-[#CED4DA] shadow-lg rounded-tr-[24px] rounded-br-[24px]
                transition-all duration-300 ease-in-out
                group-hover:w-44 w-10 overflow-hidden"
            >
                <ul className="w-full">
                    <li
                        className=" text-gray-700 flex group-hover:justify-center"
                    >
                        <GoBackButton
                            className="flex items-center gap-3 px-3 py-4
                            transition-all duration-200 hover:bg-gray-100 rounded-3xl"
                        >
                            <div className="flex justify-center items-center w-6">
                                <ArrowLeftIcon size="20" />
                            </div>
                        </GoBackButton>
                    </li>
                    <li
                        className="
                        hover:bg-gray-100 transition-colors
                        text-gray-700"
                    >
                        <NavLink
                            to="/home"
                            className="
                            flex items-center gap-3 px-3 py-4
                            transition-all duration-200"
                        >
                            <div className="flex justify-center items-center w-6">
                                <HomeIcon size="20" />
                            </div>
                            <span
                                className="
                                opacity-0 group-hover:opacity-100 transition-opacity duration-200
                                text-sm font-medium whitespace-nowrap"
                            >
                                Home
                            </span>
                        </NavLink>
                    </li>
                    {data.map((link, index) => (
                        <li
                            key={index}
                            className="
                            hover:bg-gray-100 transition-colors
                            text-gray-700"
                        >
                            <NavLink
                                to={link.to}
                                className="
                                flex items-center gap-3 px-3 py-4
                                transition-all duration-200"
                            >
                                <div className="flex justify-center items-center w-6">
                                    {icons[link.icon]}
                                </div>
                                <span
                                    className="
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-200
                                    text-sm font-medium whitespace-nowrap"
                                >
                                    {link.linkName}
                                </span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}

function GoBackButton(props) {
    const navigate = useNavigate();
    const location = useLocation();

    const handleGoBack = () => {
        const path = location.pathname;
        let parent = path.split("/").slice(0, -1).join("/") || "/";
        parent = parent === "/branch" ? "/" : parent;

        navigate(parent);
    };

    return (
        <button className={props.className} onClick={handleGoBack}>
            {props.children}
        </button>
    );
}

*/
