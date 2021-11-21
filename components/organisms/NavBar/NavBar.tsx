import { Close32 } from "@carbon/icons-react";
import { CPlannerHorizontal } from "@components/icons";
import userOptions from "@data/navbar/userOptions";
import { Text } from "@mantine/core";
import { styled, VariantProps } from "@stitches";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC } from "react";
import { Scrollbars } from "react-custom-scrollbars";

export const MobileCloseIcon = styled("button", {
  color: "$white",
  height: "$32",
  width: "$32",
  position: "absolute",
  top: "18px",
  right: "$8",
  svg: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  "@desktop": {
    display: "none",
  },
});

export const NavListItemSC = styled("a", {
  cursor: "pointer",
  position: "relative",
  display: "flex",
  alignItems: "center",
  borderRadius: "$full",
  padding: "$16",
  "& > .label": {
    color: "$white",
    fontWeight: "$bold",
    marginLeft: "$12",
  },
  "@desktop": {
    borderBottomRightRadius: "$none",
    borderTopRightRadius: "$none",
  },
  variants: {
    active: {
      true: {
        background: "$white",
        color: "$primary7",
        "& > .label": {
          color: "$primary7",
        },
        "@desktop": {
          "&::before": {
            content: "''",
            position: "absolute",
            right: "0",
            top: "-50px",
            width: "50px",
            height: "50px",
            background: "transparent",
            borderRadius: "50%",
            boxShadow: "35px 35px 0 10px $colors$white",
            pointerEvents: "none",
          },
          "&::after": {
            content: "''",
            position: "absolute",
            right: "0",
            bottom: "-50px",
            width: "50px",
            height: "50px",
            background: "transparent",
            borderRadius: "50%",
            boxShadow: "35px -35px 0 10px $colors$white",
            pointerEvents: "none",
          },
        },
      },
    },
  },
});

export const NavListSC = styled("ul", {
  width: "100%",
  marginTop: "$32",
  paddingLeft: "$12",
  maxWidth: "$sidebar",
  "@touch": {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    marginLeft: "auto",
    marginRight: "auto",
  },
});

export const NavBarSC = styled("nav", {
  position: "fixed",
  paddingTop: "$12",
  paddingBottom: "$12",
  top: 0,
  color: "white",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "$w-screen",
  height: "$h-screen",
  overflow: "hidden",
  zIndex: "$30",
  ".close-menu-touch": {
    position: "absolute",
    top: "$16",
    right: "$8",
  },
  "@desktop": {
    width: "$sidebar",
  },
  "& > *:not(.shrink)": {
    flexShrink: 0,
  },
  variants: {
    color: {
      default: {
        background: "$primary7",
      },
      orange: {
        background: "$orange7",
      },
    },
  },
  defaultVariants: {
    color: "default",
  },
});

export type NavBarProps = VariantProps<typeof NavBarSC> & {
  closeMenu?: () => void;
  onItemClick?: () => void;
};

export const NavBar: FC<NavBarProps> = ({ closeMenu, color, onItemClick }) => {
  const router = useRouter();

  return (
    <NavBarSC color={color}>
      <MobileCloseIcon onClick={closeMenu}>
        <Close32 />
      </MobileCloseIcon>
      <CPlannerHorizontal />
      <Scrollbars className="shrink">
        <NavListSC>
          {userOptions.map(({ action, icon: Icon, label, path }) => (
            <li key={label}>
              <Link href={path} passHref>
                <NavListItemSC
                  active={router.pathname === path}
                  onClick={() => {
                    if (onItemClick) onItemClick();
                    if (action === "SignOut")
                      signOut({
                        callbackUrl: "/login",
                        redirect: true,
                      });
                  }}
                >
                  <Icon height={30} width={30} />
                  <Text className="label">{label}</Text>
                </NavListItemSC>
              </Link>
            </li>
          ))}
        </NavListSC>
      </Scrollbars>
    </NavBarSC>
  );
};
