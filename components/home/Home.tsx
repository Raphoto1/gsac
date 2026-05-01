"use client";

import MainHeader from "./MainHeader";
import BigCard from "./BigCard";
import CompanyList from "./CompanyList";
import CompanyListClients from "./CompanyListClients";
import Cases from "./Cases";
import Contact from "./Contact";
import HomeNewsPreview from "./HomeNewsPreview";
import Team from "./Team";

export default function Home() {
  return (
    <div>
      <MainHeader />
      <BigCard />
      <CompanyList />
      <CompanyListClients />
      <Cases />
      {/* <HomeNewsPreview /> */}
      <Team />
      <Contact />
    </div>
  );
}
