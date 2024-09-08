import React from 'react'

type Props = {
    item: any;
    onClick?: any;
    className?: any;
}

const Step = ({ item, onClick, className }: Props) => {
    return (
        <div onClick={() => onClick(item)} className={`m-step ${className}`}>{item?.title}</div>
    )
}

export default Step