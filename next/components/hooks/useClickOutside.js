import { useEffect } from 'react';
import _get from 'lodash/get';

export const useClickOutside = (ref, callback) => {
    useEffect(() => {
        const handleClick = (e) => {
            const contains = _get(ref, 'current.contains');
            if (contains && !ref.current.contains(e.target)) {
                callback();
            }
        };
        document.addEventListener('click', handleClick, true);

        return () => document.removeEventListener('click', handleClick, true);
    }, []);
};