import ComposedPaymentChart from "../../components/admin/dashboard/areaCharts/ComposedPaymentChart.jsx"
import AreaTop from "../../components/admin/dashboard/areaTop/AreaTop.jsx"
import AreaMatchCharts from "../../components/admin/dashboard/areaCharts/AreaMatchCharts.jsx"
import AreaMatchTable from "../../components/admin/dashboard/areaTable/AreaMatchTable.jsx"
import AreaCards from "../../components/admin/dashboard/areaCards/AreaCards.jsx"
import AreaPaymentTable from "../../components/admin/dashboard/areaTable/AreaPaymentTable.jsx"
import { useState, useEffect } from "react";
import {adminAxios} from "../../config/axiosConfig.jsx"

const Dashboard = () => {
  const [statisticData, setStatisticData] = useState(null);
  const [date, setDate] = useState([
        {
            startDate: null,
            endDate: null,
            key: "selection",
        },
    ])
    useEffect(() => {
        getStatisticData();
    }, [])
    useEffect(() => {
        getStatisticDataWithParameter();
    }, [date])
    const getStatisticData = () => {
        adminAxios.get('/statistic')
            .then((res) => {
            setStatisticData(res.data)
        }).catch(err => {
            console.log(err.response.data)
        })
    };
    const getStatisticDataWithParameter = () => {
        const startDateFormatted = date[0]?.startDate
            ? new Date(date[0].startDate).toISOString().split('T')[0]
            : null;
        const endDateFormatted = date[0]?.startDate
            ? new Date(date[0].endDate).toISOString().split('T')[0]
            : null;

        if (startDateFormatted === null || endDateFormatted === null) {
            console.log("Start date is nothing.");
            return;
        }

        adminAxios.post('/statistic/search', {
            startDate: date[0].startDate,
            endDate: date[0].endDate
        })
            .then(res => {
                setStatisticData(res.data);
            })
            .catch(err => {
                if (err.response?.status === 400) {
                    alert(err.response.data);
                }
            });
    };
    return (
        <div className="content-area">
            {statisticData && (
                <>
                    <AreaTop date={date} setDate={setDate}/>
                    <AreaCards date={date} setDate={setDate} statisticData={statisticData}/>
                    <AreaMatchCharts date={date} setDate={setDate} statisticData={statisticData}/>
                    <AreaMatchTable date={date} setDate={setDate} statisticData={statisticData}/>
                    <ComposedPaymentChart date={date} setDate={setDate} statisticData={statisticData}/>
                    <AreaPaymentTable date={date} setDate={setDate} statisticData={statisticData}/>
                </>
            )}
        </div>
  );
};

export default Dashboard;
