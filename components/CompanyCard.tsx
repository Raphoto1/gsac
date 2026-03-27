import Image from "next/image";

type CompanyCardProps = {
  name: string;
  description: string;
  logo: string;
};

export default function CompanyCard({ name, description, logo }: CompanyCardProps) {
  return (
    <article className="company-card-float group relative mx-auto flex w-full max-w-[18rem] flex-col items-center rounded-4xl border border-base-300 bg-white px-5 pb-5 pt-14 text-center shadow-[0_16px_40px_rgba(15,23,42,0.08)] transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0_24px_56px_rgba(15,23,42,0.14)]">
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-primary/35 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-16 w-16 -translate-x-1/2 -translate-y-1/3 rounded-full bg-primary/12 blur-2xl transition-transform duration-300 group-hover:scale-110" />

      <figure className="absolute left-1/2 top-0 h-22 w-22 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full ring-4 ring-white shadow-xl">
        <Image
          src={logo}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          width={240}
          height={240}
          sizes="88px"
        />
      </figure>

      <div className="relative z-10 flex flex-col items-center text-center">
        <h2 className="text-lg font-semibold text-base-content">{name}</h2>
        <p className="mt-2 text-sm leading-relaxed text-base-content/75">{description}</p>

        <div className="mt-4">
          <button className="btn btn-primary btn-sm">Link a empresa</button>
        </div>
      </div>
    </article>
  );
}
