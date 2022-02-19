import { DefaultLayout } from "@components/layouts";
import { InternalWorkForm, SimplePlanning, History } from "@components/organisms";
import { PlanningContext } from "@lib/contexts";
import { styled } from "@stitches";
import { Event } from "@utils/calendar";
import { FC, useState } from "react";

export const InternalWorkTemplateSC = styled("div", {
  display: "flex",
  flexDirection: "column",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "$24",
  "@desktop": {
    alignItems: "flex-start",
    flexDirection: "row",
  },
});

export const InternalWorkTemplate: FC = () => {
  const [synchronizedDate, setSynchronizedDate] = useState(new Date());
  const [refresh, setRefresh] = useState(false);

  return (
    <PlanningContext.Provider
      value={{ refresh, synchronizedDate, setRefresh, setSynchronizedDate }}
    >
      <DefaultLayout>
        <InternalWorkTemplateSC>
          <SimplePlanning type={Event.InternalWork} />
          <InternalWorkForm />
          <History type={Event.InternalWork} />
        </InternalWorkTemplateSC>
      </DefaultLayout>
    </PlanningContext.Provider>
  );
};
