import "./user.css";
import "./AreaTable.scss";
import {
    Button,
    Stack,
    Typography,
} from "@mui/material";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import TableUser from "./TableUser.jsx";
import { useEffect, useState } from "react";
import Input from '@mui/joy/Input';
import CityAndEducationFilter from "./CityAndEducationFilter.jsx";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import TableStaffModify from "./TableStaffModify.jsx";
import { adminAxios } from "../../../config/axiosConfig.jsx";

export default function User() {
    const [isLoading, setIsLoading] = useState(false);
    const [staffData, setStaffData] = useState([]);
    const [sortedStaffData, setSortedStaffData] = useState(null);
    const [searchDataAfter, setSearchDataAfter] = useState([]);
    const [interestData, setInterestData] = useState(null);
    const tableHeader = ['Mã người dùng','Họ tên', 'Loại người dùng', 'Giới tính', 'Thành phố', 'Trình độ học vấn', 'Tôn giáo' ,'Trình trạng'];
    const [currentModifyData, setCurrentModifyData] = useState([]);
    const [searchData, setSearchData] = useState({
        name: null,
        type: null,
        gender: null,
        education: null,
        city: null,
        relationship: null,
        religion: null,
        pageSize: 10,
        pageNumber: 1,
        status: null
    });
    const [sortOption, setSortOption] = useState({
        orderBy: 'name',
        order: 'asc'
    });
    const [showFilters, setShowFilters] = useState(false);

    function updateSearchDataFromStaff() {
        if (staffData.records && staffData.records.length > 0) {
            const transformedData = staffData.records.map(record => ({
                id: record[6] || '',
                name: record[7] || '',
                type: record[1] || '',
                gender: record[10] || '',
                city: record[9] || '',
                education: record[13] || '',
                religion: record[11] || '',
                status: record[4] === 1 ? "Active" : "Inactive",
            }));
            setSearchDataAfter(transformedData);
            console.log(transformedData);
        } else {
            console.log("No records found:", staffData.records ? staffData.records.length : 0);
        }
    }

    // Uncomment and adjust sorting if needed.
    // useEffect(() => {
    //     if (staffData) {
    //         const sortedData = [...staffData];
    //         let sortIndex = sortOption.orderBy === 'name' ? 0 : sortOption.orderBy === 'city' ? 1 : 2;
    //         sortedData.sort((a, b) => {
    //             if (sortOption.order === 'asc') {
    //                 return a[sortIndex] > b[sortIndex] ? 1 : -1;
    //             } else {
    //                 return a[sortIndex] < b[sortIndex] ? 1 : -1;
    //             }
    //         });
    //         setSortedStaffData(sortedData);
    //     }
    // }, [sortOption, staffData]);

    function handleQueryChange(e) {
        const value = e.target.value;
        if (searchData.pageNumber !== 1) {
            setSearchData(prev => ({ ...prev, pageNumber: 1, name: value }));
        } else {
            setSearchData(prev => ({ ...prev, name: value }));
        }
    }

    function fetchStaffData() {
        let subParams = {};
        for (let key in searchData) {
            if (searchData[key] !== 'default' && searchData[key] !== '' && searchData[key] !== null) {
                subParams[key] = searchData[key];
            }
        }
        adminAxios.post('/profiles', subParams)
            .then((res) => {
                console.log(res.data);
                setStaffData(res.data);
            }).catch(err => {
            console.log(err.response.data);
        });
    }

    function handleSelectChange(type, value) {
        if (searchData.pageNumber !== 1) {
            setSearchData(prev => ({ ...prev, pageNumber: 1 }));
        }
        setSearchData(prev => ({ ...prev, [type]: value }));
    }

    function clearFilters() {
        setSearchData(prev => ({
            ...prev,
            type: null,
            gender: null,
            education: null,
            city: null,
            religion: null,
            relationship: null,
            pageSize: 10,
            pageNumber: 1,
            status: null
        }));
        setSortOption({
            orderBy: 'id',
            order: 'asc'
        });
    }

    function deleteStaff(id) {
        adminAxios.get('/profiles/delete?id=' + id)
            .then(res => {
                console.log(res);
                fetchStaffData();
            })
            .catch(err => console.log(err));
    }

    function handleModify(id) {
        adminAxios.get(`/profiles/get?id=${id}`)
            .then(r => {
                setCurrentModifyData(r.data);
            })
            .catch(err => console.log(err));
    }

    function handleInterest() {
        adminAxios.get(`/profiles/interest`)
            .then(r => {
                // Ensure we're setting an array
                setInterestData(Array.isArray(r.data) ? r.data : []);
            })
            .catch(err => {
                console.log(err);
                setInterestData([]); // Set empty array on error
            });
    }

    useEffect(() => {
        if (staffData?.records) {
            updateSearchDataFromStaff();
        }
    }, [staffData]);

    useEffect(() => {
        handleInterest();
        fetchStaffData();
    }, []);

    useEffect(() => {
        fetchStaffData();
    }, [searchData]);

    return (
        <div className="user-management-container">
            <section className="user-table-container">
                <Stack marginBlock={1} alignItems="center" direction="row" justifyContent="space-between"
                       className="table-filters">
                    <Stack direction="row" columnGap={1}>
                        <Input
                            autoFocus
                            placeholder="Search by name..."
                            sx={{ minWidth: '25rem' }}
                            value={searchData.name || ""}
                            onChange={handleQueryChange}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    fetchStaffData();
                                }
                            }}
                        />
                    </Stack>
                    <Button variant="contained" onClick={fetchStaffData} style={{ marginRight: "260px" }}>
                        FIND
                    </Button>
                    <Button variant="contained" startIcon={<FilterAltIcon/>} onClick={() => setShowFilters(prev => !prev)}>
                        Sort & Filter
                    </Button>
                </Stack>
                    {showFilters && (
                        <Stack>
                            <Stack rowGap={2} className="sort-filter-panel">
                                <Button variant="contained" className="clear-filter-btn" onClick={clearFilters}>
                                    CLEAR ALL FILTERS
                                </Button>
                                <Stack direction="row" flexWrap="wrap" columnGap={3}>
                                    <Stack direction="row" spacing={3} width="100%">
                                        <CityAndEducationFilter
                                            isLoading={isLoading}
                                            searchData={searchData}
                                            handleSelectChange={handleSelectChange}
                                        />
                                        <Stack rowGap={1}>
                                            <Typography variant="body2">Giới tính</Typography>
                                            <Select
                                                value={searchData.gender || ""}
                                                onChange={(_, value) =>
                                                    setSearchData(prev => ({ ...prev, gender: value }))
                                                }
                                            >
                                                <Option value="">Default</Option>
                                                <Option value="nam">Nam</Option>
                                                <Option value="nữ">Nữ</Option>
                                            </Select>
                                        </Stack>
                                        <Stack rowGap={1}>
                                            <Typography variant="body2">Mối quan hệ</Typography>
                                            <Select
                                                value={searchData.relationship || ""}
                                                onChange={(_, value) =>
                                                    setSearchData(prev => ({ ...prev, relationship: value }))
                                                }
                                            >
                                                <Option value="">Default</Option>
                                                <Option value="người yêu">Người yêu</Option>
                                                <Option value="bạn bè">Bạn bè</Option>
                                            </Select>
                                        </Stack>
                                        <Stack
                                            direction="row"
                                            columnGap={3}
                                            sx={{ borderLeft: "2px solid yellow", paddingLeft: "1.25rem" }}
                                        >
                                            <Stack rowGap={1}>
                                                <Typography variant="body2">Sắp xếp theo</Typography>
                                                <Select
                                                    defaultValue="id"
                                                    onChange={(_, value) =>
                                                        setSortOption(prev => ({ ...prev, orderBy: value }))
                                                    }
                                                >
                                                    <Option value="name">Tên</Option>
                                                    <Option value="city">Thành phố</Option>
                                                    <Option value="relationship">Mối quan hệ</Option>
                                                </Select>
                                            </Stack>
                                            <Stack rowGap={1}>
                                                <Typography variant="body2">Trình tự học vấn</Typography>
                                                <Select
                                                    defaultValue="asc"
                                                    onChange={(_, value) =>
                                                        setSortOption(prev => ({ ...prev, order: value }))
                                                    }
                                                >
                                                    <Option value="asc">Tăng dần</Option>
                                                    <Option value="desc">Giảm dần</Option>
                                                </Select>
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                    <Stack direction="row" spacing={3} width="100%" marginTop="10px">
                                        <Stack rowGap={1}>
                                            <Typography variant="body2">Loại tài khoản</Typography>
                                            <Select
                                                value={searchData.type || ""}
                                                onChange={(_, value) =>
                                                    setSearchData(prev => ({ ...prev, type: value }))
                                                }
                                            >
                                                <Option value="">Default</Option>
                                                <Option value="COUPLE">Couple</Option>
                                                <Option value="ADMIN">Admin</Option>
                                            </Select>
                                        </Stack>
                                        <Stack rowGap={1}>
                                            <Typography variant="body2">Tình trạng tài khoản</Typography>
                                            <Select
                                                value={searchData.status || ""}
                                                onChange={(_, value) =>
                                                    setSearchData(prev => ({ ...prev, status: value }))
                                                }
                                            >
                                                <Option value="">Default</Option>
                                                <Option value="Active">Hoạt động</Option>
                                                <Option value="NotActive">Dừng hoạt động</Option>
                                            </Select>
                                        </Stack>
                                        <Stack rowGap={1}>
                                            <Typography variant="body2">Tôn giáo</Typography>
                                            <Select
                                                value={searchData.religion || ""}
                                                onChange={(_, value) =>
                                                    setSearchData(prev => ({ ...prev, religion: value }))
                                                }
                                            >
                                                <Option value="">Default</Option>
                                                <Option value="Phật giáo">Phật giáo</Option>
                                                <Option value="Thiên chúa giáo">Thiên chúa giáo</Option>
                                                <Option value="Kito giáo">Kito giáo</Option>
                                                <Option value="Hindu giáo">Hindu giáo</Option>
                                                <Option value="Hồi giáo">Hồi giáo</Option>
                                            </Select>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Stack>
                    )}
                    <TableUser
                        data={sortedStaffData !== null ? sortedStaffData : searchDataAfter}
                        header={tableHeader}
                        isPagination={true}
                        currentValues={searchData}
                        setCurrentValues={setSearchData}
                        allowCheckbox={true}
                        handleDelete={deleteStaff}
                        isMutable={true}
                        allowDelete={true}
                        allowModify={true}
                        handleModify={handleModify}
                        ModifyTemplate={TableStaffModify}
                        currentModifyData={currentModifyData}
                        setCurrentModifyData={setCurrentModifyData}
                        interestData={interestData || {}}
                    />
                </section>
            </div>
    );
}
