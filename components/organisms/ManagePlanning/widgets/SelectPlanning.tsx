import usePlannings from "@hooks/usePlannings";
import { Group, Select, Text } from "@mantine/core";
import { FC, forwardRef } from "react";

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

export type SelectPlanningProps = {
  value: string;
  onChange: (value: string) => void;
};

export const SelectPlanning: FC<SelectPlanningProps> = ({
  value,
  onChange,
}) => {
  const { plannings } = usePlannings();

  return (
    <section>
      <h2 className="title mb-xs">Modifier un planning</h2>
      <Select
        label="Choix du planning"
        itemComponent={SelectPlanningItem}
        data={plannings.map((planning) => ({
          label: planning.name,
          description: `Du ${new Date(
            planning.startDate
          ).toLocaleDateString()} au ${new Date(
            planning.endDate
          ).toLocaleDateString()}`,
          value: planning.id,
        }))}
        value={value}
        searchable
        clearable
        maxDropdownHeight={400}
        onChange={onChange}
      />
    </section>
  );
};
