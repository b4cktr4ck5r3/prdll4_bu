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
import { FC, useMemo } from "react";

type FormListProps = {
  type: Event;
  data: (InternalWorkItemForm | UnavailabilityItemForm)[];
  disabled?: boolean;
  onSubmitAll: () => void;
  onSubmitItem: () => void;
};

export const FormList: FC<FormListProps> = ({
  children,
  data,
  type,
  disabled,
  onSubmitItem,
  onSubmitAll,
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
              color="red"
              title={`${startDate.getDate()} ${startDate.toLocaleString(
                "default",
                {
                  month: "long",
                }
              )} ${startDate.getFullYear()}`}
              description=""
              infoLeft={[leftTime, rightTime]}
            />
          );
        }
      );
    else if (type === Event.InternalWork)
      return (data as InternalWorkItemForm[]).map(
        ({ date, duration, description }, i) => (
          <MiniEvent
            key={i}
            title={`${date.getDate()} ${date.toLocaleString("default", {
              month: "long",
            })} ${date.getFullYear()}`}
            description={description || "Sans description"}
            infoLeft={`${duration}h`}
          />
        )
      );
  }, [data, type]);

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
