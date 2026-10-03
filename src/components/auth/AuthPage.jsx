import { useState } from "react";
import { ArrowRight, GitBranch } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import ThemeToggle from "../ThemeToggle.jsx";
import { authApi } from "../../lib/api.js";

const fieldClass =
	"mt-2 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:border-blue-400 dark:focus:ring-blue-950";

export default function AuthPage({ mode }) {
	const isSignup = mode === "signup";
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [verificationCode, setVerificationCode] = useState("");
	const [verificationPending, setVerificationPending] = useState(false);
	const [notice, setNotice] = useState("");
	const [error, setError] = useState(() =>
		searchParams.get("error") === "google"
			? "Google sign-in could not be completed. Please try again."
			: "",
	);
	const [pending, setPending] = useState(false);

	const handleSubmit = async (event) => {
		event.preventDefault();
		setError("");
		setNotice("");
		if (isSignup && password !== confirmPassword) {
			setError("Those passwords don't match.");
			return;
		}

		setPending(true);
		try {
			const credentials = { email: email.trim().toLowerCase(), password };
			const { csrfToken } = await authApi.csrfToken();
			if (!csrfToken) throw new Error("Missing CSRF token");

			if (isSignup) {
				await authApi.signup(credentials, csrfToken);
				setVerificationPending(true);
				setNotice(`We sent a verification code to ${credentials.email}.`);
				return;
			} else {
				await authApi.login(credentials, csrfToken);
			}
			navigate("/onboarding", { replace: true });
		} catch (requestError) {
			if (requestError.code === "EMAIL_NOT_VERIFIED") {
				setVerificationPending(true);
				setError("Verify your email address before signing in.");
			} else if (requestError.code === "VERIFICATION_EMAIL_FAILED") {
				setVerificationPending(true);
				setError(requestError.message);
			} else {
				setError(
					requestError.message ||
						(isSignup
							? "We couldn't create your account. Check your details and try again."
							: "We couldn't sign you in. Check your email and password and try again."),
				);
			}
		} finally {
			setPending(false);
		}
	};

	const handleVerifyEmail = async (event) => {
		event.preventDefault();
		setError("");
		setNotice("");
		setPending(true);
		try {
			const { csrfToken } = await authApi.csrfToken();
			if (!csrfToken) throw new Error("Missing CSRF token");
			await authApi.verifyEmail(
				email.trim().toLowerCase(),
				verificationCode,
				csrfToken,
			);
			navigate("/onboarding", { replace: true });
		} catch (requestError) {
			setError(requestError.message || "We couldn't verify that code.");
		} finally {
			setPending(false);
		}
	};

	const handleResendCode = async () => {
		setError("");
		setNotice("");
		setPending(true);
		try {
			const { csrfToken } = await authApi.csrfToken();
			if (!csrfToken) throw new Error("Missing CSRF token");
			const result = await authApi.resendVerification(
				email.trim().toLowerCase(),
				csrfToken,
			);
			setNotice(result.message);
		} catch (requestError) {
			setError(requestError.message || "We couldn't send a new code.");
		} finally {
			setPending(false);
		}
	};

	const handleGuestLogin = async () => {
		setError("");
		setPending(true);
		try {
			const { csrfToken } = await authApi.csrfToken();
			if (!csrfToken) throw new Error("Missing CSRF token");
			await authApi.login(
				{ email: "guest@dm.com", password: "thepassword" },
				csrfToken,
			);
			navigate("/onboarding", { replace: true });
		} catch (requestError) {
			setError(requestError.message || "Guest sign-in is unavailable.");
		} finally {
			setPending(false);
		}
	};

	const beginGoogleAuth = () => {
		window.location.assign(authApi.googleUrl(isSignup ? "signup" : "login"));
	};

	return (
		<main className="min-h-dvh bg-slate-100 p-0 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:p-4">
			<div className="mx-auto grid min-h-dvh max-w-[1440px] bg-white dark:bg-slate-900 sm:min-h-[calc(100dvh-2rem)] sm:overflow-hidden sm:rounded-lg sm:border sm:border-slate-200 sm:shadow-xl dark:sm:border-slate-800 lg:grid-cols-[1.05fr_0.95fr]">
				<aside className="auth-atmosphere relative hidden flex-col justify-between overflow-hidden p-10 text-white lg:flex xl:p-14">
					<div className="relative z-10 flex items-center gap-3">
						<span className="flex size-11 items-center justify-center rounded-lg bg-emerald-300 text-emerald-950">
							<GitBranch size={23} strokeWidth={2.2} />
						</span>
						<div>
							<p className="text-sm font-semibold tracking-wide">
								Branch Management
							</p>
							<p className="mt-0.5 text-xs text-emerald-100/70">
								Portfolio workspace
							</p>
						</div>
					</div>
					<div className="relative z-10 max-w-lg pb-8">
						<p className="text-xs font-semibold uppercase text-emerald-200">
							Workspace access
						</p>
						<h1 className="mt-5 text-5xl font-semibold leading-[1.08]">
							A good place
							<br />
							to begin.
						</h1>
						<div className="mt-8 h-px w-20 bg-emerald-300/70" />
					</div>
					<div className="relative z-10 flex items-center justify-between text-xs text-emerald-100/70">
						<span>Branch Management System</span>
						<span>2026</span>
					</div>
					<GitBranch
						aria-hidden="true"
						className="pointer-events-none absolute -bottom-16 -right-16 text-white/[0.07]"
						size={390}
						strokeWidth={0.65}
					/>
				</aside>

				<section className="relative flex min-h-dvh items-center justify-center px-6 py-12 sm:px-10 lg:min-h-0 lg:px-12 xl:px-16">
					<div className="absolute right-5 top-5 sm:right-7 sm:top-7">
						<ThemeToggle />
					</div>
					<div className="w-full max-w-md pt-10 lg:pt-0">
						<div className="mb-9 flex items-center gap-3 lg:hidden">
							<span className="flex size-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
								<GitBranch size={21} />
							</span>
							<div>
								<p className="text-sm font-semibold">Branch Management</p>
								<p className="text-xs text-slate-500 dark:text-slate-400">
									Portfolio workspace
								</p>
							</div>
						</div>

						<p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
							{isSignup ? "Get started" : "Workspace access"}
						</p>
						<h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
							{verificationPending
								? "Verify your email"
								: isSignup
									? "Create your account"
									: "Welcome back"}
						</h2>
						<p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
							{verificationPending
								? `Enter the 6-digit code for ${email}. If you don't have one, request a new code below.`
								: isSignup
									? "Sign up with Google or your email address."
									: "Sign in to continue to your workspace."}
						</p>

						{!verificationPending && (
							<button
								type="button"
								onClick={beginGoogleAuth}
								className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 dark:focus-visible:ring-blue-950"
							>
								<span
									aria-hidden="true"
									className="text-xl font-bold leading-none text-[#4285F4]"
								>
									G
								</span>
								{isSignup ? "Sign up with Google" : "Continue with Google"}
							</button>
						)}

						{!verificationPending && (
							<div className="my-6 flex items-center gap-4">
								<div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
								<span className="text-xs font-medium uppercase text-slate-400">
									or use email
								</span>
								<div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
							</div>
						)}

						{verificationPending ? (
							<form onSubmit={handleVerifyEmail} className="space-y-5">
								<div>
									<label
										htmlFor="verification-code"
										className="text-sm font-medium text-slate-800 dark:text-slate-200"
									>
										Verification code
									</label>
									<input
										id="verification-code"
										className={fieldClass}
										type="text"
										inputMode="numeric"
										autoComplete="one-time-code"
										pattern="[0-9]{6}"
										maxLength={6}
										placeholder="Enter 6-digit code"
										value={verificationCode}
										required
										disabled={pending}
										onChange={(event) =>
											setVerificationCode(event.target.value.replace(/\D/g, ""))
										}
									/>
								</div>
								{error && (
									<p
										role="alert"
										className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
									>
										{error}
									</p>
								)}
								{notice && (
									<p
										role="status"
										className="rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200"
									>
										{notice}
									</p>
								)}
								<button
									type="submit"
									disabled={pending}
									className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-wait disabled:opacity-70 dark:bg-blue-600 dark:hover:bg-blue-500"
								>
									{pending ? "Verifying..." : "Verify email"}
								</button>
								<button
									type="button"
									onClick={handleResendCode}
									disabled={pending}
									className="inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-70 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
								>
									Send a new code
								</button>
							</form>
						) : (
							<form onSubmit={handleSubmit} className="space-y-5">
							<div>
								<label
									htmlFor={`${mode}-email`}
									className="text-sm font-medium text-slate-800 dark:text-slate-200"
								>
									Email address
								</label>
								<input
									id={`${mode}-email`}
									className={fieldClass}
									type="email"
									name="email"
									autoComplete="email"
									placeholder="you@example.com"
									value={email}
									required
									disabled={pending}
									onChange={(event) => setEmail(event.target.value)}
								/>
							</div>
							<div>
								<label
									htmlFor={`${mode}-password`}
									className="text-sm font-medium text-slate-800 dark:text-slate-200"
								>
									Password
								</label>
								<input
									id={`${mode}-password`}
									className={fieldClass}
									type="password"
									name="password"
									autoComplete={isSignup ? "new-password" : "current-password"}
									placeholder={
										isSignup ? "At least 8 characters" : "Enter your password"
									}
									minLength={isSignup ? 8 : undefined}
									maxLength={128}
									value={password}
									required
									disabled={pending}
									onChange={(event) => setPassword(event.target.value)}
								/>
							</div>
							{isSignup && (
								<div>
									<label
										htmlFor="signup-confirm-password"
										className="text-sm font-medium text-slate-800 dark:text-slate-200"
									>
										Confirm password
									</label>
									<input
										id="signup-confirm-password"
										className={fieldClass}
										type="password"
										name="confirm-password"
										autoComplete="new-password"
										placeholder="Enter your password again"
										minLength={8}
										maxLength={128}
										value={confirmPassword}
										required
										disabled={pending}
										onChange={(event) => setConfirmPassword(event.target.value)}
									/>
								</div>
							)}
							{error && (
								<p
									role="alert"
									className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
								>
									{error}
								</p>
							)}
							{notice && (
								<p
									role="status"
									className="rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200"
								>
									{notice}
								</p>
							)}
							<button
								type="submit"
								disabled={pending}
								className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 text-sm font-semibold text-white transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 disabled:cursor-wait disabled:opacity-70 dark:bg-blue-600 dark:hover:bg-blue-500"
							>
								{pending
									? isSignup
										? "Creating account..."
										: "Signing in..."
									: isSignup
										? "Create account"
										: "Sign in"}
								{!pending && <ArrowRight size={17} />}
							</button>
							</form>
						)}

						{!isSignup && !verificationPending && (
							<button
								type="button"
								onClick={handleGuestLogin}
								disabled={pending}
								className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-wait disabled:opacity-70 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
							>
								{pending ? "Signing in as guest..." : "Continue as Guest"}
							</button>
						)}

						<p className="mt-7 text-center text-sm text-slate-500 dark:text-slate-400">
							{isSignup ? "Already have an account?" : "New here?"}{" "}
							<Link
								to={isSignup ? "/login" : "/signup"}
								className="font-semibold text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200"
							>
								{isSignup ? "Sign in" : "Create an account"}
							</Link>
						</p>
					</div>
				</section>
			</div>
		</main>
	);
}
