"use client";

import Image from "next/image";
import { useState } from "react";
import Modal from "@/components/utils/modal/Modal";
import { trackEvent } from "@/components/utils/analytics/GoogleAnalytics";

type CaseCardProps = {
  companyName: string;
  organizationType: string;
  description: string;
  advancedDescription?: string;
  impactItems?: string[];
  image: string;
  className?: string;
  detailsLabel?: string;
};

function getOrganizationTheme(organizationType: string) {
  switch (organizationType.toLowerCase()) {
    case "corporativo":
    case "enterprise":
      return {
        accent: "#1f6fa8",
        accentSoft: "rgba(31, 111, 168, 0.20)",
        accentDeep: "#153f61",
        triangleWrapClassName: "right-6 top-18",
        triangleOuterClassName: "h-24 w-28",
        triangleInnerClassName: "h-12 w-14",
        badgeClassName: "border-[#1f6fa8]/30 bg-[#1f6fa8]/10 text-[#153f61]",
      };
    case "startup":
      return {
        accent: "#f08a24",
        accentSoft: "rgba(240, 138, 36, 0.22)",
        accentDeep: "#9a4f08",
        triangleWrapClassName: "right-4 top-16",
        triangleOuterClassName: "h-20 w-24",
        triangleInnerClassName: "h-10 w-12",
        badgeClassName: "border-[#f08a24]/30 bg-[#f08a24]/10 text-[#9a4f08]",
      };
    case "ong":
    case "ngo":
      return {
        accent: "#2f9d57",
        accentSoft: "rgba(47, 157, 87, 0.22)",
        accentDeep: "#1f6a3a",
        triangleWrapClassName: "right-7 top-20",
        triangleOuterClassName: "h-20 w-24",
        triangleInnerClassName: "h-10 w-12",
        badgeClassName: "border-[#2f9d57]/30 bg-[#2f9d57]/10 text-[#1f6a3a]",
      };
    case "pyme":
    case "sme":
    default:
      return {
        accent: "#7a56d6",
        accentSoft: "rgba(122, 86, 214, 0.18)",
        accentDeep: "#523599",
        triangleWrapClassName: "right-5 top-17",
        triangleOuterClassName: "h-22 w-26",
        triangleInnerClassName: "h-11 w-13",
        badgeClassName: "border-[#7a56d6]/30 bg-[#7a56d6]/10 text-[#523599]",
      };
  }
}

