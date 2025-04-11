import {
    Pagination,
    Button as MuiButton,
    Stack,
} from "@mui/material";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Checkbox from '@mui/joy/Checkbox';
import {useState} from "react";
import {useContextMenu} from "../shared/useContextMenu.jsx";
import {DialogActions, Divider, Modal, ModalDialog} from "@mui/joy";
import Button from '@mui/joy/Button';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import AdminUserContextMenu from "../shared/ContextMenu.jsx";
import "./AreaTable.scss";

export default function TableInterestQuestion({header, data, isPagination, handleClick, currentValues, setCurrentValues, allowCheckbox, handleDelete,
                                          handleModify, allowModify, allowDelete, isMutable, ModifyTemplate, currentModifyData, clickable, handleRefresh
                                      }){
    const [selectAll, setSelectAll] = useState(false)
    const [checkboxes, setCheckboxes] = useState(new Array(data.length).fill(false))
    const {clicked, setClicked, coords, setCoords } = useContextMenu()
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showModifyPanel, setShowModifyPanel] = useState(false)
    const [index, setIndex] = useState(null)

    function setCurrentPageSize(_, size){
        setSelectAll(false)
        setCheckboxes(new Array(size).fill(false))
    }

    async function _handleModify(id){
        handleModify(id)
        setShowModifyPanel(true)
    }

    function handleSelectAll(){
        setSelectAll(prev => !prev)
        setCheckboxes(prev => prev.map(() => !selectAll))
    }

    function handleCheckboxChange(index){
        if(selectAll){
            if(checkboxes[index])
                setSelectAll(false)
        }
        else{
            const allChecked = () => {
                for (let i = 0; i < checkboxes.length; i++) {
                    if(index !== i && !checkboxes[i])
                        return false
                }
                return true
            }
            setSelectAll(allChecked)
        }
        setCheckboxes(prev => {
            const newCheckboxes = [...prev]
            newCheckboxes[index] = !newCheckboxes[index]
            return newCheckboxes
        })
    }

    return (
        <>
            <section className="content-area-table">
                <div className="data-table-info">
                    <h4 className="data-table-title">Danh sách câu hỏi sở thích</h4>
                </div>
                <div className="data-table-diagram" onContextMenu={(event) => {
                    event.preventDefault()
                    setCoords({ x: event.pageX, y: event.pageY })
                    setClicked(true)
                }}>
                    <table>
                        <thead>
                            <tr>
                                {allowCheckbox &&
                                    <th>
                                        <Checkbox onClick={handleSelectAll} checked={selectAll}/>
                                    </th>
                                }
                                {header.map((item, index) =>
                                    <th key={index}>{item}</th>)}
                                {isMutable &&
                                    <th>
                                        Hành động
                                    </th>
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.map((item, index) => (
                                    <tr key={index} onClick={() => {
                                        if(clickable)
                                            handleClick(index)
                                    }}>
                                        {allowCheckbox &&
                                            <td onClick={(event) => {
                                                event.stopPropagation()
                                            }}>
                                                <Checkbox onClick={() => handleCheckboxChange(index)} checked={checkboxes[index]}/>
                                            </td>
                                        }
                                        {item && (
                                            <>
                                                <td>{item.QUESTION_ID}</td>
                                                <td>{item.QUESTION}</td>
                                                <td>{item.OPTION_1}</td>
                                                <td>{item.OPTION_2}</td>
                                                <td>{item.OPTION_3}</td>
                                                <td>{item.OPTION_4}</td>
                                            </>
                                        )}
                                        {allowCheckbox &&
                                            <td className="dt-cell-action" onClick={(event) => {
                                                event.stopPropagation()
                                            }}>
                                                {isMutable &&
                                                    <Stack rowGap={0.5}>
                                                        {allowModify &&
                                                            <MuiButton sx={{fontSize: '0.75rem', padding: 0}} variant={'contained'} color={'info'}
                                                                    onClick={() => {
                                                                        _handleModify(item)
                                                                    }}
                                                            >MODIFY</MuiButton>
                                                        }
                                                        {allowDelete &&
                                                            <MuiButton sx={{fontSize: '0.75rem', padding: 0}} variant={'contained'} color={'error'}
                                                                    onClick={() => {
                                                                        setIndex(index)
                                                                        setShowDeleteModal(true)
                                                                    }}
                                                            >DELETE</MuiButton>
                                                        }
                                                    </Stack>
                                                }
                                            </td>
                                        }
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </section>
            {showDeleteModal &&
                <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                    <ModalDialog variant="outlined" role="alertdialog" sx={{backgroundColor: 'black', color: 'white'}}>
                        <DialogTitle>
                            <WarningRoundedIcon />
                            Confirmation
                        </DialogTitle>
                        <Divider />
                        <DialogContent sx={{color: 'white'}}>
                           Bạn có chắc muốn xóa câu hỏi này ?
                        </DialogContent>
                        <DialogActions>
                            <Button variant="solid" color="danger" onClick={() => {
                                handleDelete(data[index].QUESTION_ID);
                                setShowDeleteModal(false);
                            }}>
                                Xóa
                            </Button>
                            <Button variant="plain" color="primary" onClick={() => setShowDeleteModal(false)}>
                                Hủy
                            </Button>
                        </DialogActions>
                    </ModalDialog>
                </Modal>
            }
            {isPagination &&
                <div className="pagination-container">
                    <Pagination 
                        page={1} 
                        showFirstButton 
                        showLastButton 
                        size={'large'} 
                        count={10} 
                        color="primary"
                    />
                    <Stack direction={'row'} spacing={1} alignItems={'center'}>
                        <p>Row per page</p>
                        <Select defaultValue={10}>
                            <Option value={10}>10</Option>
                            <Option value={20}>20</Option>
                            <Option value={30}>30</Option>
                        </Select>
                    </Stack>
                </div>
            }
            {clicked && (
                <AdminUserContextMenu x={coords.x} y={coords.y} totalSelectCell={checkboxes.reduce((prev, curr) => {
                    return prev + (curr ? 1 : 0)
                })}/>
            )}
            {ModifyTemplate &&
                <ModifyTemplate data={currentModifyData} setShowModify={setShowModifyPanel} showModifyPanel={showModifyPanel} handleDelete={handleDelete} handleRefresh={handleRefresh}/>
            }
        </>
    )
}