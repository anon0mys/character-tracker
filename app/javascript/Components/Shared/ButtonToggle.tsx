import React, { useState } from 'react'
import { Button } from '@chakra-ui/react'

const ButtonToggle = (props) => {
    const {onClick, children, ...forwardProps} = props
    const [active, setActive] = useState(false)

    const clickHandler = (event) => {
        setActive(!active)
        if (onClick) {
            onClick(event)
        }
    }

    return (
        <Button onClick={clickHandler} colorScheme={active ? 'teal' : 'grey'} {...forwardProps}>
            {children}
        </Button>
    )
}

export default ButtonToggle