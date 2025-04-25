import {Outlet, useLocation} from "react-router-dom";
import Nav from "../components/nav/nav.jsx";
import "../mainStyles.css";

const MainLayout = () => {
    const location = useLocation();
    const hideNavRoutes2 = ["/login", "/signup", "/editProfile", "/login/admin"];

    return (
        <div className="main-container">
            {
                !hideNavRoutes2.includes(location.pathname)
                && <Nav/>
            }
            <Outlet/>
        </div>
    );
};

export default MainLayout;
