import { SupportOutlined } from "@mui/icons-material";
import React, { ReactNode } from "react";


enum DockPosition {
    None,
    Top,
    Bottom,
    Left,
    Right,
    Center
}

interface DockableProps {
    title: string;
    children: JSX.Element | string;
}

const Dockable = ({ title, children }: DockableProps) => {
    return (
        <>{children}</>
    )
}

interface DockPanelProps {
    title: string,
    children: JSX.Element[];
}

// DockPanel is a dockable that can
const DockHost = ({ title, children }: DockPanelProps) => {

    return (
        <Dockable title={title}>
            <div className="dock-host">
                <div className="">{children[0]}</div>
                <div className="">{children[1]}</div>
                <div className="filetabs"></div>
            </div>

            {/* <div className="dock-host split-vertical">
                <div className="">{children[0]}</div>
                <div className="">{children[1]}
                    <div className="filetabs"></div>
                </div>
            </div>

            <div className="dock-host split-horizontal">
                <div className="">{children[0]}</div>
                <div className="">{children[1]}
                    <div className="filetabs"></div>
                </div>
            </div> */}
        </Dockable>
    )
}

export default Dockable;

