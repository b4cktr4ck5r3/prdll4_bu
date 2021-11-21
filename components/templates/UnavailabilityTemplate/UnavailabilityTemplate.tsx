import { DefaultLayout } from "@components/layouts";
import { SimplePlanning, UnavailabilityForm } from "@components/organisms";
import { PlanningContext } from "@lib/contexts";
import { styled } from "@stitches";
import { Event } from "@utils/calendar";
import { FC, useState } from "react";

export const UnavailabilityTemplateSC = styled("div", {
  display: "flex",
  flexDirection: "column",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "$24",
  "@tablet": {
    alignItems: "flex-start",
    flexDirection: "row",
  },
});

export const UnavailabilityTemplate: FC = () => {
  const [synchronizedDate, setSynchronizedDate] = useState(new Date());
  const [refresh, setRefresh] = useState(false);

  return (
    <PlanningContext.Provider
      value={{ refresh, synchronizedDate, setRefresh, setSynchronizedDate }}
    >
      <DefaultLayout>
        <UnavailabilityTemplateSC>
          <SimplePlanning type={Event.Unavailability} />
          <UnavailabilityForm />
        </UnavailabilityTemplateSC>
      </DefaultLayout>
    </PlanningContext.Provider>
  );
};
