import { useMemo, useContext } from "react";
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
    Jan: "Th 1",
    Feb: "Th 2",
    Mar: "Th 3",
    April: "Th 4",
    May: "Th 5",
    Jun: "Th 6",
    Jul: "Th 7",
    Aug: "Th 8",
    Sep: "Th 9",
    Oct: "Th 10",
    Nov: "Th 11",
    Dec: "Th 12",
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        // Convert the label (e.g. "Jan") into Vietnamese if available.
        const mappedMonth = monthMap[label] || label;
        const count = payload[0].value;
        return (
            <div
                style={{
                    backgroundColor: "#fff",
                    padding: "8px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                }}
            >
                <p style={{ margin: 0, fontWeight: "bold" }}>{mappedMonth}</p>
                <p style={{ margin: 0 }}>Số lượng: {count}</p>
            </div>
        );
    }
    return null;
};

const CustomLegend = () => {
    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            <div
                style={{
                    width: 12,
                    height: 12,
                    backgroundColor: "#475be8",
                    marginRight: 5,
                }}
            ></div>
            <span style={{ fontSize: 14 }}>Số lượng</span>
        </div>
    );
};

const AreaBarChart = ({ date, setDate, statisticData }) => {
    const { theme } = useContext(ThemeContext);
    const aggregatedData = useMemo(() => {
        const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "April",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];
        
        // Handle case when statisticData is null or undefined
        if (!statisticData || !statisticData.matchList) {
            return monthNames.map(month => ({ month, soluong: 0 }));
        }
        
        try {
            // Create a safe copy of the match list to prevent errors
            const safeMatchList = Array.isArray(statisticData.matchList) 
                ? statisticData.matchList 
                : [];
            
            // Limit processing to a maximum of 1000 items for performance
            const limitedMatchList = safeMatchList.length > 1000 
                ? safeMatchList.slice(0, 1000) 
                : safeMatchList;
            
            // Pre-calculate counts for each month to improve performance
            const monthCounts = new Array(12).fill(0);
            
            limitedMatchList.forEach(match => {
                if (!match || !match.LAST_UPDATE_INFO) return;
                
                try {
                    const dateObj = new Date(match.LAST_UPDATE_INFO);
                    if (!isNaN(dateObj.getTime())) { // Check if date is valid
                        const monthIndex = dateObj.getMonth();
                        if (monthIndex >= 0 && monthIndex < 12) {
                            monthCounts[monthIndex]++;
                        }
                    }
                } catch (err) {
                    console.error("Error processing match date:", err);
                }
            });
            
            return monthNames.map((month, index) => {
                return { month, soluong: monthCounts[index] };
            });
        } catch (err) {
            console.error("Error aggregating match data:", err);
            return monthNames.map(month => ({ month, soluong: 0 }));
        }
    }, [statisticData]);

    const ticks = useMemo(() => {
        try {
            const values = aggregatedData.map((item) => item.soluong);
            const min = Math.min(...values, 0);
            const max = Math.max(...values);
            
            // If there are too many values between min and max, create fewer ticks
            if (max - min > 10) {
                const step = Math.ceil((max - min) / 5);
                const tickArray = [];
                for (let i = min; i <= max + step; i += step) {
                    tickArray.push(i);
                }
                return tickArray;
            } else {
                // For smaller ranges, show all values
                const tickArray = [];
                for (let i = min; i <= max + 2; i++) {
                    tickArray.push(i);
                }
                return tickArray;
            }
        } catch (err) {
            console.error("Error calculating ticks:", err);
            return [0, 1, 2, 3, 4, 5]; // Default ticks
        }
    }, [aggregatedData]);

    const formatTooltipValue = (value) => `${value}`;
    const formatYAxisLabel = (value) => `${value}`;

    return (
        <div className="bar-chart" style={{ width: "110%", height: "105%" }}>
            <div className="bar-chart-info">
                <h5 className="bar-chart-title">Số lượng cặp ghép đôi</h5>
                <h5 className="bar-chart-title">
                    Tổng số cặp đôi hiện tại: {statisticData.matchCount}
                    <Legend
                        className="bar-chart-title"
                        content={<CustomLegend />}
                        wrapperStyle={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", marginBottom: "5px" }}
                    />
                </h5>
            </div>
            <div className="bar-chart-wrapper">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        width={500}
                        height={200}
                        data={aggregatedData}
                        margin={{
                            top: 20,
                            right: 5,
                            left: 0,
                            bottom: 5,
                        }}
                    >
                        <XAxis
                            dataKey="month"
                            tickSize={0}
                            axisLine={true}
                            tickMargin={15}
                            tickFormatter={(month) => monthMap[month] || month}
                            tick={{
                                fill: theme === LIGHT_THEME ? "#676767" : "#f3f3f3",
                                fontSize: 14,
                            }}
                        />
                        <YAxis
                            ticks={ticks}
                            tickFormatter={formatYAxisLabel}
                            axisLine={true}
                            tickSize={0}
                            tickMargin={15}
                            tick={{
                                fill: theme === LIGHT_THEME ? "#676767" : "#f3f3f3",
                            }}
                            label={{
                                value: "Số cặp ghép đôi",
                                angle: -90,
                                position: "insideRight",
                                dx: -50,
                                style: { textAnchor: "middle" }
                            }}
                            domain={[0, 'auto']}
                            allowDataOverflow={false}
                        />

                        <Tooltip formatter={formatTooltipValue} content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
                        <Bar
                            dataKey="soluong"
                            fill="#475be8"
                            activeBar={false}
                            isAnimationActive={false}
                            barSize={24}
                            radius={[4, 4, 4, 4]}
                            maxBarSize={50}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AreaBarChart;
