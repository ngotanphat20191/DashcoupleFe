import { Stack, Typography } from "@mui/material";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";

export default function CityAndEducationFilter({ isLoading, searchData, handleSelectChange }) {
    const thanhpho = [
        "An Giang", "Bà Rịa - Vũng Tàu", "Bắc Giang", "Bắc Kạn", "Bạc Liêu",
        "Bắc Ninh", "Bến Tre", "Bình Định", "Bình Dương", "Bình Phước",
        "Bình Thuận", "Cà Mau", "Cần Thơ", "Cao Bằng", "Đà Nẵng",
        "Đắk Lắk", "Đắk Nông", "Điện Biên", "Đồng Nai", "Đồng Tháp",
        "Gia Lai", "Hà Giang", "Hà Nam", "Hà Nội", "Hà Tĩnh",
        "Hải Dương", "Hải Phòng", "Hậu Giang", "Hòa Bình", "Hưng Yên",
        "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu", "Lâm Đồng",
        "Lạng Sơn", "Lào Cai", "Long An", "Nam Định", "Nghệ An",
        "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Phú Yên", "Quảng Bình",
        "Quảng Nam", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sóc Trăng",
        "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên", "Thanh Hóa",
        "Thừa Thiên Huế", "Tiền Giang", "TP. Hồ Chí Minh", "Trà Vinh", "Tuyên Quang",
        "Vĩnh Long", "Vĩnh Phúc", "Yên Bái"
    ];

    const trinhdohocvan = [
        "Cao đẳng", "Đại học", "Đang học đại học", "Trung học phổ thông", "Thạc sĩ", "Tiến sĩ", "Đang học sau đại học", "Trường dạy nghề"
    ];

    return (
        <>
            <Stack rowGap={1}>
                <Typography variant="body2">Thành phố</Typography>
                <Select
                    onChange={handleSelectChange}
                    value={searchData.city}
                    disabled={isLoading}
                >
                    <Option 
                        value="" 
                        select-type="thanhpho"
                        onClick={() => handleSelectChange('city', '')}
                    ></Option>
                    {thanhpho.map((tp, index) => (
                        <Option
                            select-type="thanhpho"
                            value={tp}
                            key={index}
                            onClick={() => handleSelectChange('city', tp)}
                        >
                            {tp}
                        </Option>
                    ))}
                </Select>
            </Stack>
            <Stack rowGap={1}>
                <Typography variant="body2">Trình độ học vấn</Typography>
                <Select
                    onChange={handleSelectChange}
                    value={searchData.education}
                    disabled={isLoading}
                >
                    <Option 
                        value="" 
                        onClick={() => handleSelectChange('education', '')}
                    ></Option>
                    {trinhdohocvan.map((tdhv, index) => (
                        <Option
                            value={tdhv}
                            key={index}
                            onClick={() => handleSelectChange('education', tdhv)}
                        >
                            {tdhv}
                        </Option>
                    ))}
                </Select>
            </Stack>
        </>
    );
}
