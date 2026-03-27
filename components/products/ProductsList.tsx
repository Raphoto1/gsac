import CardBasicProp from "@/components/CardBasicProp";

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
  const desktopPositions = [
    "md:absolute md:left-[8%] md:top-[10%]",
    "md:absolute md:right-[8%] md:top-[3%]",
    "md:absolute md:left-[16%] md:bottom-[16%]",
    "md:absolute md:right-[14%] md:bottom-[5%]",
  ];
  const mobilePositions = [
    "self-start",
    "self-end",
    "self-start",
    "self-end",
  ];

  return (
    <section className="relative w-full overflow-hidden bg-white px-4 py-16">
      <div className="mx-auto w-full max-w-6xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Productos</p>
          <h2 className="mt-3 text-3xl font-bold text-base-content sm:text-4xl">Soluciones conectadas</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-base-content/70 md:text-base">
            Una red de servicios y productos pensada para operar en conjunto, con el mismo lenguaje visual del ecosistema de empresas.
          </p>
        </div>

        <div className="relative mt-14">
          <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden="true">
            <svg viewBox="0 0 1000 760" className="h-full w-full overflow-visible">
              <path d="M220 145 C360 105, 520 105, 730 135" className="company-network-path" pathLength="100" />
              <path d="M220 145 C245 270, 270 410, 335 555" className="company-network-path" pathLength="100" />
              <path d="M730 135 C690 260, 680 420, 700 585" className="company-network-path" pathLength="100" />
              <path d="M335 555 C455 505, 575 520, 700 585" className="company-network-path" pathLength="100" />
              <path d="M220 145 C390 255, 560 360, 700 585" className="company-network-path subtle" pathLength="100" />
              <path d="M730 135 C595 255, 460 400, 335 555" className="company-network-path subtle" pathLength="100" />

              <circle cx="220" cy="145" r="7" className="company-network-node-svg" />
              <circle cx="730" cy="135" r="7" className="company-network-node-svg" />
              <circle cx="335" cy="555" r="7" className="company-network-node-svg" />
              <circle cx="700" cy="585" r="7" className="company-network-node-svg" />

              <circle r="5" className="company-network-dot-svg">
                <animateMotion dur="4.8s" repeatCount="indefinite" rotate="auto">
                  <mpath href="#product-line-a" />
                </animateMotion>
              </circle>
              <circle r="5" className="company-network-dot-svg delay-a">
                <animateMotion dur="5.2s" repeatCount="indefinite" rotate="auto">
                  <mpath href="#product-line-b" />
                </animateMotion>
              </circle>
              <circle r="5" className="company-network-dot-svg delay-b">
                <animateMotion dur="5.6s" repeatCount="indefinite" rotate="auto">
                  <mpath href="#product-line-c" />
                </animateMotion>
              </circle>

              <path id="product-line-a" d="M220 145 C360 105, 520 105, 730 135" fill="none" stroke="transparent" />
              <path id="product-line-b" d="M220 145 C245 270, 270 410, 335 555" fill="none" stroke="transparent" />
              <path id="product-line-c" d="M730 135 C595 255, 460 400, 335 555" fill="none" stroke="transparent" />
            </svg>
          </div>

          <div className="relative md:hidden">
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
              <svg viewBox="0 0 360 1200" className="h-full w-full overflow-visible">
                <path d="M95 115 C165 150, 225 185, 270 310" className="company-network-path" pathLength="100" />
                <path d="M270 310 C235 415, 160 470, 120 600" className="company-network-path" pathLength="100" />
                <path d="M120 600 C175 700, 235 760, 275 845" className="company-network-path" pathLength="100" />
                <path d="M95 115 C145 300, 145 480, 120 600" className="company-network-path subtle" pathLength="100" />
                <path d="M270 310 C240 510, 245 690, 275 845" className="company-network-path subtle" pathLength="100" />

                <circle cx="95" cy="115" r="7" className="company-network-node-svg" />
                <circle cx="270" cy="310" r="7" className="company-network-node-svg" />
                <circle cx="120" cy="600" r="7" className="company-network-node-svg" />
                <circle cx="275" cy="845" r="7" className="company-network-node-svg" />

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
                    side={index % 2 === 0 ? "left" : "right"}
                    delayIndex={index}
                    expandText={product.expandText}
                    expandTitle={product.expandTitle}
                    expandImage={product.expandImagage}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden h-175 md:block">
          {products.map((product, index) => (
            <div key={product.title} className={`w-96 ${desktopPositions[index] ?? "md:absolute md:left-0 md:top-0"}`}>
              <CardBasicProp
                title={product.title}
                description={product.description}
                icon={product.icon}
                color={index % 2 === 0 ? "primary" : "secondary"}
                side={index % 2 === 0 ? "left" : "right"}
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
    </section>
  );
}
