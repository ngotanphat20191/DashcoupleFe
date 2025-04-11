import "../user/user.css";
import { Button, Stack } from "@mui/material";
import TableInterest from "./TableInterest.jsx";
import { useEffect, useState } from "react";
import Input from "@mui/joy/Input";
import { adminAxios } from "../../../config/axiosConfig.jsx";
import TableInterestAdd from "./TableInterestAdd.jsx";
import FilterAltIcon from '@mui/icons-material/FilterAlt';

export default function Interest() {
    const [isLoading, setIsLoading] = useState(false);
    const [interestData, setInterestData] = useState([]); // Full data from API
    const [filteredData, setFilteredData] = useState([]); // Filtered data for display
    const tableHeader = ['ID Sở thích', 'Tên sở thích', 'Hành động'];
    const [currentModifyData, setCurrentModifyData] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchInterestData();
    }, []);
    
    // Update filtered data when interestData changes
    useEffect(() => {
        if (searchQuery) {
            handleQueryChange({ target: { value: searchQuery } });
        } else {
            setFilteredData(interestData);
        }
    }, [interestData]);

    function fetchInterestData() {
        setIsLoading(true);
        adminAxios.get('/interests')
            .then((res) => {
                setInterestData(res.data);
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
            setFilteredData(interestData);
            return;
        }

        const query = value.toLowerCase();
        const newFilteredData = interestData.filter(item =>
            (item.name && item.name.toLowerCase().includes(query))
        );
        setFilteredData(newFilteredData);
    }
    
    function clearFilters() {
        setSearchQuery("");
        setFilteredData(interestData);
    }
    
    function handleDeleteInterest(id) {
        if (!id) return;
        
        setIsLoading(true);
        adminAxios.post('/interests/delete', {
            InterestID: id,
        })
            .then((res) => {
                alert('Xóa sở thích thành công');
                setFilteredData(prevData => prevData.filter(item => item.InterestID !== id));
                setInterestData(prevData => prevData.filter(item => item.InterestID !== id));
                setIsLoading(false);
            })
            .catch(err => {
                console.log(err.response?.data || err);
                alert('Có lỗi xảy ra khi xóa sở thích');
                setIsLoading(false);
            });
    }
    
    function handleModifyInterest(item) {
        console.log("Modifying interest:", item);
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
                            placeholder={'Tìm kiếm sở thích...'} 
                            sx={{ minWidth: '25rem' }} 
                            value={searchQuery}
                            onChange={handleQueryChange}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    // Optional: add specific action on Enter
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
                            Thêm sở thích mới
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
                                {/* Add filter options here if needed */}
                            </Stack>
                        </Stack>
                    </Stack>
                )}
                <TableInterest 
                    data={filteredData} 
                    header={tableHeader} 
                    isPagination={true}
                    allowCheckbox={true} 
                    allowDelete={true} 
                    allowModify={true}
                    ModifyTemplate={(props) => (
                        <TableInterestModify 
                            {...props} 
                            handleRefresh={() => fetchInterestData()}
                        />
                    )}
                    currentModifyData={currentModifyData}
                    setCurrentModifyData={setCurrentModifyData} 
                    isMutable={true}
                    handleDelete={(id) => handleDeleteInterest(id)}
                    handleModify={(item) => handleModifyInterest(item)}
                />
                
                {/* Add Interest Modal */}
                {showAddModal && (
                    <TableInterestAdd 
                        showModifyPanel={showAddModal} 
                        setShowModify={setShowAddModal} 
                        handleRefresh={() => fetchInterestData()}
                    />
                )}
            </section>
        </div>
    );
}
