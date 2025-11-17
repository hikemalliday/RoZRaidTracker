import { useEffect, useState } from 'react';

export function useDebounce(text, delay) {
    const [value, setValue] = useState('');

    useEffect(() => {
        const timerId = setTimeout(() => {
            setValue(text);
        }, delay);
        return () => {
            clearTimeout(timerId);
        };
    }, [text, delay]);
    return value;
}
