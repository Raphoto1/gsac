import {
  GeneralValidationError,
  getGeneralInfoService,
  updateGeneralInfoService,
} from "../service/general.service";

type ControllerResponse = {
  status: number;
  body: unknown;
};

export async function getGeneralInfoController(): Promise<ControllerResponse> {
  try {
    const response = await getGeneralInfoService();
    return {
      status: 200,
      body: response,
    };
  } catch (error) {
    console.error("getGeneralInfoController failed", error);
    return {
      status: 500,
      body: { error: "No se pudo obtener la data general del sitio." },
    };
  }
}

export async function updateGeneralInfoController(
  payload: unknown
): Promise<ControllerResponse> {
  try {
    const response = await updateGeneralInfoService(payload);
    return {
      status: 200,
      body: response,
    };
  } catch (error) {
    if (error instanceof GeneralValidationError) {
      return {
        status: 400,
        body: { error: error.message },
      };
    }

    console.error("updateGeneralInfoController failed", error);
    return {
      status: 500,
      body: { error: "No se pudo guardar la data general del sitio." },
    };
  }
}
