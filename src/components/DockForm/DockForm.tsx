import styled from 'styled-components';
import { CDockForm } from '../behavior';

const Wrapper = styled.div`
    position: absolute;
    top: 0; left: 0; bottom: 0; right: 0;
`;

const DockForm = ({ children, title, icon }: CDockForm) => {
    return (
        <Wrapper>
            {children}
        </Wrapper>
    )
}

export default DockForm;
