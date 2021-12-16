import React from 'react'

const CalcButton = (props) => {
    
    const { id , label , onClick } = props
    return (
        <div className={`calc-button ${props.className}`} id={id} onClick={onClick}>
            {label}
        </div>
    )
}

export default CalcButton
