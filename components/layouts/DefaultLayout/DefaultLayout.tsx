import { Thumbnail_232 } from "@carbon/icons-react";
import { NavBar, NavBarSC } from "@components/organisms";
import userOptions from "@data/navbar/userOptions";
import { Group, Title } from "@mantine/core";
import { useViewportSize, useWindowScroll } from "@mantine/hooks";
import { bp, styled } from "@stitches";
import { Role } from "@utils/user";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";

export const DefaultMainSC = styled("main", {
  padding: "$12",
});

export const DefaultLayoutSC = styled("div", {
  [`& ${NavBarSC}`]: {
    transition: "left 1.0s",
  },
  "@mobile": {
    [`& ${NavBarSC}`]: {
      left: "-$sidebar",
    },
    [`& ${DefaultMainSC}`]: {
      transition: "transform 1.0s",
    },
  },
  "@tablet": {
    [`& ${NavBarSC}`]: {
      left: 0,
    },
    [`& ${DefaultMainSC}`]: {
      marginLeft: "$sidebar",
      transition: "margin 1.0s",
    },
  },
  variants: {
    displayMenu: {
      true: {
        [`& ${NavBarSC}`]: {
          left: "0",
        },
        "@mobile": {
          [`& ${DefaultMainSC}`]: {
            transform: "translateX($sizes$sidebar)",
          },
        },
      },
      false: {
        "@tablet": {
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
  const [scroll] = useWindowScroll();

  useEffect(() => {
    if (width >= bp.tablet) setDisplayMenu(true);
    else setDisplayMenu(false);
  }, [width]);

  useEffect(() => {
    if (displayMenu && width < bp.tablet) {
      document.documentElement.style.overflowX = "hidden";
      document.body.style.overflowX = "hidden";
    }

    return () => {
      document.documentElement.style.overflowX = "initial";
      document.body.style.overflowX = "initial";
    };
  }, [width, displayMenu]);

  useEffect(() => {
    if (width < bp.tablet) {
      setDisplayMenu(false);
    }
  }, [scroll, width]);

  return (
    <DefaultLayoutSC displayMenu={displayMenu}>
      <NavBar
      //  color={mode === Role.ADMIN ? "orange" : "default"}
      />
      <DefaultMainSC
        onClick={() => {
          if (displayMenu && width < bp.tablet) {
            setDisplayMenu(false);
          }
        }}
      >
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
