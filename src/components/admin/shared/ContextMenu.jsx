import '../user/user.css'
import {styled} from "@mui/system";

export default function AdminUserContextMenu(props){
    const CustomContextMenu = styled('div')({
        height: 'fit-content',
        top: `${props.y}px`,
        left: `${props.x}px`,
        position: 'absolute',
    })

    return (
        <CustomContextMenu className={'custom-context-menu'}>
            <p>Delete selection ({props.totalSelectCell} rows)</p>
            <p>Copy</p>
            <p>Pin {props.totalSelectCell} row(s)</p>
            <p>Export data</p>
            <p>Select all</p>
        </CustomContextMenu>
    )
}