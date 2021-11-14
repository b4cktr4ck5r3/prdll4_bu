import { redirectIfUnauthenticated } from "@components/hoc";
import { SettingsTemplate } from "@components/templates";
import { GetStaticProps, NextPage } from "next";

const Settings: NextPage = () => <SettingsTemplate />;

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

export default redirectIfUnauthenticated(Settings);
