import {
  Calendar16,
  CheckmarkOutline16,
  Error16,
  Exit16,
  Home16,
  Settings16,
} from "@carbon/icons-react";

const userOptions = [
  { icon: Home16, label: "Tableau de bord", path: "/" },
  { icon: Calendar16, label: "Planning", path: "/planning" },
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
  { icon: Settings16, label: "Réglages", path: "/settings" },
  { icon: Exit16, label: "Déconnexion", path: "#", action: "SignOut" },
];

export default userOptions;
