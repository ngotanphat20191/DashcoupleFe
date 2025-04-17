import AreaBarChart from "./AreaBarChart.jsx"
import AreaCardNoPieChart from "./AreaCardNoPieChart.jsx"
import "../areaCards/AreaCards.scss";

const AreaMatchCharts = ({date, setDate, statisticData}) => {
    const convertToMinutesAndSeconds = (decimal) => {
        const minutes = Math.floor(decimal);
        const seconds = Math.round((decimal - minutes) * 60);
        return `${minutes} phút ${seconds} giây`;
    };
  return (
      <div style={{ position: 'relative', width: '100%' }}>
          <section className="content-area-charts" style={{ width: '100%' }}>
              <AreaBarChart
                  date={date}
                  setDate={setDate}
                  statisticData={statisticData}
              />
          </section>
          <div style={{
              position: 'absolute',
              top: '-10px',
              left: '73%',
              width: '85%',
          }}>
              <section className="content-area-cards">
                  <AreaCardNoPieChart
                      cardInfo={{
                          title: "Tỷ lệ ghép đôi",
                          value: (statisticData.matchCount / statisticData.userCount * 100).toFixed(1)+"%",
                          text: "Tỷ lệ được tính dựa trên tổng số người ghép đôi với tổng số người dùng"
                      }}
                  />
              </section>
              <section className="content-area-cards">
                  <AreaCardNoPieChart
                      cardInfo={{
                          title: "Thời gian videocall trung bình",
                          value: convertToMinutesAndSeconds(statisticData.averageCallTime),
                          text: "Đây là thời gian gọi điện video trung bình của các cặp đôi, được thể hiện phút và giây",
                      }}
                  />
              </section>
          </div>
      </div>

  )
}

export default AreaMatchCharts
