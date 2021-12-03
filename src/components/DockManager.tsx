import { ReactNode } from 'react';
import styled from 'styled-components';
import { CDockForm, CDockLayoutItem, DockLayoutDirection, IDockManager } from './hooks';
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

const DockManager = ({ dockManager, onStacking, onSplitting, onRenderForm }
    : {
        dockManager: IDockManager,
        onStacking?: (sourceId: string, destinationId: string) => boolean,
        onSplitting?: (sourceId: string, destinationId: string, direction: DockLayoutDirection) => boolean,
        onRenderForm: (form: CDockForm) => ReactNode
    }) => {


    const handleStacking = (formId: string, panelId: string): boolean => {

        if (!(onStacking && onStacking(formId, panelId))) {
            dockManager.stack(formId, panelId);
        }

        return true;
    }

    const handleSplitting = (formId: string, panelId: string, direction: DockLayoutDirection) => {

        if (!(onSplitting && onSplitting(formId, panelId, direction))) {
            dockManager.split(formId, panelId, direction);
        }

        return true;
    }


    return (
        <Wrapper className="dock-manager">
            <DockLayout layout={dockManager.layout} onStacking={handleStacking} onSplitting={handleSplitting} onRenderForm={onRenderForm} />
        </Wrapper>
    )
}

export default DockManager;

