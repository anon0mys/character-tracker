import React from 'react'
import styled from 'styled-components';
import { Flex } from './Containers'
import { Bubble } from './Buttons'

const ModalBackground = styled.div`
	z-index: auto;
	display: ${({ show }) => (show ? 'block' : 'none')};
	position: fixed;
	top: 0;
	left: 0;
	height: 100vh;
	width:100vw;
	background: rgba(0,0,0,0.5);
`;

const ModalContainer = styled(Flex)`
    flex-direction: column;
    margin: 10% auto;
    padding: 1%;
    width: 25%;
    min-height: 250px;
    background: white;
    box-shadow: 0px 0px 10px dimgrey
`

const Modal = ({show, close, children}) => {
    return (
        <ModalBackground show={show} onClick={close}>
            <ModalContainer onClick={event => event.stopPropagation()}>
                <Flex flexDirection='row' justifyContent='flex-end' >
                    <Bubble onClick={close}>X</Bubble>
                </Flex>
                {children}
            </ModalContainer>
        </ModalBackground>
    )
}

export { Modal }