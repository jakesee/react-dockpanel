import styled from 'styled-components';

export const MenuItem = styled.div`
    cursor: pointer;
    padding: 2px 8px;
    border: 1px solid transparent;

    :hover {
        background-color: var(--buttonHighlight);
        border-color: var(--buttonHighlightSecondary);
    }
`;

export const MenuBar = styled.div`

`;

export const ToolButton = styled.div`
    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: center;

    padding: 2px;
    border: 1px solid transparent;

    :hover {
        background-color: var(--buttonHighlight);
        border-color: var(--buttonHighlightSecondary);
    }
`;

export const ToolBar = styled.div``;

export const ToolBars = styled.div`


`;

export const Content = styled.div`
    background-color: var(--backgroundColor);
`;

export const ToolBarLayout = styled.div`

    --chromeColor: #D6DBE9;
    --buttonHighlight: #FFF29D;
    --buttonHighlightSecondary: #E5C365;
    --backgroundColor: #293955;

    position: absolute;
    height: 100%;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    overflow: hidden;

    display: grid;
    grid-template-rows: min-content min-content 1fr;

    ${MenuBar} {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;

        background-color: var(--chromeColor);

        ${MenuItem} {

        }
    }

    ${ToolBars} {
        display: flex;
        align-items: center;
        justify-content: flex-start;

        background-color: var(--chromeColor);

        ${ToolBar} {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            flex-wrap: wrap;
        }
    }

    ${Content} {
        height: 100%;
    }
`;




