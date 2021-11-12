import { LoginTemplate } from "@components/templates";
import { redirectIfAuthenticated } from "@components/hoc";
import { GetStaticProps, NextPage } from "next";

const Login: NextPage = () => <LoginTemplate />;

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

export default redirectIfAuthenticated(Login);
