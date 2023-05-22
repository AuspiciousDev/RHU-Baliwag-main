import { createTheme } from "@mui/material/styles";
import "@fontsource/poppins";
import { createContext, useState, useMemo, useEffect } from "react";
export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        primary: {
          100: "#67a0aa",
          200: "#4d909c",
          300: "#34818d",
          400: "#1a717f",
          500: "#016171",
          600: "#015766",
          700: "#014e5a",
          800: "#01444f",
          900: "#013a44",
          950: "#013139",
        },

        secondary: {
          100: "#7cdfb8",
          200: "#66d9ac",
          300: "#50d4a0",
          400: "#3ace94",
          500: "#24c988",
          600: "#20b57a",
          700: "#1da16d",
          800: "#198d5f",
          900: "#167952",
        },
        black: {
          50: "#ffffff",
          100: "#FBFBFB",
          200: "#cccccc",
          300: "#b2b2b2",
          400: "#999999",
          500: "#7f7f7f",
          600: "#666666",
          700: "#4c4c4c",
          800: "#333333",
          900: "#101010",
          950: "#000000",
        },
        blackOnly: {
          500: "#000000",
        },
        whiteOnly: {
          500: "#ffffff",
        },
        redDark: {
          500: "#880808",
        },
        greenOnly: {
          500: "#016171",
        },
      }
    : {
        primary: {
          100: "#013a44",
          200: "#01444f",
          300: "#014e5a",
          400: "#015766",
          500: "#016171",
          600: "#1a717f",
          700: "#34818d",
          800: "#4d909c",
          900: "#67a0aa",
          950: "#013139",
        },

        secondary: {
          100: "#167952",
          200: "#198d5f",
          300: "#1da16d",
          400: "#20b57a",
          500: "#24c988",
          600: "#3ace94",
          700: "#50d4a0",
          800: "#66d9ac",
          900: "#7cdfb8",
        },
        black: {
          50: "#000000",
          100: "#191919",
          200: "#333333",
          300: "#4c4c4c",
          400: "#666666",
          500: "#7f7f7f",
          600: "#999999",
          700: "#b2b2b2",
          800: "#cccccc",
          900: "#F9F9F9",
          950: "#ffffff",
        },
        blackOnly: {
          500: "#000000",
        },
        whiteOnly: {
          500: "#ffffff",
        },
        redDark: {
          500: "#880808",
        },
        greenOnly: {
          500: "#016171",
        },
      }),
});

// MUI theme Settings

export const themeSettings = (mode) => {
  const colors = tokens(mode);
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            primary: {
              main: colors.secondary[500],
            },
            secondary: {
              main: colors.primary[500],
            },
            neutral: {
              dark: colors.primary[100],
              main: colors.primary[100],
              light: colors.primary[100],
            },
            background: {
              default: colors.black[950],
            },
          }
        : {
            primary: {
              main: colors.primary[500],
            },
            secondary: {
              main: colors.secondary[500],
            },
            neutral: {
              dark: colors.primary[100],
              main: colors.primary[100],
              light: colors.primary[100],
            },
            background: {
              default: colors.black[950],
            },
          }),
    },
    typography: {
      fontFamily: ["Poppins", "sans-serif"].join(","),
      fontSize: 14,
      colors: colors.black[950],
      h1: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontSize: 44,
      },
      h2: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontSize: 17,
      },
      h6: {
        fontFamily: ["Poppins", "sans-serif"].join(","),
        fontSize: 15,
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1366,
        xl: 1536,
      },
    },
  };
};

export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  // const [mode, setMode] = useState("light");
  console.log("theme :", localStorage.getItem("theme"));
  const storage =
    localStorage.getItem("theme") !== "undefined"
      ? localStorage.theme
      : "light";

  const [storageTheme, setStorageTheme] = useState(storage);
  const [mode, setMode] = useState(storage);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    []
  );
  useEffect(() => {
    localStorage.setItem("theme", mode);
    setStorageTheme(mode);
  }, [storageTheme, mode]);

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return [theme, colorMode];
};
