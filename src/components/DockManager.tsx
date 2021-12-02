import { ReactNode } from 'react';
import styled from 'styled-components';
import { CDockForm, CDockLayoutItem } from './behavior';
import DockLayout from './DockLayout';

export const Wrapper = styled.div`

    --backgroundColor: #35496A;
    --systemColor: #E8E8EC;

    background-color: var(--backgroundColor);

    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
`;

const DockManager = ({ layout, onLayout, onRenderForm }
    : { layout: CDockLayoutItem, onLayout: (sourceId: string, destinationId: string) => void, onRenderForm: (form: CDockForm) => ReactNode }) => {

    return (
        <Wrapper className="dock-manager">
            <DockLayout layout={layout} onLayout={onLayout} onRenderForm={onRenderForm} />
        </Wrapper>
    )
}

export default DockManager;

