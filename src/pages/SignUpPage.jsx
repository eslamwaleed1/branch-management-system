import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Users from "../assets/users.json";

export default function SignUpPage() {
	const navigate = useNavigate();

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [type, setType] = useState("salesman");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	// Load stored users (combine JSON + localStorage)
	const [users, setUsers] = useState(() => {
		const stored = JSON.parse(localStorage.getItem("users"));
		return stored || Users;
	});

	useEffect(() => {
		localStorage.setItem("users", JSON.stringify(users));
	}, [users]);

	// Regex validation
	const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
	const passwordRegex = /^(?=.{8,64}$)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).*$/;

	function handleSubmit(e) {
		e.preventDefault();
		setError("");
		setSuccess("");

		// Basic validation
		if (!name.trim()) return setError("Please enter your name.");
		if (!emailRegex.test(email))
			return setError("Please enter a valid email address.");
		if (!passwordRegex.test(password))
			return setError(
				"Password must be 8–64 chars and include upper, lower, digit & special char."
			);
		if (!["salesman", "vp"].includes(type.toLowerCase()))
			return setError('Type must be either "salesman" or "vp".');

		// Check duplicates
		const exists = users.some((u) => u.email === email);
		if (exists) return setError("This email is already registered.");

		// Add user
		const newUser = { name, email, password, type: type.toLowerCase() };
		setUsers([...users, newUser]);
		setSuccess("Account created successfully! Redirecting...");

		// Clear inputs and navigate after delay
		setTimeout(() => navigate("/login"), 1500);
	}

	return (
		<main className="flex flex-col items-center mt-[6rem]">
			<h1 className="font-bold text-[3rem] text-blue-700">Dunder Mifflin</h1>
			<h2 className="font-bold text-[2rem] text-gray-800">Sign Up</h2>

			<form
				onSubmit={handleSubmit}
				className="flex flex-col items-center gap-[10px] pt-[2rem] w-[18rem]"
			>
				<input
					className="btn-base input-field border border-blue-300 focus:ring-blue-300"
					type="text"
					placeholder="Full Name"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>

				<input
					className="btn-base input-field border border-blue-300 focus:ring-blue-300"
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>

				<input
					className="btn-base input-field border border-blue-300 focus:ring-blue-300"
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>

				<select
					className="btn-base input-field border border-blue-300 focus:ring-blue-300"
					value={type}
					onChange={(e) => setType(e.target.value)}
				>
					<option value="salesman">Salesman</option>
					<option value="vp">VP</option>
				</select>

				<button
					type="submit"
					className="btn-base input-submit bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 cursor-pointer"
				>
					Sign Up
				</button>
			</form>

			{error && <p className="text-red-500 font-medium mt-3">{error}</p>}
			{success && <p className="text-green-600 font-medium mt-3">{success}</p>}
		</main>
	);
}
