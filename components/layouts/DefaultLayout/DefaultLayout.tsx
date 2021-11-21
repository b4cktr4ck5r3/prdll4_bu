import { OpenPanelFilledLeft32 } from "@carbon/icons-react";
import { NavBar, NavBarSC } from "@components/organisms";
import userOptions from "@data/navbar/userOptions";
import { ActionIcon, Group, Title } from "@mantine/core";
import { useScrollLock, useViewportSize } from "@mantine/hooks";
import { bp, styled } from "@stitches";
import { Role } from "@utils/user";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";

export const DefaultMainSC = styled("main", {
  padding: "$8 $16",
});

export const DefaultLayoutSC = styled("div", {
  ".open-menu": {
    marginLeft: 0,
    marginRight: 0,
    transform: "translateY(1px)",
  },
  "@mobile": {
    ".title-main": {
      fontSize: "28px",
    },
  },
  "@touch": {
    [`& ${NavBarSC}`]: {
      left: "-100vw",
      width: "100vw",
      transition: "left 0.6s",
    },
    [`& ${DefaultMainSC}`]: {
      transition: "transform 0.6s",
    },
  },
  "@desktop": {
    // NavBar always visible
    ".open-menu": {
      display: "none",
    },
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
      },
    },
  },
});

export type DefaultLayoutProps = {
  mode?: Role;
};

export const DefaultLayout: FC<DefaultLayoutProps> = ({ children }) => {
  const router = useRouter();
  const { width } = useViewportSize();
  const [displayMenu, setDisplayMenu] = useState(width >= bp.desktop);
  const [, setScrollLocked] = useScrollLock();

  useEffect(() => {
    if (width >= bp.desktop) setDisplayMenu(true);
    else setDisplayMenu(false);
  }, [width]);

  useEffect(() => {
    if (displayMenu && width < bp.desktop) {
      setScrollLocked(true);
    }

    return () => {
      setScrollLocked(false);
    };
  }, [displayMenu, width, setScrollLocked]);

  return (
    <DefaultLayoutSC displayMenu={displayMenu}>
      <NavBar
        closeMenu={() => {
          setDisplayMenu(false);
        }}
        onItemClick={() => {
          if (width < bp.desktop) setDisplayMenu(false);
        }}
      />
      <DefaultMainSC
        onClick={() => {
          if (displayMenu && width < bp.desktop) {
            setDisplayMenu(false);
          }
        }}
      >
        <Group mb="sm" align="center">
          <ActionIcon
            color="gray"
            size="xl"
            className="open-menu"
            onClick={() => setDisplayMenu(true)}
          >
            <OpenPanelFilledLeft32 />
          </ActionIcon>
          <Title className="title-main">
            {userOptions.find(({ path }) => path === router.pathname)?.label ||
              "Administrateur"}
          </Title>
        </Group>
        {children}
      </DefaultMainSC>
    </DefaultLayoutSC>
  );
};
