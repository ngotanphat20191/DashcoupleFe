import PropTypes from "prop-types";

const AreaCardNoPieChart = ({ cardInfo }) =>{
    return (
        <div className="area-card" style={{width:'100%'}}>
            <div className="area-card-info">
                <h5 className="info-title">{cardInfo.title}</h5>
                <div className="info-value">{cardInfo.value}</div>
                <p className="info-text">{cardInfo.text}</p>
            </div>
        </div>
    );
};

export default AreaCardNoPieChart;

AreaCardNoPieChart.propTypes = {
    cardInfo: PropTypes.object.isRequired,
};
