import {
  Calendar16,
  CalendarTools16,
  CheckmarkOutline16,
  Error16,
  Exit16,
  Report16,
  Settings16,
  User16,
} from "@carbon/icons-react";

const userOptions = [
  {
    icon: Report16,
    label: "États Horaires",
    path: "/time-report",
    forAdmin: true,
  },
  { icon: Calendar16, label: "Planning", path: "/planning" },
  {
    icon: CalendarTools16,
    label: "Gestion Planning",
    path: "/manage-planning",
    forAdmin: true,
  },
  {
    icon: CheckmarkOutline16,
    label: "Travaux Internes",
    path: "/internalWork",
  },
  {
    icon: Error16,
    label: "Indisponibilités",
    path: "/unavailability",
  },
  { icon: User16, label: "Utilisateurs", path: "/users", forAdmin: true },
  { icon: Settings16, label: "Réglages", path: "/settings" },
  { icon: Exit16, label: "Déconnexion", path: "#", action: "SignOut" },
];

export default userOptions;
