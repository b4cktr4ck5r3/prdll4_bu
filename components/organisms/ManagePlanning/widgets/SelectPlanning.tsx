import usePlannings from "@hooks/usePlannings";
import { Group, Select, Text } from "@mantine/core";
import { FC, forwardRef, useEffect } from "react";

type SelectPlanningItemProps = {
  label: string;
  description: string;
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

export const SelectPlanning: FC = () => {
  const { plannings } = usePlannings();

  useEffect(() => {
    //
  }, []);

  return (
    <section>
      <h2 className="title">Choix du planning</h2>
      <Select
        label="Choisir un planning"
        itemComponent={SelectPlanningItem}
        data={plannings.map((planning) => ({
          label: planning.name,
          description: planning.name,
          value: planning.id,
        }))}
        searchable
        maxDropdownHeight={400}
        onChange={(value) => alert(value)}
      />
    </section>
  );
};
