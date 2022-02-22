import { BasicFormProps } from "@components/molecules";
import { Role } from "@utils/user";

const defaultInitialValues = {
  username: "",
  full_name: "",
  role: Role.USER,
};

export type UserFormType = typeof defaultInitialValues;

export const userInputs = (
  initialValues = defaultInitialValues
): BasicFormProps<UserFormType> => ({
  validationRules: {
    username: (value) => value.length > 0,
    full_name: (value) => value.length > 0,
    role: (value) => value.length > 0,
  },
  initialValues: initialValues,
  labels: {
    username: "Nom d'utilisateur",
    full_name: "Nom complet",
    role: "Role de l'utilisateur",
  },
  typeInputs: {
    username: { type: "TEXT" },
    full_name: { type: "TEXT" },
    role: {
      type: "SELECT",
      data: [
        {
          label: "Utilisateur",
          value: Role.USER,
        },
        {
          label: "Administrateur",
          value: Role.ADMIN,
        },
      ],
    },
  },
});
