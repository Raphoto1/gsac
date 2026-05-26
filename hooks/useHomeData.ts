"use client";

import { useEffect, useState } from "react";
import {
	DEFAULT_HOME_SECTION_ORDER,
	HOME_SECTION_IDS,
	type SectionId,
	type SectionItem,
} from "@/types/home-sections";

const VALID_IDS = new Set<SectionId>(HOME_SECTION_IDS);

function isSectionId(value: unknown): value is SectionId {
	return typeof value === "string" && VALID_IDS.has(value as SectionId);
}

function parseApiSections(payload: unknown): SectionItem[] | null {
	if (!payload || typeof payload !== "object" || !("sections" in payload)) {
		return null;
	}

	const rawSections = (payload as { sections?: unknown }).sections;
	if (!Array.isArray(rawSections)) {
		return null;
	}

	const parsed = rawSections
		.map((item) => {
			if (!item || typeof item !== "object") {
				return null;
			}

			const maybeId = (item as { id?: unknown }).id;
			const maybeLabel = (item as { label?: unknown }).label;
			const maybeFixed = (item as { fixed?: unknown }).fixed;
			const maybePosition = (item as { position?: unknown }).position;
			const maybeVisible = (item as { visible?: unknown }).visible;

			if (!isSectionId(maybeId)) {
				return null;
			}

			if (typeof maybeLabel !== "string") {
				return null;
			}

			if (typeof maybeFixed !== "boolean") {
				return null;
			}

			if (!Number.isInteger(maybePosition)) {
				return null;
			}

			if (typeof maybeVisible !== "boolean") {
				return null;
			}

			return {
				id: maybeId,
				label: maybeLabel,
				fixed: maybeFixed,
				visible: maybeVisible,
				position: maybePosition,
			};
		})
		.filter((item): item is SectionItem => item !== null)
		.sort((a, b) => a.position - b.position);

	if (parsed.length !== DEFAULT_HOME_SECTION_ORDER.length) {
		return null;
	}

	return parsed;
}

async function readApiResponse<T>(response: Response): Promise<T | null> {
	const contentType = response.headers.get("content-type") || "";
	if (!contentType.includes("application/json")) {
		return null;
	}

	return (await response.json()) as T;
}

export function useHomeData() {
	const [sections, setSections] = useState<SectionItem[]>(DEFAULT_HOME_SECTION_ORDER);
	const [loadingSections, setLoadingSections] = useState(true);
	const [sectionsError, setSectionsError] = useState<string | null>(null);

	useEffect(() => {
		let mounted = true;

		async function loadSections() {
			try {
				setLoadingSections(true);
				setSectionsError(null);

				const response = await fetch("/api/page", {
					method: "GET",
					headers: { "Content-Type": "application/json" },
					cache: "no-store",
				});

				if (!response.ok) {
					throw new Error("No se pudo cargar el orden de secciones.");
				}

				const data = await readApiResponse<{ sections?: unknown }>(response);
				if (!data) {
					throw new Error("El servidor devolvió una respuesta no válida.");
				}

				const parsedSections = parseApiSections(data);

				if (mounted && parsedSections) {
					setSections(parsedSections);
				}
			} catch (error) {
				if (mounted) {
					const message =
						error instanceof Error
							? error.message
							: "No se pudo cargar el orden de secciones.";
					setSectionsError(message);
				}
			} finally {
				if (mounted) {
					setLoadingSections(false);
				}
			}
		}

		loadSections();

		return () => {
			mounted = false;
		};
	}, []);

	return {
		sections,
		loadingSections,
		sectionsError,
	};
}
