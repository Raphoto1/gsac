export default function GeometricLinesBackground() {
  return (
    <>
      <div className='pointer-events-none absolute inset-0 z-0 bg-linear-to-b from-base-200 via-base-200/85 to-base-300/70' />
      <div className='pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_15%_25%,rgba(13,103,154,0.18),transparent_38%),radial-gradient(circle_at_84%_78%,rgba(47,153,204,0.16),transparent_34%)]' />

      <div className='pointer-events-none absolute inset-0 z-10'>
        <div className='geo-float-a absolute -left-16 top-12 h-40 w-40 rounded-full border border-secondary/35 md:h-56 md:w-56' />
        <div className='geo-spin-slow absolute right-[8%] top-[12%] h-20 w-20 rotate-12 border-2 border-primary/35 md:h-28 md:w-28' />
        <div className='geo-float-b absolute left-[18%] top-[42%] h-14 w-14 rotate-45 border border-primary/35 md:h-20 md:w-20' />
        <div className='geo-float-a absolute bottom-[14%] right-[14%] h-48 w-48 rounded-full border border-primary/28 md:h-64 md:w-64' />
        <div
          className='geo-float-b absolute bottom-[20%] left-[10%] h-24 w-28 border border-secondary/40 md:h-32 md:w-36'
          style={{ clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)" }}
        />
      </div>

      <div className='pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(120deg,rgba(255,255,255,0.06)_0%,transparent_40%,rgba(13,103,154,0.08)_100%)]' />
    </>
  );
}