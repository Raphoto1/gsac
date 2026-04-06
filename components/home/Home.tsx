"use client";

import MainHeader from "./MainHeader";
import BigCard from "./BigCard";
import CompanyList from "./CompanyList";
import Cases from "./Cases";
import Contact from "./Contact";
import HomeNewsPreview from "./HomeNewsPreview";

export default function Home() {
  return (
    <div>
      <MainHeader />
      <BigCard />
      <CompanyList />
      <Cases />
      {/* <HomeNewsPreview /> */}
      <Contact />
    </div>
  );
}
