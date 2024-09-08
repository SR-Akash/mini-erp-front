import { useState } from "react";

type Timeout = NodeJS.Timeout;

export default function useDebounce() {
    const [typingTimeout, setTypingTimeout] = useState<Timeout | null>(null);

    function debounce(func: () => void, wait: number = 500) {
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        const timer: Timeout = setTimeout(() => {
            func();
        }, wait);

        setTypingTimeout(timer);
    }

    return debounce;
}