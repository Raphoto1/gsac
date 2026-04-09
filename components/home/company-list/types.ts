export type CompanyListItem = {
  name: string;
  description: string;
  logo: string;
};

export type CompanyListProps = {
  companies?: CompanyListItem[];
  title?: string;
  description?: string;
};
