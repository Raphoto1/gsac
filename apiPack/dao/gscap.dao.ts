import { HomeSectionKey } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type HomeSectionOrderRecord = {
	section: HomeSectionKey;
	position: number;
	fixed: boolean;
	visible: boolean;
};

const FIXED_SECTIONS = new Set<HomeSectionKey>([
	HomeSectionKey.HERO,
	HomeSectionKey.CONTACT,
]);

export async function getHomeSectionOrderFromDb(): Promise<HomeSectionOrderRecord[]> {
	return prisma.adminHomeSectionOrder.findMany({
		orderBy: { position: "asc" },
		select: {
			section: true,
			position: true,
			fixed: true,
			visible: true,
		},
	});
}

export async function replaceHomeSectionOrderInDb(
	sections: Array<{ section: HomeSectionKey; position: number; visible: boolean }>
): Promise<HomeSectionOrderRecord[]> {
	await prisma.$transaction(async (tx) => {
		await tx.adminHomeSectionOrder.deleteMany();
		await tx.adminHomeSectionOrder.createMany({
			data: sections.map((item) => ({
				section: item.section,
				position: item.position,
				fixed: FIXED_SECTIONS.has(item.section),
				visible: FIXED_SECTIONS.has(item.section) ? true : item.visible,
			})),
		});
	});

	return getHomeSectionOrderFromDb();
}
