import {
  BigCardValidationError,
  getHomeBigCardService,
  updateHomeBigCardService,
} from "../service/bigcard.service";

type ControllerResponse = {
  status: number;
  body: unknown;
};

export async function getHomeBigCardController(): Promise<ControllerResponse> {
  try {
    const response = await getHomeBigCardService();
    return {
      status: 200,
      body: response,
    };
  } catch (error) {
    console.error("getHomeBigCardController failed", error);
    return {
      status: 500,
      body: { error: "No se pudo obtener la data del BigCard." },
    };
  }
}

export async function updateHomeBigCardController(payload: unknown): Promise<ControllerResponse> {
  try {
    const response = await updateHomeBigCardService(payload);
    return {
      status: 200,
      body: response,
    };
  } catch (error) {
    if (error instanceof BigCardValidationError) {
      return {
        status: 400,
        body: { error: error.message },
      };
    }

    console.error("updateHomeBigCardController failed", error);
    return {
      status: 500,
      body: { error: "No se pudo guardar el BigCard." },
    };
  }
}