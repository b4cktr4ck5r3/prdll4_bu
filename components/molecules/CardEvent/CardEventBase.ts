import { styled } from "@stitches";

export const CardEventBase = styled("div", {
  ".card-event-title": {
    fontWeight: "bold",
  },
  ".card-event-date": {
    whiteSpace: "break-spaces",
    "&::first-letter": {
      textTransform: "uppercase",
    },
  },
  ".card-event-text": {
    whiteSpace: "break-spaces",
  },
});
