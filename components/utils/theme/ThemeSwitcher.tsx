"use client";

import { useEffect, useState } from "react";
import { BsMoonStarsFill, BsSunFill } from "react-icons/bs";

type ThemeMode = "light" | "dark";

export default function ThemeSwitcher() {
	const [theme, setTheme] = useState<ThemeMode>("light");

	const applyTheme = (nextTheme: ThemeMode) => {
		document.documentElement.setAttribute("data-theme", nextTheme);
		localStorage.setItem("theme", nextTheme);
		setTheme(nextTheme);
	};

	useEffect(() => {
		const storedTheme = localStorage.getItem("theme");
		const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
			? "dark"
			: "light";
		const initialTheme =
			storedTheme === "dark" || storedTheme === "light" ? storedTheme : preferredTheme;

		applyTheme(initialTheme);
	}, []);

	const handleToggleTheme = () => {
		applyTheme(theme === "dark" ? "light" : "dark");
	};

	return (
		<button
			type="button"
			className="btn btn-ghost btn-circle"
			aria-label="Toggle dark mode"
			title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
			onClick={handleToggleTheme}
		>
			{theme === "dark" ? <BsSunFill className="h-5 w-5" /> : <BsMoonStarsFill className="h-5 w-5" />}
		</button>
	);
}
