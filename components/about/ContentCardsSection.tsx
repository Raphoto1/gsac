type ContentCardItem = {
  key: string;
  title: string;
  description: string;
};

type ContentCardsSectionProps = {
  title: string;
  items: ContentCardItem[];
  intro?: string;
};

export default function ContentCardsSection({ title, items, intro }: ContentCardsSectionProps) {
  return (
    <section className='relative overflow-hidden bg-base-100 px-4 py-16 md:px-8 md:py-20'>
      <div className='mx-auto flex w-full max-w-6xl flex-col gap-10'>
        <div className='max-w-3xl text-center md:text-left'>
          <h2 className='text-4xl font-bold text-base-content'>{title}</h2>
          {intro ? <p className='mt-4 text-base leading-7 text-base-content/75'>{intro}</p> : null}
        </div>
        <div className='grid gap-5 md:grid-cols-2 xl:grid-cols-3'>
          {items.map((item) => (
            <article
              key={item.key}
              className='rounded-3xl border border-base-300 bg-white px-6 py-7 shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition-transform duration-300 hover:-translate-y-1'
            >
              <h3 className='text-2xl font-semibold text-base-content'>{item.title}</h3>
              <p className='mt-4 text-base leading-7 text-base-content/75'>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}