import styled from 'styled-components';
import { Link } from 'react-router-dom';
import {
    border, compose, color, space, position,
    layout, typography, flexbox, grid
} from 'styled-system'

const Button = styled.button`
    ${compose(color, space, layout, position, border, typography)}
    border-radius: 200px;
    &:active {
        transform: scale(0.98);
    }
`;

const Bubble = styled(Button)`
    background: none;
    height: 25px;
    border-radius: 50%;
    width: 25px;
    box-shadow: 0px 0px 3px dimgray;
    border: none;
    color: dimgray;
`

const NavLink = styled(Link)`

`

export { Button, Bubble, NavLink }