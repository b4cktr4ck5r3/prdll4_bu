import { colors } from "@lib/opencolor";
import type * as Stitches from "@stitches/react";
import { createStitches, PropertyValue } from "@stitches/react";

export const bp = {
  tablet: 768,
  desktop: 1024,
  widescreen: 1216,
  fullhd: 1408,
};

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
        main: "Century Gothic, sans-serif",
      },
      fontWeights: {
        regular: 400,
        bold: 700,
      },
      colors: {
        ...colors,
        white: "white",

        primary0: "$blue0",
        primary1: "$blue1",
        primary2: "$blue2",
        primary3: "$blue3",
        primary4: "$blue4",
        primary5: "$blue5",
        primary6: "$blue6",
        primary7: "$blue7",
        primary8: "$blue8",
        primary9: "$blue9",

        neutral0: "$gray0",
        neutral1: "$gray1",
        neutral2: "$gray2",
        neutral3: "$gray3",
        neutral4: "$gray4",
        neutral5: "$gray5",
        neutral6: "$gray6",
        neutral7: "$gray7",
        neutral8: "$gray8",
        neutral9: "$gray9",

        background: "$white",
        transparent: "$transparent",
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
  "@font-face": [
    {
      fontDisplay: "swap",
      fontStyle: "normal",
      fontWeight: 400,
      fontFamily: "Century Gothic",
      src: 'url("/fonts/CenturyGothicRegular.woff2") format("woff2")',
    },
    {
      fontDisplay: "swap",
      fontStyle: "italic",
      fontWeight: 400,
      fontFamily: "Century Gothic",
      src: 'url("/fonts/CenturyGothicRegularItalic.woff2") format("woff2")',
    },
    {
      fontDisplay: "swap",
      fontStyle: "normal",
      fontWeight: 700,
      fontFamily: "Century Gothic",
      src: 'url("/fonts/CenturyGothicBold.woff2") format("woff2")',
    },
    {
      fontDisplay: "swap",
      fontStyle: "italic",
      fontWeight: 700,
      fontFamily: "Century Gothic",
      src: 'url("/fonts/CenturyGothicBoldItalic.woff2") format("woff2")',
    },
  ],
  "html, body": {
    overscrollBehaviorY: "none",
    scrollBehavior: "smooth",
    scrollPaddingTop: "10px",
  },
  ".mantine-date-picker-dropdownWrapper, .mantine-DatePicker-cell": {
    textAlign: "center",
  },
  body: {
    background: "$background",
    color: "$neutral9",
    fontFamily: "$main",
    fontSize: "$base",
    fontWeight: "$regular",
    position: "relative",
  },
  'input[type="checkbox"]': {
    appearance: "none",
  },
  ".capitalize": {
    textTransform: "capitalize",
  },
  ".hidden": {
    display: "none",
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
