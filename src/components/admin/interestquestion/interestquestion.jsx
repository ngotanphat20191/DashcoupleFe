import "../user/user.css";
import { Button, Stack } from "@mui/material";
import TableInterestQuestion from "./TableInterestQuestion.jsx";
import { useEffect, useState } from "react";
import Input from "@mui/joy/Input";
import { adminAxios } from "../../../config/axiosConfig.jsx";
import TableInterestQuestionAdd from "./TableInterestQuestionAdd.jsx";

export default function InterestQuestion() {
    const [isLoading, setIsLoading] = useState(false);
    const [staffData, setStaffData] = useState([]); // Full data from API
    const [filteredData, setFilteredData] = useState([]); // Filtered data for display
    const tableHeader = ['ID', 'Câu hỏi', 'Lựa chọn 1', 'Lựa chọn 2', 'Lựa chọn 3', 'Lựa chọn 4', 'Hành động'];
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
            QUESTION_ID: item.QUESTION_ID || item.question_ID,
            QUESTION: item.QUESTION || item.question,
            OPTION_1: item.OPTION_1 || item.option_1,
            OPTION_2: item.OPTION_2 || item.option_2,
            OPTION_3: item.OPTION_3 || item.option_3,
            OPTION_4: item.OPTION_4 || item.option_4,
        }));
        setFilteredData(newStaffData);
    }
    function fetchStaffData() {
        setIsLoading(true);
        adminAxios.get('/interestsQuestion')
            .then((res) => {
                setSearchData(res.data);
                setFilteredData(res.data);
                setIsLoading(false);
            })
            .catch(err => {
                console.log(err.response.data);
                setIsLoading(false);
            });
    }

    function handleQueryChange(e, field) {
        const { value } = e.target;
        setSearchData(prev => ({ ...prev, [field]: value }));

        const newFilteredData = staffData.filter(item =>
            item.QUESTION.toLowerCase().includes(searchData.question.toLowerCase()) &&
            item.OPTION_1.toLowerCase().includes(searchData.option1.toLowerCase()) &&
            item.OPTION_2.toLowerCase().includes(searchData.option2.toLowerCase()) &&
            item.OPTION_3.toLowerCase().includes(searchData.option3.toLowerCase()) &&
            item.OPTION_4.toLowerCase().includes(searchData.option4.toLowerCase())
        );
        setFilteredData(newFilteredData);
    }

    return (
        <div className={'user-management-container'}>
            <section className={'user-table-container'}>
                <Stack marginBlock={1} alignItems={'center'} direction={'row'} justifyContent={'space-between'}
                       className={'table-filters'}>
                    <Stack direction={'row'} columnGap={1}>
                        <Input placeholder={'Search by question'} sx={{ minWidth: '15rem' }} value={searchData.question}
                               onChange={(e) => handleQueryChange(e, 'question')} />
                        <Input placeholder={'Option 1'} sx={{ minWidth: '10rem' }} value={searchData.option1}
                               onChange={(e) => handleQueryChange(e, 'option1')} />
                        <Input placeholder={'Option 2'} sx={{ minWidth: '10rem' }} value={searchData.option2}
                               onChange={(e) => handleQueryChange(e, 'option2')} />
                        <Input placeholder={'Option 3'} sx={{ minWidth: '10rem' }} value={searchData.option3}
                               onChange={(e) => handleQueryChange(e, 'option3')} />
                        <Input placeholder={'Option 4'} sx={{ minWidth: '10rem' }} value={searchData.option4}
                               onChange={(e) => handleQueryChange(e, 'option4')} />
                        <Button variant={'contained'} onClick={fetchStaffData}>Refresh</Button>
                    </Stack>
                </Stack>
                <section className={'user-table-wrapper'}>
                    <TableInterestQuestion data={filteredData} header={tableHeader} isPagination={true}
                                           allowCheckbox={true} allowDelete={true} allowModify={true}
                                           ModifyTemplate={TableInterestQuestionAdd} currentModifyData={currentModifyData}
                                           setCurrentModifyData={setCurrentModifyData} isMutable={true}/>
                </section>
            </section>
        </div>
    );
}
