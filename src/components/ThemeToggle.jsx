import { Moon, Sun } from "lucide-react";
import { useTheme } from "../hooks/useTheme.js";

export default function ThemeToggle({ compact = false }) {
	const { theme, toggleTheme } = useTheme();
	const isDark = theme === "dark";

	return (
		<button
			type="button"
			onClick={toggleTheme}
			aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
			title={isDark ? "Switch to light theme" : "Switch to dark theme"}
			className={`theme-toggle flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 ${compact ? "h-10 w-full gap-2 px-3 text-sm" : "h-11 w-11"}`}
		>
			{isDark ? <Sun size={19} /> : <Moon size={19} />}
			{compact && <span>{isDark ? "Light theme" : "Dark theme"}</span>}
		</button>
	);
}
