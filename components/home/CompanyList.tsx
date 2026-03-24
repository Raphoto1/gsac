"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import CompanyCard from "../CompanyCard";

export default function CompanyList() {
  const t = useTranslations("companies");
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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


  return (
    <div ref={sectionRef} className='flex min-h-screen flex-col items-center justify-around bg-base-300 px-4 py-10'>
      <div>
        <h1 className='text-center text-4xl font-bold md:text-6xl'>{t("title")}</h1>
      </div>
      <div className='grid w-full max-w-7xl grid-cols-1 gap-4 py-6 md:grid-cols-3'>
        {companies.map((company, index) => (
          <div
            key={index}
            className={[
              "transition-all duration-700 ease-out",
              isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
            ].join(" ")}
            style={{ transitionDelay: `${index * 140}ms` }}
          >
            <CompanyCard {...company} />
          </div>
        ))}
      </div>
    </div>
  );
}
