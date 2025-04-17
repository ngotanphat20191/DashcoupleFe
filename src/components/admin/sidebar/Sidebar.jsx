import { useContext, useEffect, useRef } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import {
  MdOutlineAttachMoney,
  MdOutlineBarChart,
  MdOutlineClose,
  MdOutlineLogout,
  MdOutlinePeople,
  MdOutlineSettings,
} from "react-icons/md";
import { Link } from "react-router-dom";
import "./Sidebar.scss";
import { SidebarContext } from "../../../context/SidebarContext.jsx";
import InterestsIcon from '@mui/icons-material/Interests';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const Sidebar = () => {
  const { theme } = useContext(ThemeContext);
  const { isSidebarOpen, closeSidebar } = useContext(SidebarContext);
  const navbarRef = useRef(null);
  const handleClickOutside = (event) => {
    if (
        navbarRef.current &&
        !navbarRef.current.contains(event.target) &&
        event.target.className !== "sidebar-open-btn" &&
        isSidebarOpen
    ) {
      closeSidebar();
    }
  };
  function cleartoken(){
    localStorage.clear();
  }
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
      <nav
          className={`sidebar ${isSidebarOpen ? "sidebar-show" : ""}`}
          ref={navbarRef}
      >
        <div className="sidebar-top">
          <div className="sidebar-brand">
            <span className="sidebar-brand-text">Dashcouple</span>
          </div>
          <button className="sidebar-close-btn" onClick={closeSidebar}>
            <MdOutlineClose size={24} />
          </button>
        </div>
        <div className="sidebar-body">
          <div className="sidebar-menu">
            <ul className="menu-list">
              <li className="menu-item">
                <Link to="/admin" className="menu-link active">
                <span className="menu-link-icon">
                  <MdOutlineBarChart size={18} />
                </span>
                  <span className="menu-link-text">Thống kê</span>
                </Link>
              </li>
              <li className="menu-item">
                <Link to="/admin/user" className="menu-link">
                <span className="menu-link-icon">
                  <MdOutlinePeople size={20} />
                </span>
                  <span className="menu-link-text">Người dùng</span>
                </Link>
              </li>
              <li className="menu-item">
                <Link to="/admin/interest" className="menu-link">
                <span className="menu-link-icon">
                    <InterestsIcon size={20}></InterestsIcon >
                </span>
                  <span className="menu-link-text">Sở thích</span>
                </Link >
              </li>
              <li className="menu-item">
                <Link to="/admin/questioninterest" className="menu-link">
                <span className="menu-link-icon">
                  <HelpOutlineIcon size={20} />
                </span>
                  <span className="menu-link-text">Câu hỏi gợi ý</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="sidebar-menu sidebar-menu2">
            <ul className="menu-list">
              <li className="menu-item">
                <Link to="/" className="menu-link">
                <span className="menu-link-icon">
                  <MdOutlineSettings size={20} />
                </span>
                  <span className="menu-link-text">Cài đặt</span>
                </Link>
              </li>
              <li className="menu-item">
                <Link to="/login/admin" className="menu-link" onClick={cleartoken}>
                <span className="menu-link-icon">
                  <MdOutlineLogout size={20} />
                </span>
                  <span className="menu-link-text">Đăng xuất</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
  );
};

export default Sidebar; 