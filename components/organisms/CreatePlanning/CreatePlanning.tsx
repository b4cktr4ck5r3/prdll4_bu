import { BasicForm } from "@components/molecules";
import { WorkScheduleFormType, workScheduleInputs } from "@data/form";
import usePlannings from "@hooks/usePlannings";
import { Button } from "@mantine/core";
import { UseForm } from "@mantine/hooks/lib/use-form/use-form";
import { useModals } from "@mantine/modals";
import axios from "axios";
import { FC, useCallback, useRef } from "react";

export const CreatePlanning: FC = () => {
  const { mutate } = usePlannings();
  const formNewPlanning = useRef<UseForm<WorkScheduleFormType>>();
  const modals = useModals();

  const openCreatePlanningModal = useCallback(() => {
    const idModal = modals.openConfirmModal({
      title: "Création d'un planning",
      centered: true,
      children: (
        <BasicForm
          {...workScheduleInputs()}
          setForm={(form: UseForm<WorkScheduleFormType>) =>
            (formNewPlanning.current = form)
          }
        />
      ),
      closeOnConfirm: false,
      labels: { confirm: "Créer", cancel: "Annuler" },
      onConfirm: () => {
        formNewPlanning.current?.onSubmit((values) => {
          axios
            .post("/api/workSchedule", values)
            .then(() => mutate())
            .then(() => modals.closeModal(idModal))
            .catch(() => alert("error"));
        })();
      },
      onCancel: () => {
        formNewPlanning.current?.reset();
      },
    });
  }, [modals, mutate]);

  return <Button onClick={openCreatePlanningModal}>Créer un planning</Button>;
};
