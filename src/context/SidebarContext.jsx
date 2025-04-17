import { createContext, useState, useCallback, useMemo } from "react";
import { PropTypes } from "prop-types";

export const SidebarContext = createContext({});

export const SidebarProvider = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  // Memoize functions to prevent unnecessary re-renders
  const openSidebar = useCallback(() => {
    setSidebarOpen(true);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  // Memoize the context value
  const contextValue = useMemo(() => ({
    isSidebarOpen,
    openSidebar,
    closeSidebar,
  }), [isSidebarOpen, openSidebar, closeSidebar]);

  return (
    <SidebarContext.Provider value={contextValue}>
      {children}
    </SidebarContext.Provider>
  );
};

SidebarProvider.propTypes = {
  children: PropTypes.node,
};
