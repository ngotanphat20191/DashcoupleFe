import {Outlet} from "react-router-dom";
import {Sidebar} from "../components/admin";
import "../baseStyles.scss"
import {ThemeContext} from "../context/ThemeContext.jsx";
import {DARK_THEME, LIGHT_THEME} from "../constants/themeConstants.js";
import {useContext, useEffect} from "react";
import MoonIcon from "../assets/icons/moon.svg";
import SunIcon from "../assets/icons/sun.svg";

const BaseLayout = () => {
    const {theme, toggleTheme} = useContext(ThemeContext);

    useEffect(() => {
        if (theme === DARK_THEME) {
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
        }
    }, [theme]);

    return (
        <main className="page-wrapper">
            <Sidebar/>
            <div className="content-wrapper">
                <Outlet/>
            </div>
            <button
                type="button"
                className="theme-toggle-btn"
                onClick={toggleTheme}
            >
                <img
                    className="theme-icon"
                    src={theme === LIGHT_THEME ? SunIcon : MoonIcon}
                    alt="Mode"
                />
            </button>
        </main>
    );
};

export default BaseLayout;
