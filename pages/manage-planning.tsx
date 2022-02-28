import { redirectIfNotAdmin } from "@components/hoc";
import { ManagePlanningTemplate } from "@components/templates";
import { GetStaticProps, NextPage } from "next";

const Settings: NextPage = () => <ManagePlanningTemplate />;

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

export default redirectIfNotAdmin(Settings);
