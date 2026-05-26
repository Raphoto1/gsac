import { CasesValidationError, getHomeCasesService, updateHomeCasesService } from "../service/cases.service";

type ControllerResponse = {
  status: number;
  body: unknown;
};

export async function getHomeCasesController(): Promise<ControllerResponse> {
  try {
    const response = await getHomeCasesService();
    return { status: 200, body: response };
  } catch (error) {
    console.error("getHomeCasesController failed", error);
    return { status: 500, body: { error: "No se pudo obtener la data de Casos." } };
  }
}

export async function updateHomeCasesController(payload: unknown): Promise<ControllerResponse> {
  try {
    const response = await updateHomeCasesService(payload);
    return { status: 200, body: response };
  } catch (error) {
    if (error instanceof CasesValidationError) {
      return { status: 400, body: { error: error.message } };
    }

    console.error("updateHomeCasesController failed", error);
    return { status: 500, body: { error: "No se pudo guardar Casos." } };
  }
}