import { DEFAULT_HOME_TEAM, type HomeTeamMember, type HomeTeamResponse } from "@/types/home-team";
import { getHomeTeamFromDb, upsertHomeTeamInDb, type HomeTeamRecord } from "../dao/team.dao";

type TeamPayload = {
  members?: unknown;
};

export class TeamValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TeamValidationError";
  }
}

function parseTeamMembers(payloadMembers: unknown): HomeTeamMember[] {
  if (!Array.isArray(payloadMembers)) {
    throw new TeamValidationError("El campo members debe ser un arreglo.");
  }

  const parsed = payloadMembers.map((item, index) => {
    if (!item || typeof item !== "object") {
      throw new TeamValidationError(`El miembro ${index + 1} debe ser un objeto válido.`);
    }

    const name = (item as { name?: unknown }).name;
    const role = (item as { role?: unknown }).role;
    const photoValue = (item as { photo?: unknown }).photo;
    const linkedinValue = (item as { linkedin?: unknown }).linkedin;

    if (typeof name !== "string" || !name.trim()) {
      throw new TeamValidationError("Cada miembro debe tener un nombre válido.");
    }

    if (typeof role !== "string" || !role.trim()) {
      throw new TeamValidationError("Cada miembro debe tener un rol válido.");
    }

    if (typeof photoValue !== "string" || !photoValue.trim()) {
      throw new TeamValidationError("Cada miembro debe tener una foto válida.");
    }

    return {
      name: name.trim(),
      role: role.trim(),
      photo: photoValue.trim(),
      linkedin: typeof linkedinValue === "string" && linkedinValue.trim() ? linkedinValue.trim() : undefined,
    };
  });

  if (parsed.length !== DEFAULT_HOME_TEAM.length) {
    throw new TeamValidationError(`Se deben guardar exactamente ${DEFAULT_HOME_TEAM.length} miembros.`);
  }

  return parsed;
}

function mapRecordToTeam(record: HomeTeamRecord | null): HomeTeamMember[] {
  if (!record || !Array.isArray(record.members)) {
    return DEFAULT_HOME_TEAM;
  }

  return record.members as HomeTeamMember[];
}

export async function getHomeTeamService(): Promise<HomeTeamResponse> {
  const record = await getHomeTeamFromDb();
  return { members: mapRecordToTeam(record) };
}

export async function updateHomeTeamService(payload: unknown): Promise<HomeTeamResponse> {
  if (!payload || typeof payload !== "object" || !("members" in payload)) {
    throw new TeamValidationError("Payload inválido.");
  }

  const parsed = parseTeamMembers((payload as TeamPayload).members);
  const record = await upsertHomeTeamInDb(parsed);
  return { members: mapRecordToTeam(record) };
}