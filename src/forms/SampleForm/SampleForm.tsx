import * as faker from 'faker';
import styled from 'styled-components';


const Wrapper = styled.div`
    height: 100%;
    overflow: auto;
`

const SampleForm = () => {

    const getAnimals = () => {
        const text = [];
        for (let i = 0; i < 100; i++) {
            text.push(faker.animal.dog())
        }
        return text;
    }

    return (
        <Wrapper>
            {getAnimals().join(', ')}
        </Wrapper>
    )
}


export default SampleForm;
