import { redirectIfUnauthenticated } from "@components/hoc";
import { HomeTemplate } from "@components/templates";
import { GetStaticProps, NextPage } from "next";

const Home: NextPage = () => <HomeTemplate />;

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

export default redirectIfUnauthenticated(Home);
