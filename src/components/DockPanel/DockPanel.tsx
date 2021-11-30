import { useState } from "react";
import DockForm, { CDockForm } from "../DockForm/DockForm";
import styled from 'styled-components';

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

     overflow: auto;
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

export interface DockPanelProps {
    forms: CDockForm[]
}

const DockPanel = ({ forms = [] }: DockPanelProps) => {

    const [activeForm, setActiveForm] = useState(0);

    const renderTabs = () => (
        <Tabs className="tabs">
            {forms.map((f, i) => (
                <div
                    key={i}
                    className={activeForm == i ? 'active' : ''}
                    onClick={() => setActiveForm(i)}
                >{f.title}</div>
            ))}
        </Tabs>
    )

    return (
        <Wrapper className="dock-panel">
            <Title>{forms[activeForm].title}</Title>
            <Content className="content">
                <DockForm {...forms[activeForm]} />
            </Content>
            {forms.length > 1 ? renderTabs() : ''}
        </Wrapper>
    )
}

export default DockPanel;
