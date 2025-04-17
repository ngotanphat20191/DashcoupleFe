import AreaCard from "./AreaCard.jsx";
import AreaCardNoPie from "./AreaCardNoPie.jsx";

import "./AreaCards.scss";
import {useEffect} from "react";

const AreaCards = ({date, setDate, statisticData}) => {
    useEffect(() => {
        console.log(statisticData);
    }, [])
  return (
    <section className="content-area-cards">
      <AreaCardNoPie
        cardInfo={{
          title: "Số lượng người dùng",
          value: statisticData.userCount,
          text: "Toàn bộ là người dùng đang hoạt động",
        }}
      />
      <AreaCard
        colors={["#e4e8ef", "#4ce13f"]}
        percentFillValue={(statisticData.menCount / statisticData.userCount * 100).toFixed(1)}
        cardInfo={{
          title: "Người dùng nam",
          value: statisticData.menCount,
          text: "Dữ liệu là người dùng giới tính nam",
        }}
      />
      <AreaCard
        colors={["#e4e8ef", "#f29a2e"]}
        percentFillValue={(statisticData.womenCount / statisticData.userCount * 100).toFixed(1)}
        cardInfo={{
          title: "Người dùng nữ",
          value: statisticData.womenCount,
          text: "Dữ liệu là người dùng giới tính nữ",
        }}
      />
    </section>
  );
};

export default AreaCards;
