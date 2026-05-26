export type HomeTeamMember = {
  name: string;
  role: string;
  photo: string;
  linkedin?: string;
};

export type HomeTeamData = {
  members: HomeTeamMember[];
};

export const DEFAULT_HOME_TEAM: HomeTeamMember[] = [
  {
    name: "Estrategia / Strategy",
    role: "Dirección de crecimiento y ejecución / Growth and execution leadership",
    photo: "https://images.pexels.com/photos/3777946/pexels-photo-3777946.jpeg",
  },
  {
    name: "Estructuración financiera / Financial structuring",
    role: "Modelos de sostenibilidad y planeación de capital / Sustainability models and capital planning",
    photo: "https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg",
  },
  {
    name: "Fundraising y alianzas / Fundraising and partnerships",
    role: "Estrategia de donantes, grants y aliados / Donor, grants, and alliance strategy",
    photo: "https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg",
  },
  {
    name: "Proyectos de inversión / Investment projects",
    role: "Estructuración de impacto y despliegue / Impact structuring and delivery",
    photo: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg",
  },
];

export type HomeTeamResponse = {
  members: HomeTeamMember[];
};