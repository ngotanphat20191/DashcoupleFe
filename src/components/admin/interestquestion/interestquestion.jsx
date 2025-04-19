import "../user/user.css";
import { Button, Stack } from "@mui/material";
import TableInterestQuestion from "./TableInterestQuestion.jsx";
import { useEffect, useState } from "react";
import Input from "@mui/joy/Input";
import { adminAxios } from "../../../config/axiosConfig.jsx";
import TableInterestQuestionAdd from "./TableInterestQuestionAdd.jsx";
import TableInterestQuestionModify from "./TableInterestQuestionModify.jsx";

export default function InterestQuestion() {
    const [isLoading, setIsLoading] = useState(false);
    const [staffData, setStaffData] = useState([]); // Full data from API
    const [filteredData, setFilteredData] = useState([]); // Filtered data for display
    const tableHeader = ['ID', 'Câu hỏi', 'Lựa chọn 1', 'Lựa chọn 2', 'Lựa chọn 3', 'Lựa chọn 4'];
    const [currentModifyData, setCurrentModifyData] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchStaffData();
    }, []);
    
    useEffect(() => {
        if (searchQuery) {
            handleQueryChange({ target: { value: searchQuery } });
        } else {
            setFilteredData(staffData);
        }
    }, [staffData]);

    function fetchStaffData() {
        setIsLoading(true);
        adminAxios.get('/interestsQuestion')
            .then((res) => {
                setStaffData(res.data);
                setFilteredData(res.data);
                setIsLoading(false);
            })
            .catch(err => {
                console.log(err.response?.data || err);
                setIsLoading(false);
            });
    }

    function handleQueryChange(e) {
        const { value } = e.target;
        setSearchQuery(value);
        
        if (!value.trim()) {
            setFilteredData(staffData);
            return;
        }

        const query = value.toLowerCase();
        const newFilteredData = staffData.filter(item =>
            (item.QUESTION && item.QUESTION.toLowerCase().includes(query)) ||
            (item.OPTION_1 && item.OPTION_1.toLowerCase().includes(query)) ||
            (item.OPTION_2 && item.OPTION_2.toLowerCase().includes(query)) ||
            (item.OPTION_3 && item.OPTION_3.toLowerCase().includes(query)) ||
            (item.OPTION_4 && item.OPTION_4.toLowerCase().includes(query))
        );
        setFilteredData(newFilteredData);
    }
    
    function clearFilters() {
        setSearchQuery("");
        setFilteredData(staffData);
    }
    
    function handleDeleteQuestion(id) {
        if (!id) return;
        
        setIsLoading(true);
        adminAxios.post('/interestsQuestion/delete',{
            QUESTION_ID: id,
            })
            .then((res) => {
                setFilteredData(prevProfile => prevProfile.filter(profile => profile.QUESTION_ID !== id));
                setStaffData(prevProfile => prevProfile.filter(profile => profile.QUESTION_ID !== id));
            })
            .catch(err => {
                console.log(err.response.data);
                setIsLoading(false);
            });
    }
    
    function handleModifyQuestion(item) {
        console.log("Modifying question:", item);
        setCurrentModifyData(item);
    }

    return (
        <div className={'user-management-container'}>
            <section className={'user-table-container'}>
                <Stack marginBlock={1} alignItems={'center'} direction={'row'} justifyContent={'space-between'}
                       className={'table-filters'}>
                    <Stack direction={'row'} columnGap={1}>
                        <Input 
                            autoFocus
                            placeholder={'Tìm kiếm câu hỏi hoặc lựa chọn...'} 
                            sx={{ minWidth: '25rem' }} 
                            value={searchQuery}
                            onChange={handleQueryChange}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                }
                            }}
                        />
                    </Stack>
                    <Stack direction="row" spacing={2}>
                        <Button 
                            variant={'contained'} 
                            color="success" 
                            onClick={() => setShowAddModal(true)}
                        >
                            Thêm câu hỏi mới
                        </Button>
                    </Stack>
                </Stack>
                
                {showFilters && (
                    <Stack>
                        <Stack rowGap={2} className="sort-filter-panel">
                            <Button variant="contained" className="clear-filter-btn" onClick={clearFilters}>
                                XÓA BỘ LỌC
                            </Button>
                            <Stack direction="row" flexWrap="wrap" columnGap={3}>
                            </Stack>
                        </Stack>
                    </Stack>
                )}
                <TableInterestQuestion 
                    data={filteredData} 
                    header={tableHeader} 
                    isPagination={true}
                    allowCheckbox={true} 
                    allowDelete={true} 
                    allowModify={true}
                    ModifyTemplate={(props) => (
                        <TableInterestQuestionModify 
                            {...props} 
                            handleRefresh={() => fetchStaffData()}
                        />
                    )}
                    currentModifyData={currentModifyData}
                    setCurrentModifyData={setCurrentModifyData} 
                    isMutable={true}
                    handleDelete={(id) => handleDeleteQuestion(id)}
                    handleModify={(item) => handleModifyQuestion(item)}
                    handleRefresh={() => fetchStaffData()}
                />
                
                {/* Add Question Modal */}
                {showAddModal && (
                    <TableInterestQuestionAdd 
                        showModifyPanel={showAddModal} 
                        setShowModify={setShowAddModal} 
                        handleRefresh={() => fetchStaffData()}
                    />
                )}
            </section>
        </div>
    );
}
