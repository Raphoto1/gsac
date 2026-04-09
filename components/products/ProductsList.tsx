"use client";

import { useEffect, useState } from "react";
import CardBasicProp from "@/components/CardBasicProp";
import CompanyListHeader from "@/components/home/company-list/CompanyListHeader";

export type ProductItem = {
  title: string;
  description: string;
  icon?: "business" | "briefcase" | "construct" | "globe" | "rocket" | "settings";
  expandTitle?: string;
  expandText?: string;
  expandImagage?: string;
};

type ProductsListProps = {
  products: ProductItem[];
};

export default function ProductsList({ products }: ProductsListProps) {
  const [particlesActive, setParticlesActive] = useState(true);
  const mobilePositions = [
    "self-start",
    "self-end",
    "self-center",
    "self-start",
    "self-end",
  ];
  const desktopCardPositions = [
    "md:absolute md:left-[4%] md:top-[7%] md:w-[17rem] xl:left-[5%] xl:top-[8%] xl:w-[18rem]",
    "md:absolute md:right-[5%] md:top-[3%] md:w-[17rem] xl:right-[4%] xl:top-[6%] xl:w-[18rem]",
    "md:absolute md:left-1/2 md:top-[24%] md:w-[18rem] md:-translate-x-1/2 xl:top-[22%] xl:w-[19rem]",
    "md:absolute md:left-[8%] md:top-[62%] md:w-[17rem] xl:left-[14%] xl:top-[60%] xl:w-[18rem]",
    "md:absolute md:right-[8%] md:top-[64%] md:w-[17rem] xl:right-[13%] xl:top-[59%] xl:w-[18rem]",
  ];

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setParticlesActive(false);
    }, 10000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-white px-4 py-16">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(13,103,154,0.12),transparent_40%),linear-gradient(180deg,rgba(255,255,255,0.96),rgba(245,250,252,0.98))]"
        aria-hidden="true"
      />
      <div className="mx-auto w-full max-w-6xl">
        <div className="relative z-10">
          <p className="text-center text-sm font-semibold uppercase tracking-[0.18em] text-primary">Productos</p>
          <div className="mt-3">
            <CompanyListHeader
              title="Soluciones conectadas"
              description="Una red de servicios y productos pensada para operar en conjunto, con el mismo lenguaje visual del ecosistema de empresas."
            />
          </div>
        </div>

        <div className="relative z-10 mt-14">
          <div className="relative md:hidden">
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
              <svg viewBox="0 0 360 1200" className="h-full w-full overflow-visible">
                <path d="M95 115 C165 150, 225 185, 270 310" className="company-network-path" pathLength="100" />
                <path d="M270 310 C235 415, 160 470, 120 600" className="company-network-path" pathLength="100" />
                <path d="M120 600 C175 700, 235 760, 275 845" className="company-network-path" pathLength="100" />
                <path d="M95 115 C145 300, 145 480, 120 600" className="company-network-path subtle" pathLength="100" />
                <path d="M270 310 C240 510, 245 690, 275 845" className="company-network-path subtle" pathLength="100" />

                <circle
                  cx="95"
                  cy="115"
                  r="7"
                  className="company-network-node-svg"
                  style={particlesActive ? undefined : { animation: "none" }}
                />
                <circle
                  cx="270"
                  cy="310"
                  r="7"
                  className="company-network-node-svg"
                  style={particlesActive ? undefined : { animation: "none" }}
                />
                <circle
                  cx="120"
                  cy="600"
                  r="7"
                  className="company-network-node-svg"
                  style={particlesActive ? undefined : { animation: "none" }}
                />
                <circle
                  cx="275"
                  cy="845"
                  r="7"
                  className="company-network-node-svg"
                  style={particlesActive ? undefined : { animation: "none" }}
                />

                {particlesActive ? (
                  <>
                    <circle r="5" className="company-network-dot-svg">
                      <animateMotion dur="4.2s" repeatCount="indefinite" rotate="auto">
                        <mpath href="#product-mobile-a" />
                      </animateMotion>
                    </circle>
                    <circle r="5" className="company-network-dot-svg delay-a">
                      <animateMotion dur="4.8s" repeatCount="indefinite" rotate="auto">
                        <mpath href="#product-mobile-b" />
                      </animateMotion>
                    </circle>
                    <circle r="5" className="company-network-dot-svg delay-b">
                      <animateMotion dur="5.2s" repeatCount="indefinite" rotate="auto">
                        <mpath href="#product-mobile-c" />
                      </animateMotion>
                    </circle>
                  </>
                ) : (
                  <>
                    <circle cx="175" cy="190" r="5" className="company-network-dot-svg" />
                    <circle cx="206" cy="450" r="5" className="company-network-dot-svg delay-a" />
                    <circle cx="205" cy="730" r="5" className="company-network-dot-svg delay-b" />
                  </>
                )}

                <path id="product-mobile-a" d="M95 115 C165 150, 225 185, 270 310" fill="none" stroke="transparent" />
                <path id="product-mobile-b" d="M270 310 C235 415, 160 470, 120 600" fill="none" stroke="transparent" />
                <path id="product-mobile-c" d="M120 600 C175 700, 235 760, 275 845" fill="none" stroke="transparent" />
              </svg>
            </div>

            <div className="relative z-10 flex flex-col gap-20 px-3 py-6">
              {products.map((product, index) => (
                <div key={product.title} className={`w-[88%] max-w-72 ${mobilePositions[index] ?? "self-start"}`}>
                  <CardBasicProp
                    title={product.title}
                    description={product.description}
                    icon={product.icon}
                    color={index % 2 === 0 ? "primary" : "secondary"}
                    delayIndex={index}
                    expandText={product.expandText}
                    expandTitle={product.expandTitle}
                    expandImage={product.expandImagage}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden md:block">
            <div className="pointer-events-none absolute inset-0 hidden md:block xl:hidden" aria-hidden="true">
              <svg viewBox="0 0 1000 980" className="h-full w-full overflow-visible">
                <path d="M220 155 C380 118, 515 120, 760 135" className="company-network-path" pathLength="100" />
                <path d="M220 155 C245 345, 285 585, 320 850" className="company-network-path" pathLength="100" />
                <path d="M760 135 C730 335, 690 590, 720 860" className="company-network-path" pathLength="100" />
                <path d="M500 325 C430 530, 380 725, 320 850" className="company-network-path" pathLength="100" />
                <path d="M500 325 C585 520, 660 725, 720 860" className="company-network-path" pathLength="100" />
                <path d="M220 155 C395 255, 455 300, 500 325" className="company-network-path subtle" pathLength="100" />
                <path d="M760 135 C640 235, 565 290, 500 325" className="company-network-path subtle" pathLength="100" />

                <circle cx="220" cy="155" r="7" className="company-network-node-svg" style={particlesActive ? undefined : { animation: "none" }} />
                <circle cx="760" cy="135" r="7" className="company-network-node-svg" style={particlesActive ? undefined : { animation: "none" }} />
                <circle cx="500" cy="325" r="7" className="company-network-node-svg" style={particlesActive ? undefined : { animation: "none" }} />
                <circle cx="320" cy="850" r="7" className="company-network-node-svg" style={particlesActive ? undefined : { animation: "none" }} />
                <circle cx="720" cy="860" r="7" className="company-network-node-svg" style={particlesActive ? undefined : { animation: "none" }} />

                {particlesActive ? (
                  <>
                    <circle r="5" className="company-network-dot-svg">
                      <animateMotion dur="4.8s" repeatCount="indefinite" rotate="auto">
                        <mpath href="#product-grid-md-a" />
                      </animateMotion>
                    </circle>
                    <circle r="5" className="company-network-dot-svg delay-a">
                      <animateMotion dur="5.3s" repeatCount="indefinite" rotate="auto">
                        <mpath href="#product-grid-md-b" />
                      </animateMotion>
                    </circle>
                    <circle r="5" className="company-network-dot-svg delay-b">
                      <animateMotion dur="5.7s" repeatCount="indefinite" rotate="auto">
                        <mpath href="#product-grid-md-c" />
                      </animateMotion>
                    </circle>
                  </>
                ) : (
                  <>
                    <circle cx="470" cy="130" r="5" className="company-network-dot-svg" />
                    <circle cx="285" cy="505" r="5" className="company-network-dot-svg delay-a" />
                    <circle cx="610" cy="318" r="5" className="company-network-dot-svg delay-b" />
                  </>
                )}

                <path id="product-grid-md-a" d="M220 155 C380 118, 515 120, 760 135" fill="none" stroke="transparent" />
                <path id="product-grid-md-b" d="M220 155 C245 345, 285 585, 320 850" fill="none" stroke="transparent" />
                <path id="product-grid-md-c" d="M760 135 C640 235, 565 290, 500 325" fill="none" stroke="transparent" />
              </svg>
            </div>

            <div className="pointer-events-none absolute inset-0 hidden xl:block" aria-hidden="true">
              <svg viewBox="0 0 1200 780" className="h-full w-full overflow-visible">
                <path d="M200 140 C345 105, 460 105, 600 145" className="company-network-path" pathLength="100" />
                <path d="M600 145 C730 110, 860 110, 1000 145" className="company-network-path" pathLength="100" />
                <path d="M200 140 C320 230, 430 275, 600 250" className="company-network-path subtle" pathLength="100" />
                <path d="M1000 145 C885 225, 760 275, 600 250" className="company-network-path subtle" pathLength="100" />
                <path d="M600 250 C520 430, 430 595, 330 710" className="company-network-path" pathLength="100" />
                <path d="M600 250 C690 425, 775 580, 870 705" className="company-network-path" pathLength="100" />
                <path d="M330 710 C470 660, 715 655, 870 705" className="company-network-path" pathLength="100" />

                <circle cx="200" cy="140" r="7" className="company-network-node-svg" style={particlesActive ? undefined : { animation: "none" }} />
                <circle cx="600" cy="145" r="7" className="company-network-node-svg" style={particlesActive ? undefined : { animation: "none" }} />
                <circle cx="1000" cy="145" r="7" className="company-network-node-svg" style={particlesActive ? undefined : { animation: "none" }} />
                <circle cx="330" cy="710" r="7" className="company-network-node-svg" style={particlesActive ? undefined : { animation: "none" }} />
                <circle cx="870" cy="705" r="7" className="company-network-node-svg" style={particlesActive ? undefined : { animation: "none" }} />

                {particlesActive ? (
                  <>
                    <circle r="5" className="company-network-dot-svg">
                      <animateMotion dur="4.8s" repeatCount="indefinite" rotate="auto">
                        <mpath href="#product-grid-xl-a" />
                      </animateMotion>
                    </circle>
                    <circle r="5" className="company-network-dot-svg delay-a">
                      <animateMotion dur="5.2s" repeatCount="indefinite" rotate="auto">
                        <mpath href="#product-grid-xl-b" />
                      </animateMotion>
                    </circle>
                    <circle r="5" className="company-network-dot-svg delay-b">
                      <animateMotion dur="5.6s" repeatCount="indefinite" rotate="auto">
                        <mpath href="#product-grid-xl-c" />
                      </animateMotion>
                    </circle>
                  </>
                ) : (
                  <>
                    <circle cx="410" cy="112" r="5" className="company-network-dot-svg" />
                    <circle cx="435" cy="510" r="5" className="company-network-dot-svg delay-a" />
                    <circle cx="640" cy="390" r="5" className="company-network-dot-svg delay-b" />
                  </>
                )}

                <path id="product-grid-xl-a" d="M200 140 C345 105, 460 105, 600 145" fill="none" stroke="transparent" />
                <path id="product-grid-xl-b" d="M600 250 C520 430, 430 595, 330 710" fill="none" stroke="transparent" />
                <path id="product-grid-xl-c" d="M600 250 C690 425, 775 580, 870 705" fill="none" stroke="transparent" />
              </svg>
            </div>

            <div className="relative z-10 hidden md:block md:h-272 xl:h-192">
          {products.map((product, index) => (
            <div
              key={product.title}
              className={desktopCardPositions[index] ?? "md:absolute md:left-0 md:top-0 md:w-[18rem]"}
            >
              <CardBasicProp
                title={product.title}
                description={product.description}
                icon={product.icon}
                color={index % 2 === 0 ? "primary" : "secondary"}
                delayIndex={index}
                expandText={product.expandText}
                expandTitle={product.expandTitle}
                expandImage={product.expandImagage}
              />
            </div>
          ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
