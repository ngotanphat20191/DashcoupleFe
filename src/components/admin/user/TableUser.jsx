import {
    Pagination,
    Button as MuiButton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Checkbox from '@mui/joy/Checkbox';
import {useEffect, useState} from "react";
import {useContextMenu} from "../shared/useContextMenu.jsx";
import {DialogActions, Divider, Modal, ModalDialog} from "@mui/joy";
import Button from '@mui/joy/Button';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import AdminUserContextMenu from "../shared/ContextMenu.jsx";

export default function TableUser({header, data, isPagination, handleClick, currentValues, setCurrentValues, allowCheckbox, handleDelete,
                                          handleModify, allowModify, allowDelete, isMutable, ModifyTemplate, currentModifyData, clickable, interestData
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
        setCurrentValues(prev => {
            return {...prev, pageSize: size}
        })
    }

    async function _handleModify(item){
        console.log(item.id);
        handleModify(item.id);
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
    useEffect(() => {
    }, [])
    return (
        <>
            <TableContainer onContextMenu={(event) => {
                event.preventDefault()
                setCoords({ x: event.pageX, y: event.pageY })
                setClicked(true)
            }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{backgroundColor: '#36007B'}}>
                            {allowCheckbox &&
                                <TableCell sx={{color: 'white', userSelect: 'none'}}>
                                    <Checkbox onClick={handleSelectAll} checked={selectAll}/>
                                </TableCell>
                            }
                            {header.map((item, index) =>
                                <TableCell sx={{color: 'white', userSelect: 'none'}} key={index}>{item}</TableCell>)}
                            {isMutable &&
                                <TableCell sx={{color: 'white', userSelect: 'none'}}>
                                    Hành động
                                </TableCell>
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            data.map((item, index) => (
                                <TableRow key={index} sx={{
                                    '&:nth-of-type(odd)': {backgroundColor: '#c0d6f3',},
                                    '&:nth-of-type(even)': {backgroundColor: '#E2EFFF',},
                                }} onClick={() => {
                                    if(clickable)
                                        handleClick(index)
                                }}>
                                    {allowCheckbox &&
                                        <TableCell onClick={(event) => {
                                            event.stopPropagation()
                                        }}>
                                            <Checkbox onClick={() => handleCheckboxChange(index)} checked={checkboxes[index]}/>
                                        </TableCell>
                                    }
                                    {item &&
                                        Object.keys(item).map((key, index) => (
                                            <TableCell key={index}>{item[key]}</TableCell>
                                        ))
                                    }
                                    {allowCheckbox &&
                                        <TableCell sx={{display: 'flex'}} onClick={(event) => {
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
                                                                       if(data[index][9] === 'Inactive'){
                                                                           alert('This staff already inactive')
                                                                       }
                                                                       else{
                                                                           setIndex(index)
                                                                           setShowDeleteModal(true)
                                                                       }
                                                                   }}
                                                        >DELETE</MuiButton>
                                                    }
                                                </Stack>
                                            }
                                        </TableCell>
                                    }
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            {showDeleteModal &&
                <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                    <ModalDialog variant="outlined" role="alertdialog" sx={{backgroundColor: 'black', color: 'white'}}>
                        <DialogTitle>
                            <WarningRoundedIcon />
                            Confirmation
                        </DialogTitle>
                        <Divider />
                        <DialogContent sx={{color: 'white'}}>
                           Bạn có chắc muốn xóa người dùng này ?
                        </DialogContent>
                        <DialogActions>
                            <Button variant="solid" color="danger" onClick={() => handleDelete(data[index].id)}>
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
                <div style={{
                    alignSelf: 'center',
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'center',
                    position: 'relative'
                }}>
                    <Pagination page={currentValues.pageNumber} showFirstButton showLastButton size={'large'} count={100} color="primary" sx={{border: '2px solid black'}}
                                onChange={(_, page) => setCurrentValues(prev => {
                                    return {...prev, pageNumber: page}
                                })}
                    />
                    <Stack direction={'row'} spacing={1} alignItems={'center'} style={{position: 'absolute', right: 0}}>
                        <p>Row per page</p>
                        <Select defaultValue={10} value={currentValues.pageSize} onChange={setCurrentPageSize}>
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
                <ModifyTemplate data={currentModifyData} setShowModify={setShowModifyPanel} showModifyPanel={showModifyPanel} handleDelete={handleDelete} interestData={interestData}/>
            }
        </>
    )
}