import { HeroValidationError, getHomeHeroService, updateHomeHeroService } from "../service/hero.service";

type ControllerResponse = {
  status: number;
  body: unknown;
};

export async function getHomeHeroController(): Promise<ControllerResponse> {
  try {
    const response = await getHomeHeroService();
    return {
      status: 200,
      body: response,
    };
  } catch (error) {
    console.error("getHomeHeroController failed", error);
    return {
      status: 500,
      body: { error: "No se pudo obtener la data del Hero." },
    };
  }
}

export async function updateHomeHeroController(payload: unknown): Promise<ControllerResponse> {
  try {
    const response = await updateHomeHeroService(payload);
    return {
      status: 200,
      body: response,
    };
  } catch (error) {
    if (error instanceof HeroValidationError) {
      return {
        status: 400,
        body: { error: error.message },
      };
    }

    console.error("updateHomeHeroController failed", error);
    return {
      status: 500,
      body: { error: "No se pudo guardar el Hero." },
    };
  }
}