import { redirectIfNotAdmin } from "@components/hoc";
import { TimeReportTemplate } from "@components/templates";
import { GetStaticProps, NextPage } from "next";

const TimeReport: NextPage = () => <TimeReportTemplate />;

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

export default redirectIfNotAdmin(TimeReport);
