import { styled } from "@stitches";

export const BoxSC = styled("div", {
  background: "$white",
  boxShadow: "$box",
  borderRadius: "$lg",
  padding: "$16",
});

export const SettingBoxSC = styled("div", BoxSC, {
  ".title": {
    color: "$neutral9",
    marginBottom: "$12",
    fontSize: "$xl",
    fontWeight: "$bold",
    "&.center": {
      textAlign: "center",
    },
    "&.mb-xs": {
      marginBottom: "$4",
    },
  },
  ".sub-title": {
    color: "$neutral9",
    marginTop: "$8",
    marginBottom: "$4",
    fontWeight: "$bold",
  },
  "& > * + *": {
    marginTop: "$12",
  },
});

export const TimeReportBoxSC = styled("div", SettingBoxSC);
export const UsersBoxSC = styled("div", SettingBoxSC);
export const ScheduleBoxSC = styled("div", SettingBoxSC);
