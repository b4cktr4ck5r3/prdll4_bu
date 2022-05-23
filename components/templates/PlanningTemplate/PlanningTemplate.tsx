import { DefaultLayout } from "@components/layouts";
import { Planning, SimplePlanning } from "@components/organisms";
import { useViewportSize } from "@mantine/hooks";
import { bp, styled } from "@stitches";
import type { FC } from "react";

export const AlertSC = styled("p", {
  color: "orange",
  fontWeight: "bold",
  marginBottom: "$16",
});

export const PlanningTemplate: FC = () => {
  const { width } = useViewportSize();
  return (
    <DefaultLayout>
      {width < bp.desktop ? (
        <>
          <AlertSC>
            Vous devez être sur la version bureau pour voir les cours
          </AlertSC>
          <SimplePlanning />
        </>
      ) : (
        <Planning />
      )}
    </DefaultLayout>
  );
};
