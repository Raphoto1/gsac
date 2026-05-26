"use client";

import AdminCompanyListForm, { type CompanyItem } from "./CompanyListForm";
import type { CompanyListKind } from "@/types/company-list";

type Props = {
  defaultItems: CompanyItem[];
  title: string;
  kind: CompanyListKind;
};

export default function CompanyListTab({ defaultItems, title, kind }: Props) {
  return <AdminCompanyListForm defaultItems={defaultItems} title={title} kind={kind} />;
}