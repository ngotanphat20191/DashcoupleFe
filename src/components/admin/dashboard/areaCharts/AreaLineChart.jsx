import { useContext } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { ThemeContext } from "../../../../context/ThemeContext.jsx";
import { LIGHT_THEME } from "../../../../constants/themeConstants.js";
import "./AreaCharts.scss";
const monthMap = {
    Jan: "Tháng 1",
    Feb: "Tháng 2",
    Mar: "Tháng 3",
    April: "Tháng 4",
    May: "Tháng 5",
    Jun: "Tháng 6",
    Jul: "Tháng 7",
    Aug: "Tháng 8",
    Sep: "Tháng 9",
    Oct: "Tháng 10",
    Nov: "Tháng 11",
    Dec: "Tháng 12"
};
const data = [
    {
        month: "Jan",
        loss: 70,
        profit: 100,
    },
    {
        month: "Feb",
        loss: 55,
        profit: 85,
    },
    {
        month: "Mar",
        loss: 35,
        profit: 90,
    },
    {
        month: "April",
        loss: 90,
        profit: 70,
    },
    {
        month: "May",
        loss: 55,
        profit: 80,
    },
    {
        month: "Jun",
        loss: 30,
        profit: 50,
    },
    {
        month: "Jul",
        loss: 32,
        profit: 75,
    },
    {
        month: "Aug",
        loss: 62,
        profit: 86,
    },
    {
        month: "Sep",
        loss: 55,
        profit: 78,
    },
    {
        month: "Oct",
        loss: 55,
        profit: 78,
    },
    {
        month: "Nov",
        loss: 55,
        profit: 78,
    },
    {
        month: "Dec",
        loss: 55,
        profit: 78,
    },
];

const AreaBarChart = ({date, setDate, statisticData}) => {
    const { theme } = useContext(ThemeContext);

    const formatTooltipValue = (value) => {
        return `${value}k`;
    };

    const formatYAxisLabel = (value) => {
        return `${value}k`;
    };

    const formatLegendValue = (value) => {
        return value.charAt(0).toUpperCase() + value.slice(1);
    };

    return (
        <div className="bar-chart" style={{width: "150%"}}>
            <div className="bar-chart-info">
                <h5 className="bar-chart-title">Số lượng ghép đôi</h5>
                <div className="chart-info-data">
                    <div className="info-data-value">{statisticData.matchCount}</div>
                </div>
            </div>
            <div className="bar-chart-wrapper">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        width={500}
                        height={200}
                        data={data}
                        margin={{
                            top: 5,
                            right: 5,
                            left: 0,
                            bottom: 5,
                        }}
                    >
                        <XAxis
                            padding={{ left: 10 }}
                            dataKey="month"
                            tickSize={0}
                            axisLine={false}
                            tickFormatter={(month) => monthMap[month] || month}
                            tick={{
                                fill: theme === LIGHT_THEME ? "#676767" : "#f3f3f3",
                                fontSize: 14,
                            }}
                        />
                        <YAxis
                            padding={{ bottom: 10, top: 10 }}
                            tickFormatter={formatYAxisLabel}
                            tickCount={6}
                            axisLine={false}
                            tickSize={0}
                            tick={{
                                fill: `${theme === LIGHT_THEME ? "#676767" : "#f3f3f3"}`,
                            }}
                        />
                        <Tooltip
                            formatter={formatTooltipValue}
                            cursor={{ fill: "transparent" }}
                        />
                        <Legend
                            iconType="circle"
                            iconSize={10}
                            verticalAlign="top"
                            align="right"
                            formatter={formatLegendValue}
                        />
                        <Bar
                            dataKey="profit"
                            fill="#475be8"
                            activeBar={false}
                            isAnimationActive={false}
                            barSize={24}
                            radius={[4, 4, 4, 4]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AreaBarChart;
