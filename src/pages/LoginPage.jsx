import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Users from "../assets/users.json";

export default function LoginPage() {
	const navigate = useNavigate();

	// Track input values & validation errors:
	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");

	const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
	const passwordRegex = /^(?=.{8,64}$)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).*$/;

	function handleSubmit(event) {
		event.preventDefault();

		// Reset error messages before validation
		setEmailError("");
		setPasswordError("");

		const formData = new FormData(event.target);
		const email = formData.get("email").trim();
		const password = formData.get("password");

		// Validate email and password formats
		let hasError = false;

		if (!emailRegex.test(email)) {
			setEmailError("Please enter a valid email address.");
			hasError = true;
		}
		if (!passwordRegex.test(password)) {
			setPasswordError(
				"Password must be 8–64 chars, include upper, lower, digit & special char."
			);
			hasError = true;
		}
		if (hasError) return; // stop before checking credentials

		// Check credentials from JSON
		const emailPasswordMap = new Map(Users.map((u) => [u.email, u.password]));
		const emailAccountTypeMap = new Map(Users.map((u) => [u.email, u.type]));

		if (
			emailPasswordMap.has(email) &&
			emailPasswordMap.get(email) === password
		) {
			emailAccountTypeMap.get(email) === "vp"
				? navigate("/home")
				: navigate("/salesman");
		} else {
			setPasswordError("Invalid email or password.");
		}
	}

	return (
		<main className="flex flex-col items-center mt-[9rem]">
			<h1 className="font-bold text-[3rem] text-blue-700">Dunder Mifflin</h1>
			<h2 className="font-bold text-[2.25rem] text-gray-800">Log In</h2>

			<form
				className="flex flex-col gap-[10px] pt-[3rem] w-[16rem]"
				onSubmit={handleSubmit}
			>
				{/* Email Field */}
				<div className="flex flex-col gap-[4px]">
					<input
						className={`btn-base input-field border ${
							emailError ? "border-red-400 focus:ring-red-300" : "border-blue-300 focus:ring-blue-300"
						}`}
						name="email"
						type="email"
						placeholder="Email"
					/>
					{emailError && (
						<p className="text-red-500 text-sm font-medium">{emailError}</p>
					)}
				</div>

				{/* Password Field */}
				<div className="flex flex-col gap-[4px]">
					<input
						className={`btn-base input-field border ${
							passwordError ? "border-red-400 focus:ring-red-300" : "border-blue-300 focus:ring-blue-300"
						}`}
						name="password"
						type="password"
						placeholder="Password"
					/>
					{passwordError && (
						<p className="text-red-500 text-sm font-medium">{passwordError}</p>
					)}
				</div>

				<input
					className="btn-base input-submit bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 cursor-pointer"
					type="submit"
					value="Submit"
				/>
			</form>
		</main>
	);
}
