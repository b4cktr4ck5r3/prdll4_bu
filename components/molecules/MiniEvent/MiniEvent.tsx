import { styled, VariantProps } from "@stitches";
import { FC, useMemo } from "react";
import { Pen20, TrashCan20 } from "@carbon/icons-react";
import { ActionIcon } from "@mantine/core";
import axios from "axios";

export const MiniEventButtonsSC = styled("div", {
  display: "flex",
  position: "absolute",
  top:"50%",
  right:0,
  transform:"translateY(-50%)",
  gap:"4px"
})

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
  title: string;
  description: string;
  infoLeft: string | [string, string];
  onDelete: () => void;
};

export const MiniEvent: FC<MiniEventProps> = ({
  color,
  title,
  description,
  infoLeft,
  onDelete
}) => {
  const startText = useMemo(() => {
    if (Array.isArray(infoLeft)) return infoLeft[0];
    else return infoLeft;
  }, [infoLeft]);
  const endText = useMemo(() => {
    if (Array.isArray(infoLeft)) return infoLeft[1];
    else return null;
  }, [infoLeft]);

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

      <MiniEventButtonsSC>
        <ActionIcon variant="default">
          <Pen20/>
        </ActionIcon>
        <ActionIcon variant="default" onClick={onDelete}>
          <TrashCan20 color="red"/>
        </ActionIcon>
      </MiniEventButtonsSC>

    </MiniEventSC>
  );
};
