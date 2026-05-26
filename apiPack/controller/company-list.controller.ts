import {
  CompanyListValidationError,
  getCompanyListService,
  updateCompanyListService,
} from "../service/company-list.service";
import type { CompanyListKind } from "@/types/company-list";

type ControllerResponse = {
  status: number;
  body: unknown;
};

export async function getCompanyListController(kind: CompanyListKind): Promise<ControllerResponse> {
  try {
    const response = await getCompanyListService(kind);
    return { status: 200, body: response };
  } catch (error) {
    console.error("getCompanyListController failed", error);
    return { status: 500, body: { error: "No se pudo obtener la data de CompanyList." } };
  }
}

export async function updateCompanyListController(kind: CompanyListKind, payload: unknown): Promise<ControllerResponse> {
  try {
    const response = await updateCompanyListService(kind, payload);
    return { status: 200, body: response };
  } catch (error) {
    if (error instanceof CompanyListValidationError) {
      return { status: 400, body: { error: error.message } };
    }

    console.error("updateCompanyListController failed", error);
    return { status: 500, body: { error: "No se pudo guardar CompanyList." } };
  }
}