import { redirectIfUnauthenticated } from "@components/hoc";
import { UnavailabilityTemplate } from "@components/templates";
import { GetStaticProps, NextPage } from "next";

const Unavailability: NextPage = () => <UnavailabilityTemplate />;

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};

export default redirectIfUnauthenticated(Unavailability);
