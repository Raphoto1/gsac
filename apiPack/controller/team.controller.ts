import { TeamValidationError, getHomeTeamService, updateHomeTeamService } from "../service/team.service";

type ControllerResponse = {
  status: number;
  body: unknown;
};

export async function getHomeTeamController(): Promise<ControllerResponse> {
  try {
    const response = await getHomeTeamService();
    return { status: 200, body: response };
  } catch (error) {
    console.error("getHomeTeamController failed", error);
    return { status: 500, body: { error: "No se pudo obtener la data de Equipo." } };
  }
}

export async function updateHomeTeamController(payload: unknown): Promise<ControllerResponse> {
  try {
    const response = await updateHomeTeamService(payload);
    return { status: 200, body: response };
  } catch (error) {
    if (error instanceof TeamValidationError) {
      return { status: 400, body: { error: error.message } };
    }

    console.error("updateHomeTeamController failed", error);
    return { status: 500, body: { error: "No se pudo guardar Equipo." } };
  }
}