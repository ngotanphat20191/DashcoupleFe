import AreaTableAction from "./AreaTableAction.jsx";
import "./AreaTable.scss";
import { useMemo } from "react";

const TABLE_HEADS = [
  "Mã thanh toán",
  "Tên người dùng",
  "Danh hiệu",
  "Số tiền",
  "Phương thức",
  "Trạng thái",
  "Thời gian thanh toán"
];

const AreaPaymentTable = ({date, setDate, statisticData}) => {
  // Get the 10 most recent payments based on PAYMENT_ID
  const recentPayments = useMemo(() => {
    if (!statisticData.paymentList || !Array.isArray(statisticData.paymentList)) {
      return [];
    }
    
    // Sort by PAYMENT_ID in descending order (assuming higher ID means more recent)
    const sortedPayments = [...statisticData.paymentList].sort((a, b) => 
      parseInt(b.PAYMENT_ID) - parseInt(a.PAYMENT_ID)
    );
    
    // Take only the first 10 items
    return sortedPayments.slice(0, 10);
  }, [statisticData.paymentList]);

  return (
    <section className="content-area-table">
      <div className="data-table-info">
        <h4 className="data-table-title">Danh sách thanh toán nâng cấp (10 thanh toán gần đây nhất)</h4>
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
            {recentPayments.map((dataItem) => {
              return (
                <tr key={dataItem.PAYMENT_ID}>
                  <td>{dataItem.PAYMENT_ID}</td>
                  <td>{dataItem.NAME}</td>
                  <td>Premium</td>
                  <td>{dataItem.AMOUNT}</td>
                  <td>{dataItem.PAYMENT_METHOD}</td>
                  <td>{dataItem.TRANSACTION_STATUS}</td>
                  <td>{dataItem.PAYMENT_DATE}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AreaPaymentTable;
