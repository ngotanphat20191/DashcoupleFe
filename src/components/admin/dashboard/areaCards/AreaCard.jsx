import PropTypes from "prop-types";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

const AreaCard = ({ colors, percentFillValue, cardInfo }) => {
  const filledValue = (percentFillValue / 100) * 360;
  const remainedValue = 360 - filledValue;

  const data = [
    { name: "Tỷ lệ người dùng giới tính khác", value: remainedValue },
    { name: "Tỷ lệ người dùng nam", value: filledValue },
  ];
  const data2 = [
    { name: "Tỷ lệ người dùng giới tính khác", value: remainedValue },
    { name: "Tỷ lệ người dùng nữ", value: filledValue },
  ];
  const data3 = [
    { name: "Tỷ lệ người dùng không nâng cấp", value: remainedValue },
    { name: "Tỷ lệ người dùng nâng cấp", value: filledValue },
  ];
  const renderTooltipContent = (value) => {
    return `${(value / 360) * 100} %`;
  };
  const chartData = cardInfo.title === "Tỷ lệ người dùng nâng cấp" ? data3 : (cardInfo.title === "Người dùng nam" ? data : data2);
  return (
    <div className="area-card">
      <div className="area-card-info">
        <h5 className="info-title">{cardInfo.title}</h5>
        <div className="info-value">{cardInfo.value}</div>
        <p className="info-text">{cardInfo.text}</p>
      </div>
      <div className="area-card-chart">
        <PieChart width={100} height={100}>
          <Pie
            data={chartData}
            cx={50}
            cy={45}
            innerRadius={20}
            fill="#e4e8ef"
            paddingAngle={0}
            dataKey="value"
            startAngle={-270}
            endAngle={150}
            stroke="none"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={renderTooltipContent} />
        </PieChart>
      </div>
    </div>
  );
};

export default AreaCard;

AreaCard.propTypes = {
  colors: PropTypes.array.isRequired,
  percentFillValue: PropTypes.number.isRequired,
  cardInfo: PropTypes.object.isRequired,
};
