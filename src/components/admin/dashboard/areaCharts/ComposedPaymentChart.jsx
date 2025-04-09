import React, { useState } from "react";
import {
    Area,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ComposedChart,
    ResponsiveContainer
} from "recharts";
import moment from "moment";
import AreaPaymentCard from "../areaCards/AreaPaymentCard.jsx";
import "./AreaCharts.scss"

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) {
        return null;
    }

    // Extract values from the payload (which might contain data for both line and area)
    let paymentCount = 0;
    let totalAmount = 0;

    payload.forEach((item) => {
        if (item.dataKey === "paymentCount") {
            paymentCount = item.value;
        } else if (item.dataKey === "totalAmount") {
            totalAmount = item.value;
        }
    });

    // Convert "YYYY-MM" into Vietnamese month label (e.g., "Th3")
    const monthNumber = moment(label, "YYYY-MM").month() + 1;
    const monthLabel = `Th${monthNumber}`;

    return (
        <div
            className="custom-tooltip"
            style={{
                backgroundColor: "#fff",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px"
            }}
        >
            <p style={{ margin: 0, fontWeight: "bold" }}>{monthLabel}</p>
            <p style={{ margin: 0 }}>
                <strong>Số người thanh toán:</strong> {paymentCount}
            </p>
            <p style={{ margin: 0 }}>
                <strong>Tổng số tiền:</strong> {totalAmount}
            </p>
        </div>
    );
};

const ComposedPaymentChart = ({ date, setDate, statisticData }) => {
    const [selectedData, setSelectedData] = useState(null);

    // Helper function to aggregate payments by month, ensuring every month in the range is included.
    const aggregatePaymentsByMonth = (data) => {
        const monthlyData = {};

        let minDate, maxDate;
        if (data.length > 0) {
            minDate = moment
                .min(data.map((payment) => moment(payment.PAYMENT_DATE)))
                .startOf("month");
            maxDate = moment
                .max(data.map((payment) => moment(payment.PAYMENT_DATE)))
                .startOf("month");
        } else {
            minDate = moment().startOf("year");
            maxDate = moment().endOf("year");
        }

        // If there's only one month in the data, extend to the full year.
        if (minDate.isSame(maxDate, "month")) {
            minDate = minDate.clone().startOf("year");
            maxDate = minDate.clone().endOf("year");
        }

        // Aggregate payment data by month.
        data.forEach((payment) => {
            const paymentMonth = moment(payment.PAYMENT_DATE).format("YYYY-MM");
            const amount = payment.AMOUNT;
            if (!monthlyData[paymentMonth]) {
                monthlyData[paymentMonth] = { paymentCount: 0, totalAmount: 0 };
            }
            monthlyData[paymentMonth].paymentCount += 1;
            monthlyData[paymentMonth].totalAmount += amount;
        });

        // Generate a complete list of months between minDate and maxDate.
        const monthsInRange = [];
        let currentMonth = minDate.clone();
        while (
            currentMonth.isBefore(maxDate) ||
            currentMonth.isSame(maxDate, "month")
            ) {
            const monthKey = currentMonth.format("YYYY-MM");
            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = { paymentCount: 0, totalAmount: 0 };
            }
            monthsInRange.push(monthKey);
            currentMonth.add(1, "month");
        }

        // Convert to an array suitable for Recharts.
        return monthsInRange.map((month) => ({
            name: month,
            paymentCount: monthlyData[month].paymentCount,
            totalAmount: monthlyData[month].totalAmount
        }));
    };

    const data = aggregatePaymentsByMonth(statisticData.paymentList || []);

    // Calculate max paymentCount and add 4, then round up to the next multiple of 3.
    const maxCount = Math.max(...data.map((d) => d.paymentCount), 0);
    const topTick = Math.ceil((maxCount + 4) / 3) * 3;

    // Build left axis ticks in multiples of 3.
    const leftAxisTicks = [];
    for (let i = 0; i <= topTick; i += 3) {
        leftAxisTicks.push(i);
    }

    return (
        <>
            <div className="composed-chart" style={{ width: "100%" }}>
                <div className="composed-chart-info">
                    <h5 className="composed-chart-title">Thống kê lợi nhuận</h5>
                </div>
                <div className="composed-chart-wrapper">
                    <ResponsiveContainer width="100%" height={400}>
                        <ComposedChart
                            data={data}
                            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                            // When clicking on a month, update the selectedData state.
                            onClick={(e) => {
                                if (e && e.activeLabel) {
                                    const clicked = data.find((item) => item.name === e.activeLabel);
                                    setSelectedData(clicked);
                                }
                            }}
                        >
                            {/* X-Axis: display only the month in Vietnamese format (e.g., "Th3" for March) */}
                            <XAxis
                                dataKey="name"
                                tickFormatter={(tick) => {
                                    const monthNumber = moment(tick, "YYYY-MM").month() + 1;
                                    return `Th${monthNumber}`;
                                }}
                            />

                            {/* Left Y-Axis for paymentCount */}
                            <YAxis
                                yAxisId="left"
                                ticks={leftAxisTicks}
                                domain={[0, topTick]}
                                allowDecimals={false}
                                label={{
                                    value: "Số người thanh toán",
                                    angle: -90,
                                    position: "insideLeft",
                                    style: { textAnchor: "middle" }
                                }}
                            />

                            {/* Right Y-Axis for totalAmount */}
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                domain={[0, "dataMax"]}
                                label={{
                                    value: "Tổng số tiền (VNĐ)",
                                    angle: -90,
                                    position: "insideRight",
                                    dx: 15,
                                    style: { textAnchor: "middle" }
                                }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Area
                                yAxisId="right"
                                type="monotone"
                                dataKey="totalAmount"
                                name="Tổng số tiền"
                                fill="#8884d8"
                                stroke="#8884d8"
                            />
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="paymentCount"
                                name="Số người thanh toán"
                                stroke="#ff7300"
                                dot={{ r: 3 }}
                                activeDot={{ r: 5 }}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <AreaPaymentCard date={date} setDate={setDate} statisticData={statisticData}></AreaPaymentCard>
        </>
    );
};

export default ComposedPaymentChart;
