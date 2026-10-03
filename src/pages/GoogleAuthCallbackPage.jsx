import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../lib/api.js";

export default function GoogleAuthCallbackPage() {
	const navigate = useNavigate();

	useEffect(() => {
		let active = true;
		authApi
			.session()
			.then(() => {
				if (active) navigate("/onboarding", { replace: true });
			})
			.catch(() => {
				if (active) navigate("/login?error=google", { replace: true });
			});

		return () => {
			active = false;
		};
	}, [navigate]);

	return (
		<main className="flex min-h-dvh items-center justify-center bg-slate-100 text-slate-700 dark:bg-slate-950 dark:text-slate-200">
			<p role="status" className="text-sm font-medium">
				Checking your Google sign-in...
			</p>
		</main>
	);
}
