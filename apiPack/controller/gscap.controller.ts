import {
	getHomeSectionsOrderService,
	HomeSectionValidationError,
	updateHomeSectionsOrderService,
} from "../service/gscap.service";

type ControllerResponse = {
	status: number;
	body: unknown;
};

export async function getHomeSectionsOrderController(): Promise<ControllerResponse> {
	try {
		const sections = await getHomeSectionsOrderService();
		return {
			status: 200,
			body: { sections },
		};
	} catch (error) {
		console.error("getHomeSectionsOrderController failed", error);
		return {
			status: 500,
			body: { error: "No se pudo obtener la data de secciones." },
		};
	}
}

export async function updateHomeSectionsOrderController(
	payload: unknown
): Promise<ControllerResponse> {
	try {
		const sections = await updateHomeSectionsOrderService(payload);
		return {
			status: 200,
			body: { sections },
		};
	} catch (error) {
		if (error instanceof HomeSectionValidationError) {
			return {
				status: 400,
				body: { error: error.message },
			};
		}

		console.error("updateHomeSectionsOrderController failed", error);
		return {
			status: 500,
			body: { error: "No se pudo guardar el orden de secciones." },
		};
	}
}
