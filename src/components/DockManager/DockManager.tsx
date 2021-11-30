import MainForm from "../../forms/MainForm";
import { CDockForm } from "../DockForm/DockForm";
import DockLayout, { CDockLayout, DockLayoutDirection } from "../DockLayout/DockLayout";


import styled from 'styled-components';

export const Wrapper = styled.div`

    --backgroundColor: #35496A;
    --systemColor: #E8E8EC;

    background-color: var(--backgroundColor);

    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
`;

const DockManager = () => {


    const left = CDockLayout.CreatePanel([CDockForm.Empty()]);
    const right = CDockLayout.CreatePanel([new CDockForm('Properties', "dsadsadsadsadsa"), new CDockForm('Class View')]);
    const bottom = CDockLayout.CreatePanel([new CDockForm('Error List'), new CDockForm('Debug'), new CDockForm('Console')])


    const splitter = CDockLayout.CreateSplitter(left, right);

    const splitter2 = CDockLayout.CreateSplitter(splitter, bottom);
    splitter2.direction = DockLayoutDirection.Vertical;

    console.log(splitter2);

    return (
        <Wrapper className="dock-manager">
            <DockLayout {...splitter2} />
        </Wrapper>
    )
}

export default DockManager;

