import { useEffect, useState } from "react";
import { ThemeContext } from "../hooks/theme-context.js";

const STORAGE_KEY = "branch-management-theme";

function getInitialTheme() {
	if (typeof window === "undefined") return "light";
	const savedTheme = window.localStorage.getItem(STORAGE_KEY);
	if (savedTheme === "dark" || savedTheme === "light") return savedTheme;
	return window.matchMedia?.("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

export default function ThemeProvider({ children }) {
	const [theme, setTheme] = useState(getInitialTheme);

	useEffect(() => {
		document.documentElement.classList.toggle("dark", theme === "dark");
		document.documentElement.style.colorScheme = theme;
		window.localStorage.setItem(STORAGE_KEY, theme);
	}, [theme]);

	const toggleTheme = () => {
		setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
	};

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}
