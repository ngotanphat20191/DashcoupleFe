import AreaTableAction from "./AreaTableAction.jsx";
import "./AreaTable.scss";
import { useMemo } from "react";

const TABLE_HEADS = [
  "Mã cặp đôi",
  "Tên người dùng 1",
  "Tên người dùng 2",
  "Thời gian ghép đôi",
  "Trạng thái",
];

const AreaMatchTable = ({date, setDate, statisticData}) => {
  // Get the 10 most recent matches based on MATCH_ID
  const recentMatches = useMemo(() => {
    if (!statisticData.matchList || !Array.isArray(statisticData.matchList)) {
      return [];
    }
    
    // Sort by MATCH_ID in descending order (assuming higher ID means more recent)
    const sortedMatches = [...statisticData.matchList].sort((a, b) => 
      parseInt(b.MATCH_ID) - parseInt(a.MATCH_ID)
    );
    
    // Take only the first 10 items
    return sortedMatches.slice(0, 10);
  }, [statisticData.matchList]);

  return (
    <section className="content-area-table" style={{marginTop: "30px"}}>
      <div className="data-table-info">
        <h4 className="data-table-title">Danh sách ghép đôi (10 cặp ghép đôi gần đây nhất)</h4>
      </div>
      <div className="data-table-diagram">
        <table>
          <thead>
            <tr>
              {TABLE_HEADS?.map((th, index) => (
                <th key={index}>{th}</th>
              ))}
            </tr>
          </thead>
          <tbody>
          {recentMatches.map((dataItem) => (
              <tr key={dataItem.MATCH_ID}>
                <td>{dataItem.MATCH_ID}</td>
                <td>{dataItem.USERS[0].NAME || "N/A"}</td>
                <td>{dataItem.USERS[1].NAME  || "N/A"}</td>
                <td>{dataItem.LAST_UPDATE_INFO || "No update"}</td>
                <td>
                  <div className="dt-status">
                    <span className={`dt-status-dot dot-`}></span>
                    <span className="dt-status-text">Đang ghép đôi</span>
                  </div>
                </td>
              </tr>
          ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AreaMatchTable;
