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
                <strong>Tổng số tiền:</strong> {totalAmount.toLocaleString('vi-VN')} VND
            </p>
        </div>
    );
};

const ComposedPaymentChart = ({ date, setDate, statisticData }) => {
    const [selectedData, setSelectedData] = useState(null);

    // Helper function to aggregate payments by month, ensuring every month in the range is included.
    const aggregatePaymentsByMonth = (data) => {
        // Handle empty or invalid data
        if (!data || !Array.isArray(data) || data.length === 0) {
            // Return default data for the current year
            const currentYear = moment().year();
            const months = [];
            for (let i = 0; i < 12; i++) {
                const monthKey = `${currentYear}-${(i + 1).toString().padStart(2, '0')}`;
                months.push({
                    name: monthKey,
                    paymentCount: 0,
                    totalAmount: 0
                });
            }
            return months;
        }

        const monthlyData = {};

        try {
            // Find min and max dates safely
            let validDates = data
                .filter(payment => payment && payment.PAYMENT_DATE)
                .map(payment => moment(payment.PAYMENT_DATE));
            
            let minDate, maxDate;
            
            // Always show a full year of data
            if (validDates.length > 0) {
                // Find the latest date in the data
                maxDate = moment.max(validDates).startOf("month");
                
                // Set minDate to be 11 months before maxDate to get a full year
                minDate = maxDate.clone().subtract(11, 'months').startOf("month");
                
                // Alternative approach: center the year around the data
                // const midDate = moment.min(validDates).add(moment.max(validDates).diff(moment.min(validDates)) / 2);
                // minDate = midDate.clone().subtract(6, 'months').startOf("month");
                // maxDate = midDate.clone().add(5, 'months').startOf("month");
            } else {
                // If no valid dates, show the current year
                minDate = moment().startOf("year");
                maxDate = moment().endOf("year").startOf("month");
            }

            // Aggregate payment data by month.
            data.forEach((payment) => {
                if (!payment || !payment.PAYMENT_DATE) return;
                
                try {
                    const paymentDate = moment(payment.PAYMENT_DATE);
                    // Skip if payment date is outside our range
                    if (paymentDate.isBefore(minDate) || paymentDate.isAfter(maxDate)) return;
                    
                    const paymentMonth = paymentDate.format("YYYY-MM");
                    const amount = payment.AMOUNT || 0;
                    
                    if (!monthlyData[paymentMonth]) {
                        monthlyData[paymentMonth] = { paymentCount: 0, totalAmount: 0 };
                    }
                    monthlyData[paymentMonth].paymentCount += 1;
                    monthlyData[paymentMonth].totalAmount += amount;
                } catch (err) {
                    console.error("Error processing payment:", err);
                }
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
            // Sort the months to ensure they're in chronological order
            monthsInRange.sort((a, b) => moment(a, "YYYY-MM").diff(moment(b, "YYYY-MM")));
            
            return monthsInRange.map((month) => ({
                name: month,
                paymentCount: monthlyData[month].paymentCount,
                totalAmount: monthlyData[month].totalAmount
            }));
        } catch (err) {
            console.error("Error aggregating payment data:", err);
            return [];
        }
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
                                domain={[0, "auto"]}
                                allowDataOverflow={false}
                                tickFormatter={(value) => value / 1000}
                                label={{
                                    value: "Tổng số tiền (nghìn VNĐ)",
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
                                isAnimationActive={false}
                            />
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="paymentCount"
                                name="Số người thanh toán"
                                stroke="#ff7300"
                                dot={{ r: 3 }}
                                activeDot={{ r: 5 }}
                                isAnimationActive={false}
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
