type CompanyListHeaderProps = {
  title: string;
  description: string;
};

export default function CompanyListHeader({ title, description }: CompanyListHeaderProps) {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold md:text-6xl">{title}</h1>
      <p className="mx-auto mt-3 max-w-2xl text-sm text-base-content/70 md:text-base">{description}</p>
    </div>
  );
}
