import { createContext, useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { DARK_THEME, LIGHT_THEME } from "../constants/themeConstants.js";

export const ThemeContext = createContext({});

export const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage or default to LIGHT_THEME
  const [theme, setTheme] = useState(() => {
    const savedTheme = window.localStorage.getItem("themeMode");
    return savedTheme || LIGHT_THEME;
  });
  
  // Use useCallback to memoize the toggleTheme function
  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === LIGHT_THEME ? DARK_THEME : LIGHT_THEME;
      window.localStorage.setItem("themeMode", newTheme);
      return newTheme;
    });
  }, []);
  
  // Update localStorage when theme changes
  useEffect(() => {
    window.localStorage.setItem("themeMode", theme);
  }, [theme]);

  // Memoize the context value to prevent unnecessary re-renders
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
