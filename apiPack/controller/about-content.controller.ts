import type { AboutCardSectionId } from "@/types/about-content";
import {
  AboutContentValidationError,
  getAboutCardSectionService,
  getAboutCountriesService,
  getAboutValuesService,
  updateAboutCardSectionService,
  updateAboutCountriesService,
  updateAboutValuesService,
} from "../service/about-content.service";

type ControllerResponse = {
  status: number;
  body: unknown;
};

export async function getAboutCardSectionController(sectionId: AboutCardSectionId): Promise<ControllerResponse> {
  try {
    const data = await getAboutCardSectionService(sectionId);
    return {
      status: 200,
      body: data,
    };
  } catch (error) {
    console.error("getAboutCardSectionController failed", error);
    return {
      status: 500,
      body: { error: "No se pudo obtener la data de la seccion." },
    };
  }
}

export async function updateAboutCardSectionController(sectionId: AboutCardSectionId, payload: unknown): Promise<ControllerResponse> {
  try {
    const data = await updateAboutCardSectionService(sectionId, payload);
    return {
      status: 200,
      body: data,
    };
  } catch (error) {
    if (error instanceof AboutContentValidationError) {
      return {
        status: 400,
        body: { error: error.message },
      };
    }

    console.error("updateAboutCardSectionController failed", error);
    return {
      status: 500,
      body: { error: "No se pudo guardar la seccion." },
    };
  }
}

export async function getAboutValuesController(): Promise<ControllerResponse> {
  try {
    const data = await getAboutValuesService();
    return {
      status: 200,
      body: data,
    };
  } catch (error) {
    console.error("getAboutValuesController failed", error);
    return {
      status: 500,
      body: { error: "No se pudo obtener la lista de valores." },
    };
  }
}

export async function updateAboutValuesController(payload: unknown): Promise<ControllerResponse> {
  try {
    const data = await updateAboutValuesService(payload);
    return {
      status: 200,
      body: data,
    };
  } catch (error) {
    if (error instanceof AboutContentValidationError) {
      return {
        status: 400,
        body: { error: error.message },
      };
    }

    console.error("updateAboutValuesController failed", error);
    return {
      status: 500,
      body: { error: "No se pudo guardar la lista de valores." },
    };
  }
}

export async function getAboutCountriesController(): Promise<ControllerResponse> {
  try {
    const data = await getAboutCountriesService();
    return {
      status: 200,
      body: data,
    };
  } catch (error) {
    console.error("getAboutCountriesController failed", error);
    return {
      status: 500,
      body: { error: "No se pudo obtener la lista de paises." },
    };
  }
}

export async function updateAboutCountriesController(payload: unknown): Promise<ControllerResponse> {
  try {
    const data = await updateAboutCountriesService(payload);
    return {
      status: 200,
      body: data,
    };
  } catch (error) {
    if (error instanceof AboutContentValidationError) {
      return {
        status: 400,
        body: { error: error.message },
      };
    }

    console.error("updateAboutCountriesController failed", error);
    return {
      status: 500,
      body: { error: "No se pudo guardar la lista de paises." },
    };
  }
}
