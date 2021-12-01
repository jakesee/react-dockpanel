import { useState } from "react";
import DockForm from "../DockForm/DockForm";
import styled from 'styled-components';
import { CDockPanel, DragDropable } from "../behavior";


const NoContent = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;

    background-color: #293955;
    height: 100%;

    div {
        color: #fff;
    }
`

export const Wrapper = styled.div`
    display: grid;
    grid-template-rows: min-content 1fr min-content;

    height: 100%;
    overflow: none;
    background-color: #293955;
`;

export const Content = styled.div`
     background-color: #fff;
     position: relative;
     overflow: hidden;

     height: 100%;
     width: 100%;
`

export const Title = styled.div`
    color: #fff;
    background-color: #4D6082;
    padding: 4px 6px;
`

export const Tabs = styled.div`

    display: flex;
    align-items: center;
    gap: 1px;

    div {
        padding: 2px 6px;
        background-color: #4D6082;
        color: #FFFFFF;

        cursor: pointer;
    }

    div.active {
        background-color: #FFFFFF;
        color: #000000;
    }
`

const DockPanel = ({ panel, onLayout }: { panel: CDockPanel, onLayout: (sourceId:string, destinationId: string) => void}) => {

    const [activeForm, setActiveForm] = useState(0);

    const dragDrop = new DragDropable();

    const handleDrop = (source: string) => {
        setActiveForm(prev => 0);
        onLayout(source, panel.id);
    }

    const getActiveForm = () => {
        return Math.min(panel.forms.length - 1, activeForm);
    }

    const renderTabs = () => (
        <Tabs className="tabs">
            {panel.forms.map((f, i) => (
                <div
                    key={f.id}
                    className={activeForm === i ? 'active' : ''}
                    onClick={() => setActiveForm(i)}

                    draggable
                    onDragStart={(e) => dragDrop.onDragStart(e.nativeEvent, panel.forms[getActiveForm()].id)}
                >{f.title}</div>
            ))}
        </Tabs>
    )

    const renderForm = () => (
        <Wrapper className="dock-panel"
            onDragOver={(e) => dragDrop.onDragOver(e.nativeEvent, () => true)}
            onDrop={(e) => dragDrop.onDrop(e.nativeEvent, handleDrop)}
        >
            <Title
                draggable
                onDragStart={(e) => dragDrop.onDragStart(e.nativeEvent, panel.forms[getActiveForm()].id)}
            >{panel.forms[getActiveForm()].title} {panel.forms[getActiveForm()].id}</Title>
            <Content className="content">
                <DockForm {...panel.forms[activeForm]} />
            </Content>
            {panel.forms.length > 1 ? renderTabs() : ''}
        </Wrapper>
    )

    const renderEmpty = () => (
        <NoContent
            onDragOver={(e) => dragDrop.onDragOver(e.nativeEvent, () => true)}
            onDrop={(e) => dragDrop.onDrop(e.nativeEvent, handleDrop)}
        ><div>Drop a form here to display {panel.id}</div></NoContent>
    )

    return (
        <>
            {panel.forms.length > 0 ? renderForm() : renderEmpty()}
        </>
    )
}

export default DockPanel;
