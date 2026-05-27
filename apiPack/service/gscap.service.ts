import {
	HOME_SECTION_KEYS,
	getHomeSectionOrderFromDb,
	replaceHomeSectionOrderInDb,
	type HomeSectionKey,
	type HomeSectionOrderRecord,
} from "../dao/gscap.dao";
import {
	DEFAULT_HOME_SECTION_ORDER,
	HOME_SECTION_IDS,
	HOME_SECTION_LABELS,
	type SectionId,
	type SectionItem,
} from "@/types/home-sections";

type SectionPayloadItem = {
	id: SectionId;
	visible: boolean;
	position: number;
};

const SECTION_META_BY_KEY: Record<
	HomeSectionKey,
	Omit<SectionItem, "position" | "visible">
> = {
	HERO: { id: "hero", label: HOME_SECTION_LABELS.hero, fixed: true },
	BIGCARD: { id: "bigcard", label: HOME_SECTION_LABELS.bigcard, fixed: false },
	CASES: { id: "cases", label: HOME_SECTION_LABELS.cases, fixed: false },
	TEAM: { id: "team", label: HOME_SECTION_LABELS.team, fixed: false },
	HOLDINGS: { id: "holdings", label: HOME_SECTION_LABELS.holdings, fixed: false },
	CLIENTS: { id: "clients", label: HOME_SECTION_LABELS.clients, fixed: false },
	CONTACT: { id: "contact", label: HOME_SECTION_LABELS.contact, fixed: true },
};

const SECTION_KEY_BY_ID: Record<SectionId, HomeSectionKey> = {
	hero: HOME_SECTION_KEYS.HERO,
	bigcard: HOME_SECTION_KEYS.BIGCARD,
	cases: HOME_SECTION_KEYS.CASES,
	team: HOME_SECTION_KEYS.TEAM,
	holdings: HOME_SECTION_KEYS.HOLDINGS,
	clients: HOME_SECTION_KEYS.CLIENTS,
	contact: HOME_SECTION_KEYS.CONTACT,
};

const ALL_SECTION_IDS: SectionId[] = [...HOME_SECTION_IDS];

export class HomeSectionValidationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "HomeSectionValidationError";
	}
}

function isSectionId(value: unknown): value is SectionId {
	return typeof value === "string" && ALL_SECTION_IDS.includes(value as SectionId);
}

function mapDbRowsToSectionItems(rows: HomeSectionOrderRecord[]): SectionItem[] {
	return rows.map((row) => {
		const meta = SECTION_META_BY_KEY[row.section];
		return {
			id: meta.id,
			label: meta.label,
			fixed: meta.fixed,
			visible: row.visible,
			position: row.position,
		};
	});
}

function normalizeSectionsPayload(payload: unknown): SectionPayloadItem[] {
	if (!payload || typeof payload !== "object" || !("sections" in payload)) {
		throw new HomeSectionValidationError("Payload inválido.");
	}

	const maybeSections = (payload as { sections?: unknown }).sections;
	if (!Array.isArray(maybeSections)) {
		throw new HomeSectionValidationError("El campo sections debe ser un arreglo.");
	}

	const parsed = maybeSections.map((item) => {
		if (!item || typeof item !== "object") {
			throw new HomeSectionValidationError("Cada sección debe ser un objeto válido.");
		}

		const sectionId = (item as { id?: unknown }).id;
		const position = (item as { position?: unknown }).position;
		const visible = (item as { visible?: unknown }).visible;

		if (!isSectionId(sectionId)) {
			throw new HomeSectionValidationError("Hay una sección inválida en el payload.");
		}

		if (typeof position !== "number" || !Number.isInteger(position)) {
			throw new HomeSectionValidationError("Todas las posiciones deben ser enteros.");
		}

		if (typeof visible !== "boolean") {
			throw new HomeSectionValidationError("Todas las secciones deben indicar si están visibles.");
		}

		return {
			id: sectionId,
			visible,
			position,
		};
	});

	if (parsed.length !== ALL_SECTION_IDS.length) {
		throw new HomeSectionValidationError("Se deben enviar exactamente 7 secciones.");
	}

	const uniqueIds = new Set(parsed.map((item) => item.id));
	if (uniqueIds.size !== ALL_SECTION_IDS.length) {
		throw new HomeSectionValidationError("No se permiten secciones duplicadas.");
	}

	const uniquePositions = new Set(parsed.map((item) => item.position));
	if (uniquePositions.size !== ALL_SECTION_IDS.length) {
		throw new HomeSectionValidationError("No se permiten posiciones duplicadas.");
	}

	const sortedByPosition = [...parsed].sort((a, b) => a.position - b.position);
	const expectedPositions = ALL_SECTION_IDS.map((_, index) => index + 1);

	for (let i = 0; i < expectedPositions.length; i += 1) {
		if (sortedByPosition[i].position !== expectedPositions[i]) {
			throw new HomeSectionValidationError("Las posiciones deben ser consecutivas de 1 a 7.");
		}
	}

	if (sortedByPosition[0].id !== "hero") {
		throw new HomeSectionValidationError("Hero debe permanecer en la primera posición.");
	}

	if (!sortedByPosition[0].visible) {
		throw new HomeSectionValidationError("Hero no se puede ocultar.");
	}

	if (sortedByPosition[sortedByPosition.length - 1].id !== "contact") {
		throw new HomeSectionValidationError("Contacto debe permanecer en la última posición.");
	}

	if (!sortedByPosition[sortedByPosition.length - 1].visible) {
		throw new HomeSectionValidationError("Contacto no se puede ocultar.");
	}

	return sortedByPosition;
}

export async function getHomeSectionsOrderService(): Promise<SectionItem[]> {
	const rows = await getHomeSectionOrderFromDb();
	if (!rows.length) {
		return DEFAULT_HOME_SECTION_ORDER;
	}

	return mapDbRowsToSectionItems(rows);
}

export async function updateHomeSectionsOrderService(payload: unknown): Promise<SectionItem[]> {
	const normalized = normalizeSectionsPayload(payload);

	const dbPayload = normalized.map((item) => ({
		section: SECTION_KEY_BY_ID[item.id],
		visible: item.visible,
		position: item.position,
	}));

	const rows = await replaceHomeSectionOrderInDb(dbPayload);
	return mapDbRowsToSectionItems(rows);
}
