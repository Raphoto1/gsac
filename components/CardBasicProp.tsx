import Link from "next/link";
import React from "react";
import {
  IoBriefcase,
  IoBusiness,
  IoConstruct,
  IoGlobe,
  IoRocket,
  IoSettings,
} from "react-icons/io5";


type CardBasicProps = {
  title: string;
  description: string;
  link?: string;
  color?: "primary" | "secondary" | "accent" | "neutral";
  icon?: "business" | "briefcase" | "construct" | "globe" | "rocket" | "settings";
};

const cardColorClassMap = {
  primary: "bg-primary text-primary-content",
  secondary: "bg-secondary text-secondary-content",
  accent: "bg-accent text-accent-content",
  neutral: "bg-neutral text-neutral-content",
} as const;

const cardIconMap = {
  business: IoBusiness,
  briefcase: IoBriefcase,
  construct: IoConstruct,
  globe: IoGlobe,
  rocket: IoRocket,
  settings: IoSettings,
} as const;

export default function CardBasicProp({
  title,
  description,
  link,
  color = "primary",
  icon = "business",
}: CardBasicProps) {
  const CardIcon = cardIconMap[icon];

  return (
      <div className={`card relative w-96 ${cardColorClassMap[color]}`}>
          <CardIcon className="absolute right-5 top-5" size={24} />
      <div className='card-body'>
        <h2 className='card-title'>{title}</h2>
        <p>{description}</p>
        <div className='card-actions justify-end'>
          {link ? (
            <Link href={link}>
              <button className='btn'>Buy Now</button>
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
