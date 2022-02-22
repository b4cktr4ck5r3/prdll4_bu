import { Pen20, TrashCan20 } from "@carbon/icons-react";
import { InternalWorkFormType, internalWorkInputs } from "@data/form";
import { ActionIcon, Text, Button, Modal } from "@mantine/core";
import { UseForm } from "@mantine/hooks/lib/use-form/use-form";
import { useModals } from "@mantine/modals";
import { modalsContext } from "@mantine/modals/lib/context";
import { styled, VariantProps } from "@stitches";
import axios from "axios";
import { FC, useMemo, useState } from "react";
import { BasicForm, BasicFormProps } from "..";
import { Event } from '@utils/calendar'
import { UnavailabilityFormType, unavailabilityInputs } from "@data/form/unavailability";

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
  title: string;
  description: string;
  infoLeft: string | [string, string];
  onDelete?: () => void;
  onEdit?: (data: InternalWorkFormType | UnavailabilityFormType) => void;
};

export const MiniEvent: FC<MiniEventProps> = ({
  color,
  title,
  description,
  infoLeft,
  onDelete,
  onEdit = () => null,
  type
}) => {
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
    if (type === Event.InternalWork) {
      return internalWorkInputs();
    } else if (type === Event.Unavailability) {
      return unavailabilityInputs();
    }
    else return {
      initialValues: {},
      labels: {},
      typeInputs: {}
    }
  }, [type]);

  const openConfirmDeleteModal = () =>
    modals.openConfirmModal({
      title: <Text weight={700}>Êtes-vous sûr de supprimer cet élément ?</Text>,
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
    });

  const [formEvent, setFormEvent] = useState<UseForm<InternalWorkFormType | UnavailabilityFormType>>();
const [openedEdit, setOpenedEdit] =useState(false);

    const FormElement = useMemo(() => {
      return (<BasicForm
        {...basicFormProps}
        setForm={(form: UseForm<InternalWorkFormType | UnavailabilityFormType>) => setFormEvent(form)}
        />)
        
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
      opened={openedEdit}
      onClose={() => setOpenedEdit(false)}
      title="Modification d'un élément"
      centered
    >
      <form onSubmit={formEvent?.onSubmit((data) => {
        onEdit(data);
        setOpenedEdit(false);
      })}>{FormElement}<Button type="submit" color="orange">Modifier</Button>
      <Button onClick={() => {
        setOpenedEdit(false);
        formEvent?.reset();
      }}>Annuler</Button>
  </form>
  </Modal>
      
      {onDelete && (
        <MiniEventButtonsSC>
          <ActionIcon variant="default" onClick={() => setOpenedEdit(true)}>
            <Pen20 />
          </ActionIcon>
          <ActionIcon variant="default" onClick={openConfirmDeleteModal}>
            <TrashCan20 color="red" />
          </ActionIcon>
        </MiniEventButtonsSC>
      )}
    </MiniEventSC>
  );
};
