import {
  CardEventInternalWork,
  CardEventSimplifiedWST,
} from "@components/molecules/CardEvent";
import { useTimeReports } from "@hooks";
import { Accordion, Button, Divider, Group, Modal, Text } from "@mantine/core";
import { styled } from "@stitches";
import {
  CalculDeclaredHours,
  FormatDateText,
  SplitTimeReport,
} from "@utils/timeReport";
import axios from "axios";
import { FC, useCallback, useEffect, useMemo, useState } from "react";

export const DetailTimeReportSC = styled("div", {});

export type DetailTimeReportProps = {
  userId: string;
  timeReportId: string | null;
  onClose: () => void;
};

export const DetailTimeReport: FC<DetailTimeReportProps> = ({
  userId,
  timeReportId,
  onClose,
}) => {
  const { timeReports, mutate } = useTimeReports({ userId });
  const [prevalidated, setPrevalidated] = useState(false);

  const timeReport = useMemo(
    () => timeReports.find(({ id }) => id === timeReportId),
    [timeReportId, timeReports]
  );

  useEffect(() => {
    setPrevalidated(false);
  }, [userId, timeReportId]);

  const ValidateTimeReport = useCallback(() => {
    if (timeReportId)
      axios
        .post(`/api/timeReport/${timeReportId}/validate`)
        .then(() => mutate())
        .then(onClose)
        .then(() => setPrevalidated(false));
  }, [mutate, onClose, timeReportId]);

  const DeleteTimeReport = useCallback(() => {
    if (timeReportId)
      axios
        .delete(`/api/timeReport/${timeReportId}`)
        .then(() => mutate())
        .then(onClose);
  }, [mutate, onClose, timeReportId]);

  if (timeReport) {
    const startDate = new Date(timeReport.startDate);
    const endDate = new Date(timeReport.endDate);

    const { extraItems, internalWorks, workScheduleTasks } = timeReport;
    const { declaredHours, sumInternalWorks, sumWorkScheduleTasks } =
      CalculDeclaredHours(internalWorks, workScheduleTasks, extraItems);

    const { currentIW, currentWST, previousIW, previousWST } =
      SplitTimeReport(timeReport);

    return (
      <DetailTimeReportSC>
        <Modal
          opened={!prevalidated}
          onClose={onClose}
          size={640}
          title={
            <h2 style={{ fontWeight: "bold", fontSize: "20px" }}>
              <span style={{ textTransform: "capitalize" }}>
                {FormatDateText(startDate)}
              </span>{" "}
              -{" "}
              <span style={{ textTransform: "capitalize" }}>
                {FormatDateText(endDate)}
              </span>
            </h2>
          }
        >
          <Accordion mb={"sm"}>
            {previousIW.length > 0 && (
              <Accordion.Item
                label={`Travaux internes à rattraper (${previousIW.length})`}
              >
                <Group direction="column" align={"stretch"}>
                  {previousIW.map((iw) => (
                    <CardEventInternalWork
                      key={iw.id}
                      timeReportId={timeReport.id}
                      internalWork={iw}
                      buttonType={!timeReport.validated ? "REPORT" : undefined}
                      buttonCallback={() => mutate()}
                    />
                  ))}
                </Group>
              </Accordion.Item>
            )}
            {previousWST.length > 0 && (
              <Accordion.Item
                label={`Séances à rattraper (${previousWST.length})`}
              >
                <Group direction="column" align={"stretch"}>
                  {previousWST.map((wst) => (
                    <CardEventSimplifiedWST
                      key={wst.id}
                      timeReportId={timeReport.id}
                      workScheduleTask={wst}
                      buttonType={!timeReport.validated ? "REPORT" : undefined}
                      buttonCallback={() => mutate()}
                    />
                  ))}
                </Group>
              </Accordion.Item>
            )}
            {currentIW.length > 0 && (
              <Accordion.Item
                label={`Travaux internes de la période (${currentIW.length})`}
              >
                <Group direction="column" align={"stretch"}>
                  {currentIW.map((iw) => (
                    <CardEventInternalWork
                      key={iw.id}
                      timeReportId={timeReport.id}
                      internalWork={iw}
                      buttonType={!timeReport.validated ? "REPORT" : undefined}
                      buttonCallback={() => mutate()}
                    />
                  ))}
                </Group>
              </Accordion.Item>
            )}
            {currentWST.length > 0 && (
              <Accordion.Item
                label={`Séances de la période (${currentWST.length})`}
              >
                <Group direction="column" align={"stretch"}>
                  {currentWST.map((wst) => (
                    <CardEventSimplifiedWST
                      key={wst.id}
                      timeReportId={timeReport.id}
                      workScheduleTask={wst}
                      buttonType={!timeReport.validated ? "REPORT" : undefined}
                      buttonCallback={() => mutate()}
                    />
                  ))}
                </Group>
              </Accordion.Item>
            )}
          </Accordion>
          <div>
            <div>{`Total d'heures des séances  : ${sumWorkScheduleTasks}h`}</div>
            <div>{`Total d'heures des travaux internes : ${sumInternalWorks.toFixed(
              2
            )}h`}</div>
            <Divider mt={"sm"} mb={"sm"} />
            <div>{`Formule du total des heures à déclarer : ${sumWorkScheduleTasks} + ${sumInternalWorks.toFixed(
              2
            )} + ((${sumWorkScheduleTasks} + ${sumInternalWorks.toFixed(
              2
            )}) / 5)`}</div>
            <div
              style={{ fontWeight: "bold" }}
            >{`Total des heures à déclarer : ${declaredHours.toFixed(
              2
            )}h`}</div>
          </div>
          <Divider mt={"sm"} mb={"sm"} />
          {timeReport.validated ? (
            <Text weight={"bold"}>
              Statut :{" "}
              <Text color="green" weight={"bold"} component="span">
                Validé
              </Text>
            </Text>
          ) : (
            <Group>
              <Button
                onClick={() => setPrevalidated(true)}
                color={"blue"}
                compact
              >
                Confirmer
              </Button>
              <Button color="red" compact onClick={DeleteTimeReport}>
                Supprimer
              </Button>
            </Group>
          )}
        </Modal>
        <Modal
          opened={prevalidated}
          onClose={() => setPrevalidated(false)}
          title={
            <h2 style={{ fontWeight: "bold", fontSize: "20px" }}>
              {"Confirmer l'état horaire"}
            </h2>
          }
        >
          <Group>
            <Button onClick={() => ValidateTimeReport()} color={"blue"}>
              Confirmer
            </Button>
            <Button color="red" onClick={() => setPrevalidated(false)}>
              Annuler
            </Button>
          </Group>
        </Modal>
      </DetailTimeReportSC>
    );
  } else return null;
};
