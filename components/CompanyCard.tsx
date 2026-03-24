import React from "react";
import Image from "next/image";

export default function CompanyCard(props:any) {
  return (
    <div className='card w-full max-w-sm bg-base-100 shadow-sm'>
      <figure className='px-4 pt-4 sm:px-10 sm:pt-10'>
        <Image
          src={props.logo}
          alt={props.name}
          className='w-full rounded-xl object-cover'
          width={640}
          height={360}
          sizes='(max-width: 768px) 100vw, 384px'
        />
      </figure>
      <div className='card-body items-center text-center'>
        <h2 className='card-title'>{props.name}</h2>
        <p>{props.description}</p>
        <div className='card-actions'>
          <button className='btn btn-primary'>Link a empresa</button>
        </div>
      </div>
    </div>
  );
}
