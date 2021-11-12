import { redirectIfUnauthenticated } from "@components/hoc";
import { PlanningTemplate } from "@components/templates";
import { GetStaticProps, NextPage } from "next";

const Planning: NextPage = () => <PlanningTemplate />;

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

export default redirectIfUnauthenticated(Planning);
