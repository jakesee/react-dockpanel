import DockPanel from "../DockPanel/DockPanel";
import styled from 'styled-components';
import { CDockLayoutItem, DockLayoutItemType, CDockPanel, CDockSplitter, DockLayoutDirection, Movable } from "../behavior";
import { useEffect, useState } from "react";


const Wrapper = styled.div<{ direction: DockLayoutDirection }>`
    display: flex;
    flex-direction: ${props => props.direction === DockLayoutDirection.Vertical ? `column` : `row` };

    position: absolute;
    width: 100%;
    height: 100%;
`;

const Separator = styled.div<{ direction: DockLayoutDirection }>`
    background-color: #304261;
    flex: 0 0 4px;
    cursor: ${props => props.direction === DockLayoutDirection.Vertical ? `row-resize` : `col-resize`};
`
const Primary = styled.div`
    position: relative;
    flex: 1 1 auto;

    background-color: var(--systemColor);
`

const Secondary = styled.div<{ size: number }>`
    position: relative;
    flex: 0 1 ${props => props.size}px;

    background-color: var(--systemColor);
`

const DockLayout = ({ layout, onLayout }: { layout: CDockLayoutItem, onLayout: (sourceId: string, destinationId: string) => void }) => {

    const isSplitter = layout.type === DockLayoutItemType.SPLITTER;
    const splitter = layout as CDockSplitter;
    const panel = layout as CDockPanel;

    const [secondarySize, setSecondarySize] = useState<number>(splitter.size ?? 200);

    const movable = new Movable((delta) => {
        if (isSplitter)
        {
            if (splitter.direction === DockLayoutDirection.Horizontal) {
                setSecondarySize(prev => prev - delta.x);
            } else {
                setSecondarySize(prev => prev - delta.y);
            }
        }
    });


    const renderSplitter = () => (
        <>
            <Primary className="dock-layout-primary">
                <DockLayout layout={splitter.primary} onLayout={onLayout} />
            </Primary>
            <Separator className="separator" direction={splitter.direction}
                onMouseDown={(e) => movable.onMouseDown(e.nativeEvent)}
                onTouchStart={(e) => movable.onTouchStart(e.nativeEvent)}
            />
            <Secondary size={secondarySize} className="dock-layout-secondary">
                <DockLayout layout={splitter.secondary} onLayout={onLayout}/>
            </Secondary>
        </>
    );

    const renderPanel = () => (
        <Primary className="dock-layout-primary">
            <DockPanel panel={panel} onLayout={onLayout}/>
        </Primary>
    )

    return (
        <Wrapper direction={splitter?.direction} className={layout.id}>
            {isSplitter ? renderSplitter() : renderPanel()}
        </Wrapper>
    );
}

export default DockLayout
