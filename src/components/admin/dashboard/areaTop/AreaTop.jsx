import { MdOutlineMenu } from "react-icons/md";
import "./AreaTop.scss";
import { useContext, useEffect, useRef, useState } from "react";
import { SidebarContext } from "../../../../context/SidebarContext.jsx";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRange } from "react-date-range";

const AreaTop = ({ date, setDate }) => {
  const { openSidebar } = useContext(SidebarContext);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const dateRangeRef = useRef(null);
  const handleInputClick = () => {
    setShowDatePicker(true);
  };

  const handleClickOutside = (event) => {
    if (dateRangeRef.current && !dateRangeRef.current.contains(event.target)) {
      setShowDatePicker(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    console.log(date);
  }, [date]);
  return (
    <section className="content-area-top">
      <div className="area-top-l">
        <button
          className="sidebar-open-btn"
          type="button"
          onClick={openSidebar}
        >
          <MdOutlineMenu size={24} />
        </button>
        <h2 className="area-top-title">Thống kê</h2>
      </div>
      <div className="area-top-r">
        <div
          ref={dateRangeRef}
          className={`date-range-wrapper ${
            !showDatePicker ? "hide-date-range" : ""
          }`}
          onClick={handleInputClick}
        >
          <DateRange
            editableDateInputs={true}
            onChange={(item) => setDate([item.selection])}
            moveRangeOnFirstSelection={false}
            ranges={date}
            showMonthAndYearPickers={false}
          />
        </div>
      </div>
    </section>
  );
};

export default AreaTop;
