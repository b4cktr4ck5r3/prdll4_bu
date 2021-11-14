import { styled, VariantProps } from "@stitches";
import { FC, useMemo } from "react";

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
  span: {
    display: "block",
  },
  ".event-title": {
    fontSize: "$lg",
    fontWeight: "$bold",
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
};

export const MiniEvent: FC<MiniEventProps> = ({
  color,
  title,
  description,
  infoLeft,
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
        <span className="event-title">{title}</span>
        <span className="event-name">{description}</span>
      </MiniEventTitleSC>
      <MiniEventTimeSC>
        <div className="start">{startText}</div>
        <div className="end">{endText}</div>
      </MiniEventTimeSC>
    </MiniEventSC>
  );
};
