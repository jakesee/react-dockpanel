import { Content, MenuBar, MenuItem, ToolBar, ToolBarLayout, ToolBars, ToolButton } from "./MainForm.styles"
import SaveIcon from '@mui/icons-material/Save';
import DockManager from "../components/DockManager/DockManager";




const MainForm = () => {

    const getContentControls = () => {
        return (
            <>
                <div>something here</div>
                <div>something here</div>
                <div>something here</div>
            </>
        )
    }

    return (
        <ToolBarLayout>
            <MenuBar>
                <MenuItem>File</MenuItem>
                <MenuItem>Edit</MenuItem>
                <MenuItem>View</MenuItem>
                <MenuItem>Project</MenuItem>
                <MenuItem>Debug</MenuItem>
                <MenuItem>Team</MenuItem>
                <MenuItem>Tools</MenuItem>
                <MenuItem>Test</MenuItem>
                <MenuItem>Analyze</MenuItem>
                <MenuItem>Window</MenuItem>
                <MenuItem>Help</MenuItem>
            </MenuBar>
            <ToolBars>
                <ToolBar>
                    <ToolButton><SaveIcon /></ToolButton>
                    <ToolButton><SaveIcon /></ToolButton>
                    <ToolButton><SaveIcon /></ToolButton>
                    <ToolButton><SaveIcon /></ToolButton>
                    <ToolButton><SaveIcon /></ToolButton>
                    <ToolButton><SaveIcon /></ToolButton>
                    <ToolButton><SaveIcon /></ToolButton>
                </ToolBar>
            </ToolBars>
            <Content>
                {/* {getContentControls()}; */}
                <DockManager />
            </Content>
        </ToolBarLayout>
    )
}

export default MainForm;
