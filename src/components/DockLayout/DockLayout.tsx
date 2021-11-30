import DockPanel from "../DockPanel/DockPanel";
import styled from 'styled-components';
import { Movable } from "../behavior";
import { useState } from "react";
import { CDockForm } from "../DockForm/DockForm";

export enum DockLayoutDirection {
    Horizontal,
    Vertical
}

export class CDockLayout {
    // panel
    forms: CDockForm[] = [CDockForm.Empty()];

    // splitter
    direction: DockLayoutDirection = DockLayoutDirection.Horizontal;
    size: number = 500;
    primary: CDockLayout | null = null;
    secondary: CDockLayout | null = null;

    public static isSplitter(layout: CDockLayout) {
        return !(layout.primary === null && layout.secondary === null);
    }

    public static CreatePanel(forms: CDockForm[]) {
        const panel = new CDockLayout();
        panel.forms = forms;
        panel.direction = DockLayoutDirection.Horizontal;
        panel.size = 500;
        panel.primary = null;
        panel.secondary = null;

        return panel;
    }

    public static CreateSplitter(primary: CDockLayout, secondary: CDockLayout) {
        const splitter = new CDockLayout();
        splitter.forms = []; // no forms

        splitter.direction = DockLayoutDirection.Horizontal;
        splitter.size = 500;
        splitter.primary = primary;
        splitter.secondary = secondary;

        return splitter;
    }
}

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

const DockLayout = (layout: CDockLayout) => {

    const [secondarySize, setSecondarySize] = useState(layout.size);

    const movable = new Movable((delta) => {
        if (layout.direction === DockLayoutDirection.Horizontal) {
            setSecondarySize(prev => prev - delta.x);
        } else {
            setSecondarySize(prev => prev - delta.y);
        }
    });


    const renderSplitter = () => (
        <>
            <Primary className="dock-layout-primary">
                <DockLayout {...(layout.primary!)} />
            </Primary>
            <Separator className="separator" direction={layout.direction}
                onMouseDown={(e) => movable.onMouseDown(e.nativeEvent)}
                onTouchStart={(e) => movable.onTouchStart(e.nativeEvent)}
            />
            <Secondary size={secondarySize} className="dock-layout-secondary">
                <DockLayout {...(layout.secondary!)} />
            </Secondary>
        </>
    );

    const renderPanel = () => (
        <Primary className="dock-layout-primary">
            <DockPanel forms={layout.forms} />
        </Primary>
    )

    return (
        <Wrapper direction={layout.direction}>
            {CDockLayout.isSplitter(layout) ? renderSplitter() : renderPanel()}
        </Wrapper>
    );
}

export default DockLayout
