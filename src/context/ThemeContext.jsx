import { createContext, useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { DARK_THEME, LIGHT_THEME } from "../constants/themeConstants.js";

export const ThemeContext = createContext({});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = window.localStorage.getItem("themeMode");
    return savedTheme || LIGHT_THEME;
  });
  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === LIGHT_THEME ? DARK_THEME : LIGHT_THEME;
      window.localStorage.setItem("themeMode", newTheme);
      return newTheme;
    });
  }, []);
  
  useEffect(() => {
    window.localStorage.setItem("themeMode", theme);
  }, [theme]);
  const contextValue = {
    theme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
