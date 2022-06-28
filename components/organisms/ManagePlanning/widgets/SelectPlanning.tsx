import { usePlannings } from "@hooks";
import { Button, Group, Select, Text } from "@mantine/core";
import { useModals } from "@mantine/modals";
import axios from "axios";
import dayjs from "dayjs";
import { FC, forwardRef, useCallback, useMemo } from "react";

type SelectPlanningItemProps = {
  label: string;
  description: string;
};

const CompareDate = (date1: Date | string, date2: Date | string) => {
  return dayjs(date1).toDate().getTime() - dayjs(date2).toDate().getTime();
};

const SelectPlanningItem = forwardRef<HTMLDivElement, SelectPlanningItemProps>(
  ({ label, description, ...props }, ref) => (
    <div ref={ref} {...props}>
      <Group noWrap>
        <div>
          <Text>{label}</Text>
          <Text size="xs" color="dimmed">
            {description}
          </Text>
        </div>
      </Group>
    </div>
  )
);
SelectPlanningItem.displayName = "SelectPlanningItem";

export type SelectPlanningProps = {
  value: string | null;
  onChange: (value: string | null) => void;
};

export const SelectPlanning: FC<SelectPlanningProps> = ({
  value,
  onChange,
}) => {
  const modals = useModals();
  const { plannings, mutate } = usePlannings({ hidden: false });
  const currentPlanning = useMemo(
    () => plannings.find((e) => e.id === value),
    [value, plannings]
  );

  const failedHidePlanningModal = useCallback(() => {
    modals.openContextModal("demonstration", {
      title: <Text weight="bold">{"Echec de l'opération"}</Text>,
      innerProps: {
        modalBody: "Le planning n'a pas pu être masqué",
      },
    });
  }, [modals]);

  const openHidePlanningModal = useCallback(() => {
    const hidePlanning = () => {
      if (value)
        axios
          .post(`/api/workSchedule/${value}/hide`)
          .then(() => onChange(null))
          .catch(() => {
            modals.closeAll();
            failedHidePlanningModal();
          })
          .then(() => mutate());
    };

    modals.openConfirmModal({
      title: <Text weight="bold">{"Masquer un planning"}</Text>,
      centered: true,
      children: (
        <Text size="sm">
          Êtes-vous sûr de vouloir masquer le planning{" "}
          <Text
            component="span"
            weight="bold"
            size="sm"
          >{`${currentPlanning?.name}`}</Text>
          <br />
          <br />
          {currentPlanning &&
            CompareDate(dayjs().toDate(), currentPlanning.endDate) < 0 && (
              <Text color="red" weight="bold" size="sm">
                {"- Ce planning n'est pas encore terminé"}
              </Text>
            )}
          <Text color="red" weight="bold" size="sm">
            - Vous ne pourrez plus modifier ou supprimer les cours de ce
            planning
          </Text>
        </Text>
      ),
      labels: { confirm: "Supprimer", cancel: "Annuler" },
      confirmProps: { color: "red" },
      onConfirm: hidePlanning,
    });
  }, [
    currentPlanning,
    failedHidePlanningModal,
    modals,
    mutate,
    onChange,
    value,
  ]);

  return (
    <section>
      <h2 className="title mb-xs">Modifier un planning</h2>
      <Group align={"flex-end"}>
        <Select
          label="Choix du planning"
          itemComponent={SelectPlanningItem}
          data={plannings.map((planning) => ({
            label: planning.name,
            description: `Du ${dayjs(planning.startDate)
              .toDate()
              .toLocaleDateString()} au ${dayjs(planning.endDate)
              .toDate()
              .toLocaleDateString()}`,
            value: planning.id,
          }))}
          value={value}
          searchable
          clearable
          maxDropdownHeight={400}
          onChange={onChange}
          style={{ flex: 1 }}
        />
        {value && (
          <Button color="red" onClick={openHidePlanningModal}>
            Masquer
          </Button>
        )}
      </Group>
    </section>
  );
};
