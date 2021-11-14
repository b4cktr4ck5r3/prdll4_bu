import { redirectIfNotAdmin } from "@components/hoc";
import { AdminHomeTemplate } from "@components/templates";
import { GetStaticProps, NextPage } from "next";

const Admin: NextPage = () => <AdminHomeTemplate />;

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

export default redirectIfNotAdmin(Admin);
