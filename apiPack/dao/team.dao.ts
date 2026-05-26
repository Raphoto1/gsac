import { prisma } from "@/lib/prisma";
import { DEFAULT_HOME_TEAM, type HomeTeamMember } from "@/types/home-team";

export type HomeTeamRecord = {
  members: HomeTeamMember[];
};

const TEAM_ID = "home_team";

type HomeTeamMemberRow = {
  id: string;
  position: number;
  name: string;
  role: string;
  photo: string;
  linkedin: string | null;
};

function mapRowToMember(row: HomeTeamMemberRow): HomeTeamMember {
  return {
    name: row.name,
    role: row.role,
    photo: row.photo,
    linkedin: row.linkedin ?? undefined,
  };
}

function mapMemberToRow(member: HomeTeamMember, index: number) {
  return {
    position: index + 1,
    name: member.name,
    role: member.role,
    photo: member.photo,
    linkedin: member.linkedin ?? null,
  };
}

async function readLegacyMembers(): Promise<HomeTeamMember[]> {
  const legacyRecord = await prisma.homeTeam.findUnique({
    where: { id: TEAM_ID },
    select: { members: true },
  });

  if (!legacyRecord || !Array.isArray(legacyRecord.members)) {
    return [];
  }

  return legacyRecord.members as HomeTeamMember[];
}

export async function getHomeTeamFromDb(): Promise<HomeTeamRecord | null> {
  const rows = await prisma.homeTeamMemberEntry.findMany({
    orderBy: { position: "asc" },
  });

  if (rows.length) {
    return { members: rows.map(mapRowToMember) };
  }

  const legacyMembers = await readLegacyMembers();
  if (!legacyMembers.length) {
    return { members: DEFAULT_HOME_TEAM };
  }

  await prisma.$transaction([
    prisma.homeTeamMemberEntry.deleteMany({}),
    prisma.homeTeamMemberEntry.createMany({
      data: legacyMembers.map(mapMemberToRow),
    }),
  ]);

  return { members: legacyMembers };
}

export async function upsertHomeTeamInDb(members: HomeTeamMember[]): Promise<HomeTeamRecord> {
  await prisma.$transaction([
    prisma.homeTeamMemberEntry.deleteMany({}),
    prisma.homeTeamMemberEntry.createMany({
      data: members.map(mapMemberToRow),
    }),
  ]);

  return { members };
}