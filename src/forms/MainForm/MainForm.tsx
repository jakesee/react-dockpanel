import { Content, MenuBar, MenuItem, ToolBar, ToolBarLayout, ToolBars, ToolButton } from "./MainForm.styles"
import SaveIcon from '@mui/icons-material/Save';
import SampleForm from "../SampleForm/SampleForm";
import { CDockForm, CDockLayoutItem, CDockManager, CDockSplitter, DockLayoutDirection } from "../../components/behavior";
import DockManager from "../../components/DockManager";
import { useEffect, useState } from "react";

const MainForm = () => {

    const [layout, setLayout] = useState<CDockLayoutItem>(CDockManager.createPanel([]));

    useEffect(() => {
        const properties = CDockManager.createForm('Properties');
        const classView = CDockManager.createForm('Class View');
        const error = CDockManager.createForm('Error List');
        const debug = CDockManager.createForm('Debug');
        const output = CDockManager.createForm('Output');

        const left = CDockManager.createPanel([]);
        const right = CDockManager.createPanel([properties, classView]);
        const bottom = CDockManager.createPanel([error, debug, output])

        const splitter = CDockManager.createSplitter(left, right);
        const splitter2 = CDockManager.createSplitter(splitter, bottom, DockLayoutDirection.Vertical);

        setLayout(splitter2);

        console.log(JSON.stringify(splitter2));

    }, []);

    const handleLayoutChange = (sourceId: string, destinationId: string) => {
        setLayout(prev => { return { ...CDockManager.moveForm(prev, sourceId, destinationId) } });
        console.log('changed', sourceId, destinationId);
    }

    const addForm = () => {
        setLayout(prev => {
            const panel = CDockManager.createPanel([]);
            return CDockManager.createSplitter(prev, panel, DockLayoutDirection.Horizontal, 300);
        })
    }

    const onRenderForm = (form: CDockForm) => {

        switch (form.title) {
            case 'Properties':
                return <SampleForm />;
            default:
                return (
                <div>Unknown</div>
            )
        }
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
                    <ToolButton onClick={() => addForm()}><SaveIcon /></ToolButton>
                    <ToolButton><SaveIcon /></ToolButton>
                    <ToolButton><SaveIcon /></ToolButton>
                    <ToolButton><SaveIcon /></ToolButton>
                    <ToolButton><SaveIcon /></ToolButton>
                    <ToolButton><SaveIcon /></ToolButton>
                    <ToolButton><SaveIcon /></ToolButton>
                </ToolBar>
            </ToolBars>
            <Content>
                <DockManager onLayout={handleLayoutChange} layout={layout} onRenderForm={onRenderForm}/>
            </Content>
        </ToolBarLayout>
    )
}

export default MainForm;
