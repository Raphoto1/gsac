import {
  ProductsValidationError,
  getHomeProductsService,
  updateHomeProductsService,
} from "../service/products.service";

type ControllerResponse = {
  status: number;
  body: unknown;
};

export async function getHomeProductsController(): Promise<ControllerResponse> {
  try {
    const response = await getHomeProductsService();
    return { status: 200, body: response };
  } catch (error) {
    console.error("getHomeProductsController failed", error);
    return { status: 500, body: { error: "No se pudo obtener la data de Productos." } };
  }
}

export async function updateHomeProductsController(payload: unknown): Promise<ControllerResponse> {
  try {
    const response = await updateHomeProductsService(payload);
    return { status: 200, body: response };
  } catch (error) {
    if (error instanceof ProductsValidationError) {
      return { status: 400, body: { error: error.message } };
    }

    console.error("updateHomeProductsController failed", error);
    return { status: 500, body: { error: "No se pudo guardar Productos." } };
  }
}
