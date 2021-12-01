import styled from 'styled-components';
import { CDockLayoutItem } from '../behavior';
import DockLayout from '../DockLayout/DockLayout';

export const Wrapper = styled.div`

    --backgroundColor: #35496A;
    --systemColor: #E8E8EC;

    background-color: var(--backgroundColor);

    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
`;

const DockManager = ({ layout, onLayout }: { layout: CDockLayoutItem, onLayout: (sourceId: string, destinationId: string) => void  }) => {

    return (
        <Wrapper className="dock-manager">
            <DockLayout layout={layout} onLayout={onLayout} />
        </Wrapper>
    )
}

export default DockManager;

