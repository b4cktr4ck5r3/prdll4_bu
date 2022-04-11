import { Pen20, TrashCan20 } from "@carbon/icons-react";
import { BasicForm, BasicFormProps } from "@components/molecules/BasicForm";
import { InternalWorkFormType, internalWorkInputs } from "@data/form";
import {
  UnavailabilityFormType,
  unavailabilityInputs,
} from "@data/form/unavailability";
import { ActionIcon, Button, Modal, Text } from "@mantine/core";
import { UseForm } from "@mantine/hooks/lib/use-form/use-form";
import { useModals } from "@mantine/modals";
import { styled, VariantProps } from "@stitches";
import {
  Event,
  InternalWorkEventSimplified,
  UnavailabilityEventSimplified,
} from "@utils/calendar";
import dayjs from "dayjs";
import { FC, ReactNode, useCallback, useMemo, useState } from "react";

export const MiniEventButtonsSC = styled("div", {
  display: "flex",
  position: "absolute",
  top: "50%",
  right: 0,
  transform: "translateY(-50%)",
  gap: "4px",
});

export const MiniEventTimeSC = styled("div", {
  position: "absolute",
  left: "25px",
  top: "50%",
  transform: "translate(-50%, -50%)",

  ".start": {
    fontWeight: "$bold",
    fontSize: "$lg",
    color: "$neutral9",
  },
  ".end": {
    fontSize: "$sm",
    color: "$neutral6",
  },
});

export const MiniEventTitleSC = styled("div", {
  position: "relative",
  display: "flex",
  flexDirection: "column",
  paddingLeft: "68px",
  minHeight: "$48",
  "&::before": {
    content: "''",
    position: "absolute",
    left: "60px",
    top: "$0",
    bottom: "$0",
    width: "4px",
    borderRadius: "$lg",
  },
  ".event-title": {
    fontSize: "$lg",
    fontWeight: "$bold",
    margin: "auto 0",
  },
  ".event-name": {
    whiteSpace: "break-spaces",
    paddingRight: "64px",
  },
  variants: {
    color: {
      default: {
        "&::before": {
          background: "$primary7",
        },
      },
      red: {
        "&::before": {
          background: "$red7",
        },
      },
    },
  },
  defaultVariants: {
    color: "default",
  },
});

export const MiniEventSC = styled("div", {
  position: "relative",
  minHeight: "$48",
});

export type MiniEventProps = VariantProps<typeof MiniEventTitleSC> & {
  type: Event;
  event?: InternalWorkEventSimplified | UnavailabilityEventSimplified;
  title: string;
  description: ReactNode;
  infoLeft: string | [string, string];
  allowEdit?: boolean;
  onDelete?: () => void;
  onEdit?: (data: InternalWorkFormType | UnavailabilityFormType) => void;
};

export const MiniEvent: FC<MiniEventProps> = ({
  color,
  title,
  description,
  infoLeft,
  allowEdit = false,
  onDelete,
  onEdit,
  event,
  type,
}) => {
  const [formEvent, setFormEvent] =
    useState<UseForm<InternalWorkFormType | UnavailabilityFormType>>();
  const [openedEdit, setOpenedEdit] = useState(false);

  const startText = useMemo(() => {
    if (Array.isArray(infoLeft)) return infoLeft[0];
    else return infoLeft;
  }, [infoLeft]);
  const endText = useMemo(() => {
    if (Array.isArray(infoLeft)) return infoLeft[1];
    else return null;
  }, [infoLeft]);

  const modals = useModals();

  const basicFormProps = useMemo<BasicFormProps>(() => {
    if (type === Event.InternalWork && event) {
      return internalWorkInputs({
        date: new Date(event.date.year, event.date.month, event.date.date),
        description: (event as InternalWorkEventSimplified).description,
        duration: (event as InternalWorkEventSimplified).duration,
      });
    } else if (type === Event.Unavailability && event) {
      return unavailabilityInputs({
        date: new Date(event.date.year, event.date.month, event.date.date),
        time: [
          (event as UnavailabilityEventSimplified).startDate,
          (event as UnavailabilityEventSimplified).endDate,
        ],
      });
    } else
      return {
        initialValues: {},
        labels: {},
        typeInputs: {},
      };
  }, [event, type]);

  const openConfirmDeleteModal = useCallback(
    () =>
      modals.openConfirmModal({
        title: (
          <Text weight={700}>Êtes-vous sûr de supprimer cet élément ?</Text>
        ),
        children: (
          <Text size="sm">
            {
              "ATTENTION ! La suppression est définitive, êtes vous sur de vouloir supprimer l'élément ?"
            }
          </Text>
        ),
        labels: {
          confirm: "Supprimer",
          cancel: "Annuler",
        },
        confirmProps: {
          color: "red",
        },
        onCancel: () => null,
        onConfirm: onDelete,
      }),
    [modals, onDelete]
  );

  const FormElement = useMemo(() => {
    return (
      <BasicForm
        {...basicFormProps}
        setForm={(
          form: UseForm<InternalWorkFormType | UnavailabilityFormType>
        ) => setFormEvent(form)}
      />
    );
  }, [basicFormProps]);

  return (
    <MiniEventSC>
      <MiniEventTitleSC color={color}>
        <span className={`event-title ${description ? "" : "center"}`}>
          {title}
        </span>
        <span className="event-name">{description}</span>
      </MiniEventTitleSC>

      <MiniEventTimeSC>
        <div className="start">{startText}</div>
        <div className="end">{endText}</div>
      </MiniEventTimeSC>
      <Modal
        opened={allowEdit && openedEdit}
        onClose={() => setOpenedEdit(false)}
        title="Modification d'un élément"
        centered
      >
        <form
          onSubmit={formEvent?.onSubmit((data) => {
            if (type === Event.Unavailability) {
              //TODO: voir si on peut améliorer ce morceau de code
              const {
                date,
                time: [startDate, endDate],
              } = data as UnavailabilityFormType;

              const start = dayjs(date)
                .second(0)
                .minute(startDate.getMinutes())
                .hour(startDate.getHours());

              const end = dayjs(date)
                .second(0)
                .minute(endDate.getMinutes())
                .hour(endDate.getHours());

              data = {
                date: date,
                time: [start.toDate(), end.toDate()],
              };
            }

            if (onEdit) onEdit(data);
            setOpenedEdit(false);
          })}
        >
          {FormElement}
          <Button mt="sm" type="submit" color="orange">
            Modifier
          </Button>
          <Button
            mt="sm"
            onClick={() => {
              setOpenedEdit(false);
              formEvent?.reset();
            }}
          >
            Annuler
          </Button>
        </form>
      </Modal>

      <MiniEventButtonsSC>
        {onEdit && allowEdit && (
          <ActionIcon variant="default" onClick={() => setOpenedEdit(true)}>
            <Pen20 />
          </ActionIcon>
        )}

        {onDelete && allowEdit && (
          <ActionIcon variant="default" onClick={openConfirmDeleteModal}>
            <TrashCan20 color="red" />
          </ActionIcon>
        )}
      </MiniEventButtonsSC>
    </MiniEventSC>
  );
};
