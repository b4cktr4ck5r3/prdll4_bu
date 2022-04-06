import { GeneratePdf16 } from "@carbon/icons-react";
import useWorkScheduleTasks from "@hooks/useWorkScheduleTasks";
import { BigCalendarContext } from "@lib/contexts";
import { Button } from "@mantine/core";
import {
  Document,
  Page,
  PDFDownloadLink,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import {
  CompareDateToDateSimplified,
  DateSimplified,
  GetActiveWeekIndex,
  GetDaysInMonth,
} from "@utils/calendar";
import { CalendarView } from "@utils/calendar/Calendar";
import { FilterWorkScheduleTask } from "@utils/workScheduleTask/functions";
import dayjs from "dayjs";
import { FC, Fragment, useCallback, useContext, useMemo } from "react";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "white",
    padding: "6px 12px",
    fontFamily: "Century Gothic",
  },
  section: {
    marginBottom: "24px",
  },
  "week-title": {
    borderTop: "1px solid gray",
    paddingTop: "6px",
    fontSize: "18px",
    fontWeight: "bold",
    marginTop: "6px",
  },
  "day-title": {
    fontSize: "16px",
    fontWeight: "bold",
    marginTop: "8px",
    marginBottom: "5px",
  },
  "task-title": {
    fontSize: "14px",
    fontWeight: "bold",
  },
  "task-description": {
    fontSize: "12px",
    fontWeight: "normal",
    marginBottom: "4px",
  },
});

export const BigCalendarExportButton: FC = () => {
  const { dateSelected, excludedPlannings, excludedUsers, view } =
    useContext(BigCalendarContext);

  const isWeekView = useMemo(() => view === CalendarView.WEEK, [view]);

  const allWeeksOfDocument = useMemo(() => {
    const allWeeksOfMonth = GetDaysInMonth(dateSelected);
    const activeWeekIndex = GetActiveWeekIndex(dateSelected, allWeeksOfMonth);

    return allWeeksOfMonth.filter(
      (_, i) => !isWeekView || i === activeWeekIndex
    );
  }, [dateSelected, isWeekView]);

  const { startDate, endDate } = useMemo(() => {
    const firstDate = allWeeksOfDocument[0][0];
    const lastDate = allWeeksOfDocument[allWeeksOfDocument.length - 1][6];

    return {
      startDate: new Date(firstDate.year, firstDate.month, firstDate.date),
      endDate: new Date(lastDate.year, lastDate.month, lastDate.date),
    };
  }, [allWeeksOfDocument]);

  const { workScheduleTasks } = useWorkScheduleTasks({ startDate, endDate });

  const formatDate = useCallback((date: DateSimplified) => {
    const jsDate = new Date(date.year, date.month, date.date);
    const monthLabel = jsDate.toLocaleString("fr", { month: "long" });
    return `${date.date} ${monthLabel} ${date.year}`;
  }, []);

  const pdfDocument = useMemo(() => {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          {allWeeksOfDocument.map((week, index) => {
            const weekContent = week.map((date, index) => {
              const dayTasks = workScheduleTasks
                .filter(({ startDate }) =>
                  CompareDateToDateSimplified(new Date(startDate), date)
                )
                .filter(
                  FilterWorkScheduleTask(excludedPlannings, excludedUsers)
                );

              if (dayTasks.length === 0) return null;
              else
                return (
                  <Fragment key={index}>
                    <Text style={styles["day-title"]}>{formatDate(date)}</Text>
                    {dayTasks.map(({ name, startDate, endDate, id, users }) => (
                      <Fragment key={id}>
                        <Text style={styles["task-title"]}>
                          {`${dayjs(startDate).format("HH:mm")} - ${dayjs(
                            endDate
                          ).format("HH:mm")}`}{" "}
                          : <span style={{ fontWeight: "normal" }}>{name}</span>
                        </Text>
                        <Text style={styles["task-description"]}>
                          {users
                            .map(({ full_name }) => "@" + full_name)
                            .join("\n")}
                        </Text>
                      </Fragment>
                    ))}
                  </Fragment>
                );
            });

            if (weekContent.every((day) => day === null)) return null;
            else
              return (
                <View key={index} style={styles.section}>
                  <Text style={styles["week-title"]}>
                    Semaine du {formatDate(week[0])}
                  </Text>
                  {weekContent}
                </View>
              );
          })}
        </Page>
      </Document>
    );
  }, [
    allWeeksOfDocument,
    excludedPlannings,
    excludedUsers,
    formatDate,
    workScheduleTasks,
  ]);

  return (
    <PDFDownloadLink
      document={pdfDocument}
      fileName={`Export-${startDate.toISOString().substring(0, 10)}-${endDate
        .toISOString()
        .substring(0, 10)}.pdf`}
    >
      {({ loading }) => (
        <Button
          leftIcon={<GeneratePdf16 />}
          size="xs"
          variant="light"
          disabled={loading}
        >
          Export
        </Button>
      )}
    </PDFDownloadLink>
  );
};
