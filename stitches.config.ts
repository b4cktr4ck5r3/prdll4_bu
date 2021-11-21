import type * as Stitches from "@stitches/react";
import { createStitches, PropertyValue } from "@stitches/react";
import colors from "open-color/open-color.json";

export const { createTheme, styled, getCssText, globalCss, config, theme } =
  createStitches({
    theme: {
      shadows: {
        box: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
      },
      borderStyles: {
        solid: "solid",
      },
      borderWidths: {
        0: "0",
        1: "1px",
        2: "2px",
        3: "3px",
        4: "4px",
        8: "8px",
      },
      radii: {
        none: "0px",
        sm: "0.125rem",
        base: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        full: "9999px",
      },
      letterSpacings: {
        tighter: "-0.05em",
        tight: "-0.025em",
        normal: "0em",
        wide: "0.025em",
        wider: "0.05em",
        widest: "0.1em",
      },
      fonts: {
        main: "Roboto, sans-serif",
      },
      fontWeights: {
        regular: 400,
        bold: 700,
      },
      colors: {
        white: "white",

        primary0: colors.blue[0],
        primary1: colors.blue[1],
        primary2: colors.blue[2],
        primary3: colors.blue[3],
        primary4: colors.blue[4],
        primary5: colors.blue[5],
        primary6: colors.blue[6],
        primary7: colors.blue[7],
        primary8: colors.blue[8],
        primary9: colors.blue[9],

        red0: colors.red[0],
        red1: colors.red[1],
        red2: colors.red[2],
        red3: colors.red[3],
        red4: colors.red[4],
        red5: colors.red[5],
        red6: colors.red[6],
        red7: colors.red[7],
        red8: colors.red[8],
        red9: colors.red[9],

        orange0: colors.orange[0],
        orange1: colors.orange[1],
        orange2: colors.orange[2],
        orange3: colors.orange[3],
        orange4: colors.orange[4],
        orange5: colors.orange[5],
        orange6: colors.orange[6],
        orange7: colors.orange[7],
        orange8: colors.orange[8],
        orange9: colors.orange[9],

        neutral0: colors.gray[0],
        neutral1: colors.gray[1],
        neutral2: colors.gray[2],
        neutral3: colors.gray[3],
        neutral4: colors.gray[4],
        neutral5: colors.gray[5],
        neutral6: colors.gray[6],
        neutral7: colors.gray[7],
        neutral8: colors.gray[8],
        neutral9: colors.gray[9],

        background: "$white",

        transparent: "$transparent",
        overlay: "$blackA10",
      },
      fontSizes: {
        xs: "12px",
        sm: "14px",
        base: "16px",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
        "5xl": "3rem",
        "6xl": "3.75rem",
        "7xl": "4.5rem",
        "8xl": "6rem",
        "9xl": "8rem",
      },
      lineHeights: {
        xs: "1rem",
        sm: "1.25rem",
        base: "1.5rem",
        lg: "1.75rem",
        xl: "1.75rem",
        "2xl": "2rem",
        "3xl": "2.25rem",
        "4xl": "2.5rem",
        "5xl": "1",
        "6xl": "1",
        "7xl": "1",
        "8xl": "1",
        "9xl": "1",
      },
      sizes: {
        0: "0px",
        1: "1px",
        2: "2px",
        4: "4px",
        8: "8px",
        12: "12px",
        16: "16px",
        24: "24px",
        32: "32px",
        48: "48px",
        64: "64px",
        96: "96px",
        128: "128px",
        192: "192px",
        256: "256px",
        384: "384px",
        512: "512px",
        640: "640px",
        768: "768px",
        1024: "1024px",
        1280: "1280px",
        full: "100%",
        max: "max-content",
        min: "min-content",
        "w-screen": "100vw",
        "h-screen": "100vh",
        sidebar: "280px",
      },
      space: {
        0: "0px",
        1: "1px",
        2: "2px",
        4: "4px",
        8: "8px",
        12: "12px",
        16: "16px",
        24: "24px",
        32: "32px",
        48: "48px",
        64: "64px",
        96: "96px",
        128: "128px",
        192: "192px",
        256: "256px",
        384: "384px",
        sidebar: "280px",
      },
      zIndices: {
        0: 0,
        10: 10,
        20: 20,
        30: 30,
        40: 40,
        50: 50,
      },
    },
    media: {
      tablet: "(min-width: 768px)",
      desktop: "(min-width: 1024px)",
      widescreen: "(min-width: 1216px)",
      fullhd: "(min-width: 1408px)",

      mobile: "(max-width: 767px)",
      touch: "(max-width: 1023px)",

      untilWidescreen: "(max-width: 1215px)",
      untilFullhd: "(max-width: 1407px)",

      tabletOnly: "(min-width: 768px and max-width: 1023px)",
      desktopOnly: "(min-width: 1024px and max-width: 1215px)",
      widescreenOnly: "(min-width: 1216px and max-width: 1407px)",
    },
    utils: {
      fontSize: (value: PropertyValue<"fontSize">) => ({
        fontSize: value,
        lineHeight: value,
      }),
      brTop: (value: PropertyValue<"borderRadius">) => ({
        borderTopLeftRadius: value,
        borderTopRightRadius: value,
      }),
      mx: (value: PropertyValue<"margin">) => ({
        marginLeft: value,
        marginRight: value,
      }),
      my: (value: PropertyValue<"margin">) => ({
        marginTop: value,
        marginBottom: value,
      }),
      px: (value: PropertyValue<"padding">) => ({
        paddingLeft: value,
        paddingRight: value,
      }),
      py: (value: PropertyValue<"padding">) => ({
        paddingTop: value,
        paddingBottom: value,
      }),
      spaceX: (value: PropertyValue<"margin">) => ({
        "& > * + *": {
          marginLeft: value,
        },
      }),
      spaceY: (value: PropertyValue<"margin">) => ({
        "& > * + *": {
          marginTop: value,
        },
      }),
    },
  });

export const globalStyles = globalCss({
  "html, body": {
    overscrollBehaviorY: "none",
    scrollBehavior: "smooth",
    scrollPaddingTop: "10px",
    overflowX: "hidden",
  },
  ".mantine-date-picker-dropdownWrapper": {
    textAlign: "center",
  },
  body: {
    background: "$background",
    color: "black",
    fontFamily: "$main",
    fontSize: "$base",
    fontWeight: "$regular",
    position: "relative",
  },
  'input[type="checkbox"]': {
    appearance: "none",
  },
});

export const paddingVariants = Object.keys(theme.space).reduce(
  (acc, cur) => ({ ...acc, [cur]: { $$padding: theme.space[cur] } }),
  {}
) as Record<keyof typeof theme.space, CSS>;

export const spaceVariants = Object.keys(theme.space).reduce(
  (acc, cur) => ({ ...acc, [cur]: { $$space: theme.space[cur] } }),
  {}
) as Record<keyof typeof theme.space, CSS>;

export type CSS = Stitches.CSS<typeof config>;
export type VariantProps<T> = Stitches.VariantProps<T>;
export type { IntrinsicElementsKeys } from "@stitches/react/types/styled-component";
