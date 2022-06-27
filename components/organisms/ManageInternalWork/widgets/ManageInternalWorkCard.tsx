import { Button } from "@mantine/core";
import { styled } from "@stitches/react";
import { InternalWorkFull } from "@utils/internalWork";
import axios from "axios";
import { FC, useCallback, useMemo } from "react";

export type ManageInternalWorkCardProps = {
  internalWork: InternalWorkFull;
  onChange?: () => void;
};

export const ManageInternalWorkCardSC = styled("div", {
  ".miw-row": {
    ".miw-row--label": {
      fontWeight: "bold",
    },
    ".miw-row--value": {},
  },
  ".miw-actions": {
    marginTop: "$4",
    "& > * + *": {
      marginLeft: "$8",
    },
  },
});

export const ManageInternalWorkCard: FC<ManageInternalWorkCardProps> = ({
  internalWork,
  onChange = () => null,
}) => {
  const data = useMemo(() => {
    return [
      {
        label: "De",
        value: internalWork.user?.full_name || "Inconnu",
      },
      {
        label: "Date",
        value: new Date(internalWork.date).toLocaleDateString("fr-FR"),
      },
      {
        label: "Durée",
        value: `${internalWork.duration.toFixed(2)}H`,
      },
      {
        label: "Description",
        value: internalWork.description,
      },
    ].filter(({ value }) => value.length > 0);
  }, [internalWork]);

  const deleteInternalWork = useCallback(() => {
    if (internalWork.id) {
      axios.post(`/api/internalWork/${internalWork.id}/decline`).then(onChange);
    }
  }, [internalWork.id, onChange]);

  const updateInternalWork = useCallback(() => {
    if (internalWork.id) {
      axios.post(`/api/internalWork/${internalWork.id}/approve`).then(onChange);
    }
  }, [internalWork.id, onChange]);

  const hasStatus = useMemo(() => {
    return internalWork.status !== null;
  }, [internalWork]);

  return (
    <ManageInternalWorkCardSC>
      {data.map((row, index) => (
        <div className="miw-row" key={index}>
          <span className="miw-row--label">{row.label} : </span>
          <span className="miw-row--value">{row.value}</span>
        </div>
      ))}
      {!hasStatus && (
        <div className="miw-actions">
          <Button compact onClick={updateInternalWork}>
            Valider
          </Button>
          <Button color="red" compact onClick={deleteInternalWork}>
            Supprimer
          </Button>
        </div>
      )}
    </ManageInternalWorkCardSC>
  );
};
