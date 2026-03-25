import Link from "next/link";
import React from "react";

type CardBasicProps = {
  title: string;
  description: string;
  link?: string;
  color?: "primary" | "secondary" | "accent" | "neutral";
};

const cardColorClassMap = {
  primary: "bg-primary text-primary-content",
  secondary: "bg-secondary text-secondary-content",
  accent: "bg-accent text-accent-content",
  neutral: "bg-neutral text-neutral-content",
} as const;

export default function CardBasicProp({ title, description, link, color = "primary" }: CardBasicProps) {
  return (
    <div className={`card w-96 ${cardColorClassMap[color]}`}>
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
