/**
 * Memoize a function
 * @ignore
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
    const cache = new Map();
    const memoized = (...args: any[]) => {
        const key = JSON.stringify(args);
        if (!cache.has(key)) {
            cache.set(key, fn(...args));
        }
        return cache.get(key) as T;
    };
    return memoized as T;
}

/* eslint-enable @typescript-eslint/no-explicit-any */