export default function CaseCard(props: CaseCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const cardClassName = props.className ? props.className : "max-w-sm";
  const theme = getOrganizationTheme(props.organizationType);
  const modalDescription = props.advancedDescription ?? props.description;
  const impactItems = props.impactItems ?? [];
  const detailsLabel = props.detailsLabel ?? "Advanced Description";

  const handleOpenModal = () => {
    setIsModalOpen(true);
    trackEvent("open_success_case", {
      case_name: props.companyName,
      organization_type: props.organizationType,
      page_location: window.location.pathname,
    });
  };

  return (
    <>
      <div className={`card relative w-full overflow-hidden border border-base-300/70 bg-base-100 shadow-sm ${cardClassName}`}>
        <div
          className='absolute inset-x-0 top-0 h-3'
          style={{
            background: `linear-gradient(90deg, rgba(255,255,255,0.98) 0%, ${theme.accentSoft} 38%, ${theme.accent} 100%)`,
          }}
        />
        <div className={`pointer-events-none absolute z-20 flex flex-col items-center gap-2 ${theme.triangleWrapClassName}`}>
          <div
            className={`${theme.triangleOuterClassName}`}
            style={{
              background: `linear-gradient(180deg, ${theme.accent} 0%, ${theme.accentDeep} 100%)`,
              clipPath: "polygon(50% 0, 100% 100%, 0 100%)",
              filter: `drop-shadow(0 14px 22px ${theme.accentSoft})`,
              opacity: 0.95,
            }}
          />
          <div
            className={`${theme.triangleInnerClassName} -mt-11`}
            style={{
              background: `linear-gradient(180deg, color-mix(in srgb, ${theme.accent} 80%, white 20%) 0%, ${theme.accent} 100%)`,
              clipPath: "polygon(50% 0, 100% 100%, 0 100%)",
              opacity: 0.98,
            }}
          />
        </div>
        <div
          className='card-body relative z-10 overflow-hidden px-4 pb-5 pt-4 md:px-4 md:pb-4 md:pt-3.5'
          style={{
            background: `linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.96) 58%, ${theme.accentSoft} 100%)`,
          }}
        >
          <div className='pr-26 md:pr-28'>
            <div className='flex items-start justify-between gap-3'>
              <h2 className='card-title pr-2 text-xl leading-tight md:text-[1.1rem]'>{props.companyName}</h2>
              <span className={`badge shrink-0 border ${theme.badgeClassName}`}>{props.organizationType}</span>
            </div>
            <p className='mt-2 text-sm leading-7 text-base-content/80 md:leading-6 md:pb-4'>{props.description}</p>
          </div>
        </div>
        <figure>
          <button
            type='button'
            onClick={handleOpenModal}
            className='group relative w-full cursor-pointer overflow-hidden'
            aria-label={`Open details for ${props.companyName}`}
          >
            <div
              className='pointer-events-none absolute inset-0 z-1'
              style={{
                background: `linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.04) 68%, ${theme.accentDeep}22 100%)`,
              }}
            />
            {impactItems.length > 0 ? (
              <div className='pointer-events-none absolute bottom-5 right-4 z-10 flex w-[38%] flex-wrap justify-end gap-2'>
                {impactItems.map((item) => (
                  <span
                    key={item}
                    className='rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-sm'
                    style={{
                      background: `color-mix(in srgb, ${theme.accentDeep} 58%, transparent)`,
                      borderColor: `color-mix(in srgb, ${theme.accent} 35%, white 15%)`,
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            ) : null}
            <Image
              className='h-36 w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105 md:h-30'
              src={props.image}
              alt={props.companyName}
              width={640}
              height={360}
              sizes='(max-width: 768px) 100vw, 384px'
            />
          </button>
        </figure>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={props.companyName}
        hideHeader
      >
        <div className='relative -mx-5 -mt-4 overflow-hidden rounded-t-2xl border-b border-base-300/70 bg-base-100'>
          <button
            type='button'
            onClick={() => setIsModalOpen(false)}
            className='btn btn-ghost btn-sm absolute right-4 top-4 z-30 bg-base-100/80 backdrop-blur'
            aria-label='Close modal'
          >
            X
          </button>
          <div
            className='absolute inset-x-0 top-0 h-3'
            style={{
              background: `linear-gradient(90deg, rgba(255,255,255,0.98) 0%, ${theme.accentSoft} 38%, ${theme.accent} 100%)`,
            }}
          />
          <div className={`pointer-events-none absolute z-20 flex flex-col items-center gap-2 ${theme.triangleWrapClassName}`}>
            <div
              className={`${theme.triangleOuterClassName}`}
              style={{
                background: `linear-gradient(180deg, ${theme.accent} 0%, ${theme.accentDeep} 100%)`,
                clipPath: "polygon(50% 0, 100% 100%, 0 100%)",
                filter: `drop-shadow(0 14px 22px ${theme.accentSoft})`,
                opacity: 0.95,
              }}
            />
            <div
              className={`${theme.triangleInnerClassName} -mt-11`}
              style={{
                background: `linear-gradient(180deg, color-mix(in srgb, ${theme.accent} 80%, white 20%) 0%, ${theme.accent} 100%)`,
                clipPath: "polygon(50% 0, 100% 100%, 0 100%)",
                opacity: 0.98,
              }}
            />
          </div>
          <div
            className='relative z-10 overflow-hidden px-5 pb-7 pt-7'
            style={{
              background: `linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.96) 58%, ${theme.accentSoft} 100%)`,
            }}
          >
            <div className='pr-26 md:pr-28'>
              <div className='flex items-start justify-between gap-3'>
                <h2 className='pr-2 text-xl font-semibold leading-tight'>{props.companyName}</h2>
                <span className={`badge shrink-0 border ${theme.badgeClassName}`}>{props.organizationType}</span>
              </div>
              <p className='mt-3 text-base-content/80'>{props.description}</p>
            </div>
          </div>
          <div className='w-full'>
            <div className='relative aspect-32/9 w-full'>
              <div
                className='pointer-events-none absolute inset-0 z-1'
                style={{
                  background: `linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.04) 68%, ${theme.accentDeep}22 100%)`,
                }}
              />
              {impactItems.length > 0 ? (
                <div className='pointer-events-none absolute bottom-5 right-4 z-10 flex w-[38%] flex-wrap justify-end gap-2'>
                  {impactItems.map((item) => (
                    <span
                      key={item}
                      className='rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-sm'
                      style={{
                        background: `color-mix(in srgb, ${theme.accentDeep} 58%, transparent)`,
                        borderColor: `color-mix(in srgb, ${theme.accent} 35%, white 15%)`,
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              ) : null}
              <Image
                className='object-cover'
                src={props.image}
                alt={props.companyName}
                fill
                sizes='(max-width: 768px) 100vw, 672px'
              />
            </div>
          </div>
          <div className='px-5 py-5'>
            <div className='rounded-2xl border border-base-300/70 bg-base-100/80 p-4'>
              <p className='text-sm font-semibold uppercase tracking-[0.18em] text-base-content/55'>{detailsLabel}</p>
              <p className='mt-3 whitespace-pre-line text-base leading-7 text-base-content/80'>{modalDescription}</p>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
