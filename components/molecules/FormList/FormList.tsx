import { Add16, Checkmark16 } from "@carbon/icons-react";
import { BoxSC } from "@components/atoms";
import { MiniEvent } from "@components/molecules";
import { Button } from "@mantine/core";
import { styled } from "@stitches";
import {
  Event,
  InternalWorkItemForm,
  UnavailabilityItemForm,
} from "@utils/calendar";
import dayjs from "dayjs";
import { FC, FormEventHandler, useMemo } from "react";

type FormListProps = {
  type: Event;
  data: (InternalWorkItemForm | UnavailabilityItemForm)[];
  disabled?: boolean;
  onSubmitAll: () => void;
  onSubmitItem?: FormEventHandler<HTMLFormElement>;
  onDeleteItem: (index: number) => void;
};

export const FormList: FC<FormListProps> = ({
  children,
  data,
  type,
  disabled,
  onSubmitItem,
  onSubmitAll,
  onDeleteItem,
}) => {
  const items = useMemo(() => {
    if (type === Event.Unavailability)
      return (data as UnavailabilityItemForm[]).map(
        ({ startDate, endDate }, i) => {
          const leftTime = dayjs(startDate).format("HH:mm");
          const rightTime = dayjs(endDate).format("HH:mm");
          return (
            <MiniEvent
              key={i}
              type={Event.Unavailability}
              color="red"
              title={`${startDate.getDate()} ${startDate.toLocaleString(
                "fr-FR",
                {
                  month: "long",
                }
              )} ${startDate.getFullYear()}`}
              description=""
              infoLeft={[leftTime, rightTime]}
              onDelete={() => onDeleteItem(i)}
            />
          );
        }
      );
    else if (type === Event.InternalWork)
      return (data as InternalWorkItemForm[]).map((event, i) => {
        const { date, duration, description } = event;
        return (
          <MiniEvent
            key={i}
            type={Event.InternalWork}
            title={`${date.getDate()} ${date.toLocaleString("fr-FR", {
              month: "long",
            })} ${date.getFullYear()}`}
            description={description || "Sans description"}
            infoLeft={`${duration.toFixed(2)}h`}
            onDelete={() => onDeleteItem(i)}
          />
        );
      });
  }, [data, onDeleteItem, type]);

  return (
    <FormListSC>
      <FormListInputsSC onSubmit={onSubmitItem}>
        {children}
        <Button color="blue" type="submit" leftIcon={<Add16 />}>
          Ajouter
        </Button>
      </FormListInputsSC>
      <FormListDataSC>
        {items}
        <Button
          color="green"
          disabled={disabled}
          leftIcon={<Checkmark16 />}
          onClick={onSubmitAll}
        >
          Valider
        </Button>
      </FormListDataSC>
    </FormListSC>
  );
};

export const FormListSC = styled("div", BoxSC, {
  marginBottom: "$128",
  width: "100%",
  maxWidth: "$384",
  minWidth: "$256",
  "& > * + *": {
    marginTop: "$16",
  },
});

export const FormListInputsSC = styled("form", {
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  gap: "$16",
});

export const FormListDataSC = styled("form", {
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  gap: "$16",
});
