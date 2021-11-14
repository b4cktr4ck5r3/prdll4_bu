import { DefaultLayout } from "@components/layouts";
import { SimplePlanning } from "@components/organisms";
import { Button } from "@mantine/core";
import { styled } from "@stitches";
import { Role } from "@utils/user";
import axios from "axios";
import Link from "next/link";
import { FC, useEffect, useState } from "react";

export const HomeTemplateSC = styled("div", {
  "& > * + *": {
    marginTop: "$24",
  },
});

export const HomeTemplate: FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    axios
      .get<{ role: Role }>("/api/user/role")
      .then(({ data }) => setIsAdmin(data.role === Role.ADMIN));
  }, []);

  return (
    <DefaultLayout>
      <HomeTemplateSC>
        {isAdmin && (
          <Link href="/admin">
            <a>
              <Button>Passer en mode admin</Button>
            </a>
          </Link>
        )}
        <SimplePlanning />
      </HomeTemplateSC>
    </DefaultLayout>
  );
};
