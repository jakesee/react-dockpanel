import { ReactNode, useRef, useState } from "react";
import DockForm from "./DockForm";
import styled from 'styled-components';
import { CDockForm, CDockPanel, DockLayoutDirection, DragDropable } from "./hooks";


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

const DockPanel = ({ panel, onStacking, onSplitting, onRenderForm }
    : {
        panel: CDockPanel,
        onStacking: (sourceId: string, destinationId: string) => boolean,
        onSplitting: (sourceId: string, destinationId: string, direction: DockLayoutDirection) => boolean,
        onRenderForm: (form: CDockForm) => ReactNode,
    }) => {

    const [activeForm, setActiveForm] = useState(0);
    const panelRef = useRef<HTMLDivElement>(null);

    const dragDrop = new DragDropable();

    const handleStacking = (e: DragEvent, source: string): boolean => {
        setActiveForm(prev => Math.min(panel.forms.length - 1, prev));
        return onStacking(source, panel.id);
    }

    const handleSplitting = (e: DragEvent, source: string): boolean => {
        setActiveForm(prev => Math.min(panel.forms.length - 1, prev));
        // check which side the mouse is close to
        const destination = panelRef.current;
        let direction = DockLayoutDirection.Horizontal
        if (destination) {
            const destinationRect = destination.getBoundingClientRect();
            const left = Math.abs(destinationRect.left - e.clientX);
            const right = Math.abs(destinationRect.right - e.clientX);
            const top = Math.abs(destinationRect.top - e.clientY);
            const bottom = Math.abs(destinationRect.bottom - e.clientY);
            const min = Math.min(left, right, top, bottom);
            if (min === top || min === bottom) direction = DockLayoutDirection.Vertical
        }
        return onSplitting(source, panel.id, direction);
    }

    const renderTabs = () => (
        <Tabs className="tabs"
            onDragOver={(e) => dragDrop.onDragOver(e.nativeEvent, () => true)}
            onDrop={(e) => dragDrop.onDrop(e.nativeEvent, handleStacking)}
        >
            {panel.forms.map((f, i) => (
                <div
                    key={f.id}
                    className={activeForm === i ? 'active' : ''}
                    onClick={() => setActiveForm(i)}

                    draggable
                    onDragStart={(e) => dragDrop.onDragStart(e.nativeEvent, f.id)}
                >{f.title}</div>
            ))}
        </Tabs>
    )

    const renderForm = () => (
        <Wrapper ref={panelRef} className="dock-panel">
            <Title
                draggable
                onDragStart={(e) => dragDrop.onDragStart(e.nativeEvent, panel.forms[activeForm].id)}
                onDragOver={(e) => dragDrop.onDragOver(e.nativeEvent, () => true)}
                onDrop={(e) => dragDrop.onDrop(e.nativeEvent, handleStacking)}
            >{panel.forms[activeForm].title} {panel.forms[activeForm].id}</Title>
            <Content className="content"
                onDragOver={(e) => dragDrop.onDragOver(e.nativeEvent, () => true)}
                onDrop={(e) => dragDrop.onDrop(e.nativeEvent, handleSplitting)}
            >
                <DockForm form={panel.forms[activeForm]} onRenderForm={onRenderForm} />
            </Content>
            {panel.forms.length > 1 ? renderTabs() : ''}
        </Wrapper>
    )

    const renderEmpty = () => (
        <NoContent ref={panelRef}
            onDragOver={(e) => dragDrop.onDragOver(e.nativeEvent, () => true)}
            onDrop={(e) => dragDrop.onDrop(e.nativeEvent, handleStacking)}
        ><div>Drop a form here to display {panel.id}</div></NoContent>
    )

    return (
        <>
            {panel.forms.length > 0 ? renderForm() : renderEmpty()}
        </>
    )
}

export default DockPanel;
