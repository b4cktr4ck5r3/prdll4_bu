import { Thumbnail_232 } from "@carbon/icons-react";
import { NavBar, NavBarSC } from "@components/organisms";
import userOptions from "@data/navbar/userOptions";
import { Group, Title } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { styled } from "@stitches";
import { Role } from "@utils/user";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";

export const DefaultMainSC = styled("main", {
  padding: "$12",
});

export const DefaultLayoutSC = styled("div", {
  [`& ${NavBarSC}`]: {
    left: "-$sidebar",
    transitionProperty: "left",
    transitionDuration: "1.0s",
  },
  [`& ${DefaultMainSC}`]: {
    transitionProperty: "transform, margin",
    transitionDuration: "1.0s",
  },
  "@desktop": {
    [`& ${NavBarSC}`]: {
      left: 0,
    },
    [`& ${DefaultMainSC}`]: {
      marginLeft: "$sidebar",
    },
  },
  variants: {
    displayMenu: {
      true: {
        [`& ${NavBarSC}`]: {
          left: "0",
        },
        [`& ${DefaultMainSC}`]: {
          transform: "translateX($sizes$sidebar)",
        },
        "@desktop": {
          [`& ${DefaultMainSC}`]: {
            transform: "none",
          },
        },
      },
      false: {
        "@desktop": {
          [`& ${NavBarSC}`]: {
            left: "-$sidebar",
          },
          [`& ${DefaultMainSC}`]: {
            marginLeft: "0",
          },
        },
      },
    },
  },
});

export type DefaultLayoutProps = {
  mode?: Role;
};

export const DefaultLayout: FC<DefaultLayoutProps> = ({
  children,
  // mode = Role.USER,
}) => {
  const router = useRouter();
  const { width } = useViewportSize();
  const [displayMenu, setDisplayMenu] = useState(width >= 1024);

  useEffect(() => {
    if (width >= 1024) setDisplayMenu(true);
    else setDisplayMenu(false);
  }, [width]);

  return (
    <DefaultLayoutSC displayMenu={displayMenu}>
      <NavBar
      //  color={mode === Role.ADMIN ? "orange" : "default"}
      />
      <DefaultMainSC>
        <Group spacing="xs" mb="sm">
          <Thumbnail_232
            style={{ cursor: "pointer" }}
            onClick={() => setDisplayMenu((value) => !value)}
          />
          <Title style={{ fontFamily: "roboto" }}>
            {userOptions.find(({ path }) => path === router.pathname)?.label ||
              "Administrateur"}
          </Title>
        </Group>
        {children}
      </DefaultMainSC>
    </DefaultLayoutSC>
  );
};
