import { BasicForm } from "@components/molecules";
import { TimeReportFormType, timeReportInputs } from "@data/form";
import { Button } from "@mantine/core";
import { UseForm } from "@mantine/hooks/lib/use-form/use-form";
import { useModals } from "@mantine/modals";
import axios from "axios";
import { FC, useCallback, useRef } from "react";

export type CreateTimeReportProps = {
  userId?: string;
  onNew?: (id: string) => void;
};

export const CreateTimeReport: FC<CreateTimeReportProps> = ({
  userId,
  onNew = () => null,
}) => {
  const formNewPlanning = useRef<UseForm<TimeReportFormType>>();
  const modals = useModals();

  const openCreateTimeReportModal = useCallback(() => {
    const idModal = modals.openConfirmModal({
      title: "Création d'un etat horaire",
      centered: true,
      children: (
        <BasicForm
          {...timeReportInputs()}
          setForm={(form: UseForm<TimeReportFormType>) =>
            (formNewPlanning.current = form)
          }
        />
      ),
      closeOnConfirm: false,
      labels: { confirm: "Créer", cancel: "Annuler" },
      onConfirm: () => {
        formNewPlanning.current?.onSubmit((values) => {
          axios
            .post<{ id: string }>("/api/timeReport", { ...values, userId })
            .then(({ data }) => {
              modals.closeModal(idModal);
              onNew(data.id);
            })
            .catch(() => alert("error"));
        })();
      },
      onCancel: () => {
        formNewPlanning.current?.reset();
      },
    });
  }, [modals, onNew, userId]);

  if (!userId) return null;
  else
    return (
      <Button onClick={openCreateTimeReportModal}>
        Générer un nouvel état horaire
      </Button>
    );
};
