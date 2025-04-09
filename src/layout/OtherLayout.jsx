import { Outlet } from "react-router-dom";
import "../mainStyles.css";

const OtherLayout = () => {
    return (
        <div className="main-container">
            <Outlet />
        </div>
    );
};

export default OtherLayout;