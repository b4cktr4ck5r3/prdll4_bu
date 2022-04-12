import { styled } from "@stitches";

export const CardEventBase = styled("div", {
  border: "1px solid $neutral3",
  padding: "6px 12px",
  borderRadius: "6px",
  position: "relative",
  paddingRight: "48px",
  ".card-event-title": {
    fontWeight: "bold",
  },
  ".card-event-date": {
    whiteSpace: "break-spaces",
    "&::first-letter": {
      textTransform: "uppercase",
    },
  },
  ".card-event-dates": {
    "& > span": {
      textTransform: "capitalize",
    },
  },
  ".card-event-text": {
    whiteSpace: "break-spaces",
  },
  ".right-button": {
    position: "absolute",
    top: "50%",
    right: "12px",
    transform: "translateY(-50%)",
  },
});
