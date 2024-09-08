import React, { useRef, useEffect, useState } from 'react';

type Props = {
    text: string;
};

const TextTooltip = (props: Props) => {
    const { text } = props;
    const containerRef = useRef<HTMLDivElement>(null);
    const [isTextOverflowing, setIsTextOverflowing] = useState(false);

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            setIsTextOverflowing(container.scrollWidth > container.clientWidth);
        }
    }, [text]);

    return (
        <div className="itooltip" ref={containerRef}>
            {text}
            {isTextOverflowing && (
                <span className="tooltiptext">{text}</span>
            )}
        </div>
    );
};

export default TextTooltip;
