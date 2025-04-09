import AreaCard from "./AreaCard.jsx";
import AreaCardNoPie from "./AreaCardNoPie.jsx";
import "./AreaCards.scss";

const AreaPaymentCard = ({date, setDate, statisticData}) => {
    function getTotalPeopleWithPayment(data) {
        const uniqueUsers = new Set(data.paymentList.map(payment => payment.USER_ID));
        return uniqueUsers.size;
    }
    function getTotalAmount(data) {
        return data.paymentList.reduce((total, payment) => total + payment.AMOUNT, 0);
    }
    return (
        <section className="content-area-cards">
            <AreaCardNoPie
                cardInfo={{
                    title: "Tổng số người thanh toán",
                    value: getTotalPeopleWithPayment(statisticData)+" người",
                    text: "Toàn bộ là người dùng đã nâng cấp tài khoản",
                }}
            />
            <AreaCardNoPie
                colors={["#e4e8ef", "#4ce13f"]}
                cardInfo={{
                    title: "Tổng số lợi nhuận",
                    value: getTotalAmount(statisticData)+" VNĐ",
                    text: "Đây là toàn bộ lợi nhuận có được từ nâng cấp tài khoản",
                }}
            />
            <AreaCard
                colors={["#e4e8ef", "#f29a2e"]}
                percentFillValue={(getTotalPeopleWithPayment(statisticData) / statisticData.userCount * 100).toFixed(2)}
                cardInfo={{
                    title: "Tỷ lệ người dùng nâng cấp",
                    value: (getTotalPeopleWithPayment(statisticData) / statisticData.userCount * 100).toFixed(2)+"%",
                    text: "Tỷ lệ được tính dựa trên tổng số người nâng cấp tài khoản",
                }}
            />
        </section>
    );
};
export default AreaPaymentCard;
