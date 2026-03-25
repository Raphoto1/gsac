"use client";

import Image from "next/image";
import { useState } from "react";
import Modal from "@/components/utils/modal/Modal";

type CaseCardProps = {
  name: string;
  description: string;
  image: string;
  className?: string;
};

export default function CaseCard(props: CaseCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const cardClassName = props.className ? props.className : "max-w-sm";

  return (
    <>
      <div className={`card w-full bg-base-100 shadow-sm ${cardClassName}`}>
        <div className='card-body'>
          <h2 className='card-title'>{props.name}</h2>
          <p>{props.description}</p>
        </div>
        <figure>
          <button
            type='button'
            onClick={() => setIsModalOpen(true)}
            className='group w-full cursor-pointer overflow-hidden'
            aria-label={`Open details for ${props.name}`}
          >
            <Image
              className='h-56 w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105'
              src={props.image}
              alt={props.name}
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
        title={props.name}
      >
        <div className='space-y-4'>
          <Image
            className='max-h-[70vh] w-full rounded-xl object-cover'
            src={props.image}
            alt={props.name}
            width={1200}
            height={800}
            sizes='(max-width: 768px) 100vw, 672px'
          />
          <p className='text-base-content/80'>{props.description}</p>
        </div>
      </Modal>
    </>
  );
}
