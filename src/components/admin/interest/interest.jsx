import "../user/user.css";
import { Button, Stack } from "@mui/material";
import TableInterest from "./TableInterest.jsx";
import { useEffect, useState } from "react";
import Input from "@mui/joy/Input";
import { adminAxios } from "../../../config/axiosConfig.jsx";
import TableInterestAdd from "./TableInterestAdd.jsx";

export default function Interest() {
    const [isLoading, setIsLoading] = useState(false);
    const [staffData, setStaffData] = useState([]); // Full data from API
    const [filteredData, setFilteredData] = useState([]); // Filtered data for display
    const tableHeader = ['ID Sở thích', 'Tên sở thích', 'Hành động'];
    const [currentModifyData, setCurrentModifyData] = useState([]);
    const [searchData, setSearchData] = useState([]);

    useEffect(() => {
        fetchStaffData();
        console.log(filteredData)

    }, []);
    useEffect(() => {
        if (searchData && Object.keys(searchData).length > 0) {
            updateStaffDataFromSearch();
        }
    }, [searchData]);
    function updateStaffDataFromSearch() {
        const newStaffData = Object.values(searchData).map(item => ({
            interestID: item.InterestID,
            name: item.name
        }));
        setFilteredData(newStaffData);
    }
    function fetchStaffData() {
        setIsLoading(true);
        adminAxios.get('/interests')
            .then((res) => {
                setSearchData(res.data);
                setFilteredData(res.data); // Initially, show full data
                setIsLoading(false);
            })
            .catch(err => {
                console.log(err.response.data);
                setIsLoading(false);
            });
    }
    function handleQueryChange(e) {
        const { value } = e.target;
        setSearchData({ name: value });

        const newFilteredData = staffData.filter(item =>
            item.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredData(newFilteredData);
    }

    return (
        <div className={'user-management-container'}>
            <section className={'user-table-container'}>
                <Stack marginBlock={1} alignItems={'center'} direction={'row'} justifyContent={'space-between'}
                       className={'table-filters'}>
                    <Stack direction={'row'} columnGap={1}>
                        <Input autoFocus placeholder={'Tìm bằng tên'} sx={{ minWidth: '25rem' }}
                               value={searchData.name}
                               onChange={handleQueryChange} />
                        <Button variant={'contained'} onClick={fetchStaffData}>FIND</Button>
                    </Stack>
                </Stack>
                <section className={'user-table-wrapper'}>
                    <TableInterest data={filteredData} header={tableHeader} isPagination={true}
                                   allowCheckbox={true} allowDelete={true} allowModify={false}
                                   ModifyTemplate={TableInterestAdd} currentModifyData={currentModifyData}
                                   setCurrentModifyData={setCurrentModifyData} isMutable={true}/>
                </section>
            </section>
        </div>
    );
}
