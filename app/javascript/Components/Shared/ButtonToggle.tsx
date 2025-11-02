import React, { useState } from 'react'
import { Button } from '../ui'

interface ButtonToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode
}

const ButtonToggle = (props: ButtonToggleProps) => {
    const {onClick, children, ...forwardProps} = props
    const [active, setActive] = useState(false)

    const clickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
        setActive(!active)
        if (onClick) {
            onClick(event)
        }
    }

    return (
        <Button 
            onClick={clickHandler} 
            variant={active ? 'default' : 'outline'} 
            {...forwardProps}
        >
            {children}
        </Button>
    )
}

export default ButtonToggle