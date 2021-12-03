import DockPanel from "./DockPanel";
import styled from 'styled-components';
import { CDockLayoutItem, DockLayoutItemType, CDockPanel, CDockSplitter, DockLayoutDirection, Movable, CDockForm, Point } from "./hooks";
import { ReactNode, useEffect, useRef, useState } from "react";


const Wrapper = styled.div`
    display: flex;
    position: absolute;
    width: 100%;
    height: 100%;
`;

const Separator = styled.div`
    background-color: #304261;
    flex: 0 0 4px;
`
const Primary = styled.div`
    position: relative;
    flex: 1 1 auto;

    background-color: var(--systemColor);
`

const Secondary = styled.div`
    position: relative;
    flex: 0 1 auto;

    background-color: var(--systemColor);
`

const DockLayout = ({ layout, onStacking, onSplitting, onRenderForm }
    : {
        layout: CDockLayoutItem,
        onStacking: (sourceId: string, destinationId: string) => boolean,
        onSplitting: (sourceId: string, destinationId: string, direction: DockLayoutDirection) => boolean,
        onRenderForm: (form: CDockForm) => ReactNode
    }) => {

    const isSplitter = layout.type === DockLayoutItemType.Splitter;
    const splitter = layout as CDockSplitter;
    const panel = layout as CDockPanel;

    const splitterRef = useRef<HTMLDivElement | null>(null);
    const separatorRef = useRef<HTMLDivElement | null>(null);

    const [secondarySize, setSecondarySize] = useState<number>(splitter.size ?? 0);

    const movable = new Movable((delta, target) => {
        if (isSplitter)
        {
            handleMove(target);
        }
    });

    const getSecondaryPaneSize = (splitterRect: DOMRect, separatorRect: DOMRect, clientPosition: Point, offsetMouse: boolean) => {
        let totalSize;
        let splitterSize;
        let offset;
        const splitter = layout as CDockSplitter;
        if (splitter.direction === DockLayoutDirection.Vertical) {
            totalSize = splitterRect.height;
            splitterSize = separatorRect.height;
            offset = clientPosition.y - splitterRect.top;
        } else {
            totalSize = splitterRect.width;
            splitterSize = separatorRect.width;
            offset = clientPosition.x - splitterRect.left;
        }
        if (offsetMouse) {
            offset -= splitterSize / 2;
        }
        if (offset < 0) {
            offset = 0;
        } else if (offset > totalSize - splitterSize) {
            offset = totalSize - splitterSize;
        }

        let secondaryPaneSize = totalSize - splitterSize - offset;
        let primaryPaneSize = totalSize - splitterSize - secondaryPaneSize;
        secondaryPaneSize = (secondaryPaneSize * 100) / totalSize;
        primaryPaneSize = (primaryPaneSize * 100) / totalSize;
        splitterSize = (splitterSize * 100) / totalSize;
        totalSize = 100;

        // adjust minimum sizes here as required
        const primaryMinSize = 10; // percentage
        const secondaryMinSize = 10; // percentage
        if (primaryPaneSize < primaryMinSize) {
            secondaryPaneSize = Math.max(secondaryPaneSize - (primaryMinSize - primaryPaneSize), 0);
        } else if (secondaryPaneSize < secondaryMinSize) {
            secondaryPaneSize = Math.min(totalSize - splitterSize - primaryMinSize, secondaryMinSize);
        }

        return secondaryPaneSize;
    }

    const handleMove = (target: Point) => {
        const separator = separatorRef.current;
        const splitter = splitterRef.current;
        if (separator && splitter) {
            const containerRect = splitter.getBoundingClientRect();
            const splitterRect = separator.getBoundingClientRect();
            const secondaryPaneSize = getSecondaryPaneSize(containerRect, splitterRect, target, true);
            //clearSelection();
            setSecondarySize(secondaryPaneSize);
        }
    }

    const handleResize = () => {
        const separator = separatorRef.current;
        const splitter = splitterRef.current;
        if (separator && splitter) {
            const splitterRect = splitter.getBoundingClientRect();
            const separatorRect = separator.getBoundingClientRect();
            const secondaryPaneSize = getSecondaryPaneSize(splitterRect, separatorRect, new Point(separatorRect.left, separatorRect.top), false);
            setSecondarySize(secondaryPaneSize);
        }
    }

    useEffect(() => {

        window.addEventListener('resize', handleResize)


        return () => window.removeEventListener('resize', handleResize);
    },[])

    const getSecondaryStyle = (direction: DockLayoutDirection, size: number) => {
        if (direction === DockLayoutDirection.Horizontal) {
            return { width: `${size}%` }
        } else {
            return { height: `${size}%` }
        }
    }

    const getSeparatorStyle = (direction: DockLayoutDirection) => {

        if (direction === DockLayoutDirection.Vertical) {
            return { cursor: 'row-resize' };
        } else {
            return { cursor: 'col-resize' };
        }
    }

    const getWrapperStyle = (direction: DockLayoutDirection) => {

        if (direction === DockLayoutDirection.Vertical) {
            return { flexDirection: 'column' as 'column' };
        } else {
            return { flexDirection: 'row' as 'row' };
        }
    }

    const renderSplitter = () => (
        <>
            <Primary className="dock-layout-primary">
                <DockLayout layout={splitter.primary} onStacking={onStacking} onSplitting={onSplitting} onRenderForm={onRenderForm} />
            </Primary>
            <Separator className="separator" style={getSeparatorStyle(splitter.direction)} ref={separatorRef}
                onMouseDown={(e) => movable.onMouseDown(e.nativeEvent)}
                onTouchStart={(e) => movable.onTouchStart(e.nativeEvent)}
            />
            <Secondary className="dock-layout-secondary" style={getSecondaryStyle(splitter.direction, secondarySize)}>
                <DockLayout layout={splitter.secondary} onStacking={onStacking} onSplitting={onSplitting} onRenderForm={onRenderForm} />
            </Secondary>
        </>
    );

    const renderPanel = () => (
        <Primary className="dock-layout-primary">
            <DockPanel panel={panel} onStacking={onStacking} onSplitting={onSplitting} onRenderForm={onRenderForm} />
        </Primary>
    )

    return (
        <Wrapper style={getWrapperStyle(splitter.direction)} className={layout.id} ref={splitterRef}>
            {isSplitter ? renderSplitter() : renderPanel()}
        </Wrapper>
    );
}

export default DockLayout
