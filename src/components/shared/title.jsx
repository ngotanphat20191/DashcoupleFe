
import Typography from '@mui/material/Typography';
import './title.css'
const Title = ({ textTitle }) => {
    return (
        <div className="herotitle">
            <Typography color="primary" style={{fontSize:'45px', fontWeight:'bold'}}>
                {textTitle}
            </Typography>
        </div>
    );
};

export default Title;