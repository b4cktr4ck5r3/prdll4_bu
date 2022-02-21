import { redirectIfNotAdmin } from "@components/hoc";
import { UsersTemplate } from "@components/templates";
import { GetStaticProps, NextPage } from "next";

const Users: NextPage = () => <UsersTemplate />;

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

export default redirectIfNotAdmin(Users);
