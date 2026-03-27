"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import CompanyCard from "../CompanyCard";

export default function CompanyList() {
  const t = useTranslations("companies");
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [particlesActive, setParticlesActive] = useState(true);
  const desktopPositions = [
    "md:absolute md:left-[10%] md:top-[14%]",
    "md:absolute md:right-[10%] md:top-[8%]",
    "md:absolute md:left-[20%] md:bottom-[16%]",
    "md:absolute md:right-[18%] md:bottom-[10%]",
  ];
  const mobilePositions = [
    "self-start",
    "self-end",
    "self-start",
    "self-end",
  ];

    const companies = [
        {
            name: "Tech Innovators Inc.",
            description: "Leading the way in tech innovation.",
            logo: "https://images.pexels.com/photos/355952/pexels-photo-355952.jpeg"
        },
        {
            name: "Green Energy Solutions",
            description: "Sustainable energy for a better future.",
            logo: "https://images.pexels.com/photos/355952/pexels-photo-355952.jpeg"
        },
        {
            name: "HealthPlus",
            description: "Innovative healthcare solutions.",
            logo: "https://images.pexels.com/photos/355952/pexels-photo-355952.jpeg"
        },
        {
            name: "EduTech",
            description: "Revolutionizing education through technology.",
            logo: "https://images.pexels.com/photos/355952/pexels-photo-355952.jpeg"
        }
    ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setParticlesActive(false);
    }, 15000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);


  return (
    <section ref={sectionRef} className='relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white px-4 py-16'>
      <div className='relative z-20 w-full max-w-6xl'>
        <div className='text-center'>
          <h1 className='text-4xl font-bold md:text-6xl'>{t("title")}</h1>
          <p className='mx-auto mt-3 max-w-2xl text-sm text-base-content/70 md:text-base'>
            Un ecosistema de empresas conectadas por colaboracion, tecnologia y resultados.
          </p>
        </div>

        <div className='relative mt-14'>
          <div
            className={[
              "pointer-events-none absolute inset-0 hidden transition-opacity duration-700 md:block",
              isVisible ? "opacity-100" : "opacity-0",
            ].join(" ")}
            aria-hidden='true'
          >
            <svg viewBox='0 0 1000 760' className='h-full w-full overflow-visible'>
              <path d='M220 150 C360 120, 520 110, 730 135' className='company-network-path' pathLength='100' />
              <path d='M220 150 C220 250, 250 400, 320 560' className='company-network-path' pathLength='100' />
              <path d='M730 135 C690 260, 670 410, 690 580' className='company-network-path' pathLength='100' />
              <path d='M320 560 C450 520, 580 520, 690 580' className='company-network-path' pathLength='100' />
              <path d='M220 150 C390 250, 520 360, 690 580' className='company-network-path subtle' pathLength='100' />
              <path d='M730 135 C620 250, 470 360, 320 560' className='company-network-path subtle' pathLength='100' />

              <circle
                cx='220'
                cy='150'
                r='7'
                className='company-network-node-svg'
                style={particlesActive ? undefined : { animation: 'none' }}
              />
              <circle
                cx='730'
                cy='135'
                r='7'
                className='company-network-node-svg'
                style={particlesActive ? undefined : { animation: 'none' }}
              />
              <circle
                cx='320'
                cy='560'
                r='7'
                className='company-network-node-svg'
                style={particlesActive ? undefined : { animation: 'none' }}
              />
              <circle
                cx='690'
                cy='580'
                r='7'
                className='company-network-node-svg'
                style={particlesActive ? undefined : { animation: 'none' }}
              />

              {particlesActive ? (
                <>
                  <circle r='5' className='company-network-dot-svg'>
                    <animateMotion dur='4.6s' repeatCount='indefinite' rotate='auto'>
                      <mpath href='#line-arc-top' />
                    </animateMotion>
                  </circle>
                  <circle r='5' className='company-network-dot-svg delay-a'>
                    <animateMotion dur='5.1s' repeatCount='indefinite' rotate='auto'>
                      <mpath href='#line-left-drop' />
                    </animateMotion>
                  </circle>
                  <circle r='5' className='company-network-dot-svg delay-b'>
                    <animateMotion dur='5.4s' repeatCount='indefinite' rotate='auto'>
                      <mpath href='#line-diagonal-flow' />
                    </animateMotion>
                  </circle>
                </>
              ) : (
                <>
                  <circle cx='475' cy='122' r='5' className='company-network-dot-svg' />
                  <circle cx='260' cy='365' r='5' className='company-network-dot-svg delay-a' />
                  <circle cx='520' cy='330' r='5' className='company-network-dot-svg delay-b' />
                </>
              )}

              <path id='line-arc-top' d='M220 150 C360 120, 520 110, 730 135' fill='none' stroke='transparent' />
              <path id='line-left-drop' d='M220 150 C220 250, 250 400, 320 560' fill='none' stroke='transparent' />
              <path id='line-diagonal-flow' d='M730 135 C620 250, 470 360, 320 560' fill='none' stroke='transparent' />
            </svg>
          </div>

          <div className='relative md:hidden'>
            <div
              className={[
                "pointer-events-none absolute inset-0 transition-opacity duration-700",
                isVisible ? "opacity-100" : "opacity-0",
              ].join(" ")}
              aria-hidden='true'
            >
              <svg viewBox='0 0 360 1200' className='h-full w-full overflow-visible'>
                <path d='M95 115 C165 150, 225 185, 270 310' className='company-network-path' pathLength='100' />
                <path d='M270 310 C235 415, 160 470, 120 600' className='company-network-path' pathLength='100' />
                <path d='M120 600 C175 700, 235 760, 275 845' className='company-network-path' pathLength='100' />
                <path d='M95 115 C145 300, 145 480, 120 600' className='company-network-path subtle' pathLength='100' />
                <path d='M270 310 C240 510, 245 690, 275 845' className='company-network-path subtle' pathLength='100' />

                <circle
                  cx='95'
                  cy='115'
                  r='7'
                  className='company-network-node-svg'
                  style={particlesActive ? undefined : { animation: 'none' }}
                />
                <circle
                  cx='270'
                  cy='310'
                  r='7'
                  className='company-network-node-svg'
                  style={particlesActive ? undefined : { animation: 'none' }}
                />
                <circle
                  cx='120'
                  cy='600'
                  r='7'
                  className='company-network-node-svg'
                  style={particlesActive ? undefined : { animation: 'none' }}
                />
                <circle
                  cx='275'
                  cy='845'
                  r='7'
                  className='company-network-node-svg'
                  style={particlesActive ? undefined : { animation: 'none' }}
                />

                {particlesActive ? (
                  <>
                    <circle r='5' className='company-network-dot-svg'>
                      <animateMotion dur='4.2s' repeatCount='indefinite' rotate='auto'>
                        <mpath href='#mobile-line-a' />
                      </animateMotion>
                    </circle>
                    <circle r='5' className='company-network-dot-svg delay-a'>
                      <animateMotion dur='4.8s' repeatCount='indefinite' rotate='auto'>
                        <mpath href='#mobile-line-b' />
                      </animateMotion>
                    </circle>
                    <circle r='5' className='company-network-dot-svg delay-b'>
                      <animateMotion dur='5.2s' repeatCount='indefinite' rotate='auto'>
                        <mpath href='#mobile-line-c' />
                      </animateMotion>
                    </circle>
                  </>
                ) : (
                  <>
                    <circle cx='180' cy='190' r='5' className='company-network-dot-svg' />
                    <circle cx='205' cy='450' r='5' className='company-network-dot-svg delay-a' />
                    <circle cx='210' cy='725' r='5' className='company-network-dot-svg delay-b' />
                  </>
                )}

                <path id='mobile-line-a' d='M95 115 C165 150, 225 185, 270 310' fill='none' stroke='transparent' />
                <path id='mobile-line-b' d='M270 310 C235 415, 160 470, 120 600' fill='none' stroke='transparent' />
                <path id='mobile-line-c' d='M120 600 C175 700, 235 760, 275 845' fill='none' stroke='transparent' />
              </svg>
            </div>

            <div className='relative z-10 flex flex-col gap-14 px-3 py-5'>
              {companies.map((company, index) => (
                <div
                  key={index}
                  className={[
                    "w-[88%] max-w-72 transition-all duration-700 ease-out",
                    mobilePositions[index],
                    isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
                  ].join(" ")}
                  style={{ transitionDelay: `${index * 140}ms`, animationDelay: `${index * 0.7}s` }}
                >
                  <CompanyCard {...company} />
                </div>
              ))}
            </div>
          </div>

          <div className='relative hidden h-170 md:block'>
            {companies.map((company, index) => (
              <div
                key={index}
                className={[
                  "w-[20rem] transition-all duration-700 ease-out",
                  desktopPositions[index],
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
                ].join(" ")}
                style={{ transitionDelay: `${index * 140}ms`, animationDelay: `${index * 0.7}s` }}
              >
                <CompanyCard {...company} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
