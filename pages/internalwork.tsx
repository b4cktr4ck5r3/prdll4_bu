import { redirectIfUnauthenticated } from "@components/hoc";
import { InternalWorkTemplate } from "@components/templates";
import { GetStaticProps, NextPage } from "next";

const InternalWork: NextPage = () => <InternalWorkTemplate />;

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

export default redirectIfUnauthenticated(InternalWork);
