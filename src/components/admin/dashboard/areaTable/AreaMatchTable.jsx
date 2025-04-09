import AreaTableAction from "./AreaTableAction.jsx";
import "./AreaTable.scss";

const TABLE_HEADS = [
  "Mã cặp đôi",
  "Tên người dùng 1",
  "Tên người dùng 2",
  "Thời gian ghép đôi",
  "Trạng thái",
];

const AreaMatchTable = ({date, setDate, statisticData}) => {
  return (
    <section className="content-area-table" style={{marginTop: "30px"}}>
      <div className="data-table-info">
        <h4 className="data-table-title">Danh sách ghép đôi</h4>
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
          {statisticData.matchList?.map((dataItem) => (
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
