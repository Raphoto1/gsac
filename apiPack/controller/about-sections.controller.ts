import {
  AboutSectionValidationError,
  getAboutSectionsOrderService,
  updateAboutSectionsOrderService,
} from "../service/about-sections.service";

type ControllerResponse = {
  status: number;
  body: unknown;
};

export async function getAboutSectionsOrderController(): Promise<ControllerResponse> {
  try {
    const sections = await getAboutSectionsOrderService();
    return {
      status: 200,
      body: { sections },
    };
  } catch (error) {
    console.error("getAboutSectionsOrderController failed", error);
    return {
      status: 500,
      body: { error: "No se pudo obtener la data de secciones de About." },
    };
  }
}

export async function updateAboutSectionsOrderController(
  payload: unknown
): Promise<ControllerResponse> {
  try {
    const sections = await updateAboutSectionsOrderService(payload);
    return {
      status: 200,
      body: { sections },
    };
  } catch (error) {
    if (error instanceof AboutSectionValidationError) {
      return {
        status: 400,
        body: { error: error.message },
      };
    }

    console.error("updateAboutSectionsOrderController failed", error);
    return {
      status: 500,
      body: { error: "No se pudo guardar el orden de secciones de About." },
    };
  }
}
