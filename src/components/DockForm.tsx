import { ReactNode } from 'react';
import styled from 'styled-components';
import { CDockForm } from './hooks';

const Wrapper = styled.div`
    position: absolute;
    top: 0; left: 0; bottom: 0; right: 0;
`;

const DockForm = ({ form, onRenderForm }: {form: CDockForm, onRenderForm: (form: CDockForm) => ReactNode }) => {
    return (
        <Wrapper>
            {onRenderForm(form)}
        </Wrapper>
    )
}

export default DockForm;
