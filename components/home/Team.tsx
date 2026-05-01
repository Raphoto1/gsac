"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

type TeamMember = {
  name: string;
  role: string;
  photo: string;
  linkedin?: string;
};

const cardThemes = [
  {
    accent: "#1f6fa8",
    accentSoft: "rgba(31, 111, 168, 0.18)",
    accentDeep: "#153f61",
  },
  {
    accent: "#2f9d57",
    accentSoft: "rgba(47, 157, 87, 0.18)",
    accentDeep: "#1f6a3a",
  },
  {
    accent: "#f08a24",
    accentSoft: "rgba(240, 138, 36, 0.2)",
    accentDeep: "#9a4f08",
  },
  {
    accent: "#7a56d6",
    accentSoft: "rgba(122, 86, 214, 0.18)",
    accentDeep: "#523599",
  },
];

function TeamCard({ member, index }: { member: TeamMember; index: number }) {
  const theme = cardThemes[index % cardThemes.length];
  const cardClasses =
    "relative mx-auto flex h-full w-full max-w-[18.5rem] flex-col overflow-visible rounded-[2rem] border border-base-300/80 bg-base-100 px-5 pb-6 pt-6 text-center shadow-[0_20px_54px_rgba(15,23,42,0.08)] transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0_28px_64px_rgba(15,23,42,0.14)]";
  const cardContent = (
    <>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-3" style={{ background: `linear-gradient(90deg, transparent 0%, ${theme.accentSoft} 38%, ${theme.accent} 100%)` }} />

      <div className="relative z-10 mx-auto w-full max-w-[12rem] pt-2">
        <div
          className="relative mx-auto h-5 w-28 overflow-visible rounded-full border border-white/70"
          style={{
            background: `color-mix(in srgb, ${theme.accentSoft} 24%, transparent 76%)`,
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18)",
          }}
        >
          <figure className="absolute left-1/2 top-0 z-20 h-28 w-28 -translate-x-1/2 -translate-y-[78%] overflow-hidden rounded-[1.9rem] border-4 border-base-100 bg-base-200 shadow-xl">
            <Image
              src={member.photo}
              alt={member.name}
              className="h-full w-full object-cover"
              width={280}
              height={280}
              sizes="112px"
            />
          </figure>
        </div>
      </div>

      <div className="relative z-10 mt-8 flex flex-col items-center">
        <h3 className="max-w-[12rem] text-xl font-semibold leading-tight text-base-content">{member.name}</h3>
        <p
          className="mt-3 rounded-full border px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.16em]"
          style={{
            color: theme.accent,
            borderColor: `color-mix(in srgb, ${theme.accent} 35%, transparent 25%)`,
            background: `color-mix(in srgb, ${theme.accentSoft} 75%, transparent 25%)`,
          }}
        >
          {member.role}
        </p>
      </div>
    </>
  );

  if (member.linkedin) {
    return (
      <a
        href={member.linkedin}
        target="_blank"
        rel="noreferrer"
        aria-label={`Ver perfil de LinkedIn de ${member.name}`}
        className="block h-full w-full"
      >
        <article className={`${cardClasses} cursor-pointer`}>
          {cardContent}
        </article>
      </a>
    );
  }

  return <article className={cardClasses}>{cardContent}</article>;
}

export default function Team() {
  const t = useTranslations("team");
  const members = ["member1", "member2", "member3", "member4"].map((memberKey, index) => {
    const memberData = t.raw(`items.${memberKey}`) as {
      name: string;
      role: string;
      linkedin?: string;
    };

    return {
      name: memberData.name,
      role: memberData.role,
      linkedin: memberData.linkedin,
      photo: [
      "https://images.pexels.com/photos/3777946/pexels-photo-3777946.jpeg",
      "https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg",
      "https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg",
      "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg",
    ][index],
    };
  });

  return (
    <section className="relative overflow-hidden bg-base-100 px-5 py-18 md:px-8 md:py-24">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(13,103,154,0.12),_transparent_40%)]"
        aria-hidden
      />
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold md:text-6xl">{t("title")}</h2>
          <p className="mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-base-content/70 md:text-base">
            {t("description")}
          </p>
        </div>

        <div className="rounded-[2.4rem] border border-base-300 bg-base-100/75 px-6 py-10 shadow-[0_30px_100px_rgba(15,23,42,0.08)] backdrop-blur-sm md:px-10 md:py-12">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-x-6 md:gap-y-14 xl:grid-cols-4">
            {members.map((member, index) => (
              <TeamCard key={member.name} member={member} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
