import { redirectIfNotAdmin } from "@components/hoc";
import { ManagePlanningTemplate } from "@components/templates";
import { GetStaticProps, NextPage } from "next";

const ManagePlanning: NextPage = () => <ManagePlanningTemplate />;

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

export default redirectIfNotAdmin(ManagePlanning);
