import React from 'react'
import { useParams } from "react-router-dom";

const Character = () => {
    let params = useParams();

    return (
        <div>{params.id}</div>
    )
}

export default Character