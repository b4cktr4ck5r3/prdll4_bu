import { DefaultLayout } from "@components/layouts";
import { InternalWorkForm, SimplePlanning } from "@components/organisms";
import { PlanningContext } from "@lib/contexts";
import { styled } from "@stitches";
import { FC, useState } from "react";

export const InternalWorkTemplateSC = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  "& > * + *": {
    marginTop: "$24",
  },
  "@md": {
    alignItems: "flex-start",
    flexDirection: "row",
    "& > * + *": {
      marginTop: "$0",
      marginLeft: "$24",
    },
  },
});

export const InternalWorkTemplate: FC = () => {
  const [refresh, setRefresh] = useState(false);

  return (
    <PlanningContext.Provider value={{ refresh, setRefresh }}>
      <DefaultLayout>
        <InternalWorkTemplateSC>
          <SimplePlanning />
          <InternalWorkForm />
        </InternalWorkTemplateSC>
      </DefaultLayout>
    </PlanningContext.Provider>
  );
};
